<template>
  <view>
    <h4 style="margin: 10rpx 0 0 20rpx;">分析类型</h4>
    <HistogramChart
      :dataAs="IssueOptions"
      :xAxisAs="{ itemCount: 6 }"
      :yAxisAs="{ formatter: { unit: '' } }"
      :legendAs="legendAs"
      canvasId="safetyIssueMonthChart"
    ></HistogramChart>
    <h4 style="margin: 30rpx 0 0 20rpx;">{{ year }}年{{ month }}月不同种类的安全问题数量占比统计</h4>
    <view class="marginTop20">
      <PieChart
        :dataAs="IssueTypeOptions"
        :legendAs="{
          legend: {
            lineHeight: 20
          }
        }"
        canvasId="safetyIssueMonthTypeChart"
      />
    </view>
    <view class="marginTop20">
      <uni-search-bar
        placeholder="搜索"
        @confirm="handleSearchBarConfirm"
        @input="handleSearchBarInput"
      ></uni-search-bar>
      <view style="position: relative;">
        <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
          <view class="main-body">
            <block>
              <uni-card v-for="item in list" :key="item.id" @click.native="handleItemClick(item)">
                <view class="card-body">
                  <view
                    class="card-info"
                    :class="{
                      special: item.status === 0,
                      commonly: item.status === 1
                    }"
                  >
                    <view class="title">{{ item.locationName }}</view>
                    <view>问题类型：{{ $getLabel(safetyQuestionTypeList, item.issueType) }}</view>
                    <view>问题描述：{{ item.description }}</view>
                  </view>

                  <block>
                    <uni-status :options="statusList" :value="item.status"></uni-status>
                  </block>
                </view>
                <view class="card-footer border-top">
                  <text>发现人：{{ item.discoveryPersonName }}</text>
                  <text>发现日期： {{ item.discoveryDate | ymd }}</text>
                </view>
              </uni-card>
            </block>
            <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
          </view>
        </scroll-view>
        <EmptyTemplate v-if="total === 0" />
      </view>
    </view>
  </view>
</template>

<script>
import _ from 'lodash'
import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue'
import PieChart from '@/components/stan-ucharts/PieChart.vue'
import Api from '@/pages/epcPpp/safety/api'
import statusList from '@/pages/epcPpp/safety/lib/statusList'
import { mapGetters } from 'vuex'
export default {
  name: 'IssueMonth',
  components: { HistogramChart, PieChart },
  props: {
    year: {
      type: [Number, String],
      default: ''
    },
    month: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      projectId: wx.getStorageSync('projectId'),
      IssueOptions: {
        categories: [],
        series: []
      },
      legendAs: {
        legend: {
          show: true, //是否显示各类别的图例标识
          position: 'bottom',
          padding: 10,
          margin: 0
        },
        extra: {
          column: {
            width: 10
          }
        }
      },
      IssueTypeOptions: {
        series: []
      },
      tableObj: {},
      filterForm: {
        page: 1,
        rows: 10,
        personName: '',
        beginDate: this.moment(this.year + '-' + (this.month > 10 ? this.month : '0' + this.month))
          .startOf('month')
          .format('YYYY-MM-DD 00:00:00'),
        endDate: this.moment(this.year + '-' + (this.month > 10 ? this.month : '0' + this.month))
          .endOf('month')
          .format('YYYY-MM-DD 23:59:59')
      },
      statusList,
      loading: false,
      list: [],
      total: 0
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    //工程类型
    engineeringTypeList() {
      return this.$getArgList('epcPPPEngineeringType') || []
    },
    //问题类型
    safetyQuestionTypeList() {
      return this.$getArgList('epcPPPSafetyIssueType') || []
    }
  },
  created() {
    this.getData()
    this.getTypeData()
    this.refresh()
  },
  methods: {
    //获取月份柱状图
    async getData() {
      let res = await Api.getMonthAnalysis({ year: this.year, month: this.month })
      let obj = {
        '0': [],
        '1': []
      }
      res.data &&
        res.data.map(item => {
          obj[item.rectify] = [
            item.oneWeek || 0,
            item.twoWeek || 0,
            item.threeWeek || 0,
            item.fourWeek || 0,
            item.fiveWeek || 0,
            item.sixWeek || 0
          ]
        })
      this.IssueOptions = {
        enableScroll: true,
        categories: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周'],
        series: [
          {
            name: '按期整改',
            data: obj['0']
          },
          {
            name: '未按期整改',
            data: obj['1']
          }
        ]
      }
      this.tableObj = obj
    },
    //获取月份问题类型
    async getTypeData() {
      let res = await Api.getIssueTypeByYear({ year: this.year, month: this.month })
      let series =
        res.data &&
        res.data.map(item => {
          return {
            name: this.$getLabel(this.safetyQuestionTypeList, item.engineeringCategory),
            data: item.count
          }
        })
      this.IssueTypeOptions = {
        series: series
      }
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.personName = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.personName = ''
      this.init()
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    //获取数据
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getList({ ...data }).finally(() => {
        this.loading = false
      })
      let records = (res.data && res.data.records) || []
      this.list = [...this.list, ...records]
      this.total = res.data ? res.data.total : 0
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    handleItemClick(row) {
      if (row.status === 0) {
        //未取消
        this.$utils.toUrl(`/pages/epcPpp/safety/no-cancel-detail?id=${row.id}`)
      } else {
        this.$utils.toUrl(`/pages/epcPpp/safety/cancel-detail?id=${row.id}`)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url('../index.less');
.marginTop20 {
  margin-top: 40rpx;
}
.main-body {
  position: relative;
}
</style>
