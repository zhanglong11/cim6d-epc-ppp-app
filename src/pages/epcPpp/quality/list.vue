<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleItemClick(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.locationName }}</view>
                <view>工程类别：{{ $getLabel(engineeringTypeList, item.engineeringCategory) }}</view>
                <view
                  >问题类型：{{
                    $getLabel($getArgList(item.engineeringCategory + '_qualityIssueType'), item.issueType)
                  }}
                </view>
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
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAdd" />
    <EmptyTemplate v-if="total === 0" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">工程类别</h6>
        <uni-checkbox-button-group v-model="drawerForm.engineeringCategory" hasAll :options="engineeringTypeList" />
        <h6 class="label">问题类别</h6>
        <uni-checkbox-button-group v-model="drawerForm.issueType" hasAll :options="qualityQuestionTypeList" />
        <h6 class="label">状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="statusList"></uni-checkbox-button-group>
        <h6 class="label">发现日期</h6>
        <uni-date-picker v-model="drawerForm.date" mode="range"></uni-date-picker>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import statusList from '@/pages/epcPpp/quality/lib/statusList'
import _ from 'lodash'
import Api from '@/pages/epcPpp/quality/api'
export default {
  name: 'EpcPPPQualityManage',
  data() {
    return {
      filterForm: {
        search: '',
        planType: 1,
        page: 1,
        rows: 10,
        projectId: wx.getStorageSync('projectId'),
        date: []
      },
      drawerForm: {},
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
      return this.$getArgList('epcPPPEngineeringType')
    },
    //问题类型
    qualityQuestionTypeList() {
      return this.$getArgList(this.drawerForm.engineeringCategory + '_qualityIssueType')
    }
  },
  watch: {
    'filterForm.inspectStatus'() {
      this.init()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let beginDate = (data.date && data.date[0] && this.moment(data.date[0]).format('YYYY-MM-DD 00:00:00')) || ''
      let endDate = (data.date && data.date[1] && this.moment(data.date[1]).format('YYYY-MM-DD 23:59:59')) || ''
      let res = await Api.getList({ ...data, beginDate, endDate }).finally(() => {
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
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.search = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.search = ''
      this.init()
    },
    handleAdd() {
      this.$utils.toUrl('/pages/epcPpp/quality/add')
    },
    handleItemClick(row) {
      if (row.status === 0) {
        //未取消
        this.$utils.toUrl(`/pages/epcPpp/quality/no-cancel-detail?id=${row.id}`)
      } else {
        this.$utils.toUrl(`/pages/epcPpp/quality/cancel-detail?id=${row.id}`)
      }
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
