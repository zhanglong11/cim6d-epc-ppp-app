<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!-- 项目概况 start -->
        <uni-card>
          <view class="card-header">
            <view class="title">
              <view class="icon icon-board-info"></view>
              <text>项目状况</text>
            </view>
            <view class="subTitle border-bottom">
              <view class="subItem">
                <view class="subItem-count">{{ procedureInfo.taskOverNum || 0 }}</view>
                <view class="subItem-text border">完成任务</view>
              </view>
              <view class="subItem">
                <view class="subItem-count">{{ procedureInfo.taskDelayNum || 0 }}</view>
                <view class="subItem-text border">延期任务</view>
              </view>
              <view class="subItem">
                <view class="subItem-count danger">{{ procedureInfo.taskOverRate || '0%' }}</view>
                <view class="subItem-text border">完成率</view>
              </view>
              <view class="subItem">
                <view class="subItem-count danger">{{ procedureInfo.taskDelayRate || '0%' }}</view>
                <view class="subItem-text"> 延期率</view>
              </view>
            </view>
          </view>
          <view class="card-body">
            <view class="btn-container">
              <view class="taskTotal">
                <view>{{ procedureInfo.taskTotal || 0 }}</view>
                <view>总任务数</view>
              </view>

              <button class="mini-btn button costType" type="primary" size="mini" @click="handleToggleProcedureType">
                {{ procedureType === 'month' ? '年' : '月' }}
              </button>
            </view>
            <gauge-chart :dataAs="procedureOption" canvasId="procedure"></gauge-chart>
          </view>
          <view class="card-footer  border-top">
            <text>数据更新时间:{{ updateTime }}</text>
          </view>
        </uni-card>
        <!-- 项目状况end  -->
        <!--  -->
        <!-- 质量检查 start  -->
        <uni-card>
          <view class="card-header">
            <view class="title">
              <view class="icon icon-board-inspect"></view>
              <text>质量检查</text>
            </view>
            <view class="subTitle border-bottom">
              <view class="subItem">
                <view class="subItem-count danger">{{ inspectInfo.problemNum }}</view>
                <view class="subItem-text border">问题数量</view>
              </view>
              <view class="subItem">
                <view class="subItem-count warn">{{ inspectInfo.notReviewedNum }}</view>
                <view class="subItem-text border">待复检</view>
              </view>
              <view class="subItem">
                <view class="subItem-count ">{{ inspectInfo.reviewPassRate }}%</view>
                <view class="subItem-text border">检查合格率</view>
              </view>
              <view class="subItem">
                <view class="subItem-count ">{{ inspectInfo.rectifyInTimeRate }}%</view>
                <view class="subItem-text"> 及时整改率</view>
              </view>
            </view>
          </view>
          <view class="card-body">
            <ring-chart
              v-if="inspectOptions && inspectOptions.series && inspectOptions.series.length"
              :dataAs="inspectOptions"
              canvasId="inspect"
            />
            <view v-else class="empty-wrapper">
              <image src="../../../static/images/empty.png"></image>
            </view>
          </view>
          <view class="card-footer  border-top">
            <text>数据更新时间:{{ updateTime }}</text>
            <text class="moreTip" @click="$utils.toUrl('/pages/inspect/index')">查看更多</text>
          </view>
        </uni-card>
        <!-- 质量检查 end  -->
        <!--  -->
        <!-- 安全检查 start  -->
        <uni-card>
          <view class="card-header">
            <view class="title">
              <view class="icon icon-board-safe"></view>
              <text>安全检查</text>
            </view>
            <view class="subTitle border-bottom">
              <view class="subItem">
                <view class="subItem-count danger">{{ safetyInfo.problemNum }}</view>
                <view class="subItem-text border">问题数量</view>
              </view>
              <view class="subItem">
                <view class="subItem-count warn">{{ safetyInfo.notReviewedNum }}</view>
                <view class="subItem-text border">待复检</view>
              </view>
              <view class="subItem">
                <view class="subItem-count ">{{ safetyInfo.reviewPassRate }}%</view>
                <view class="subItem-text border">检查合格率</view>
              </view>
              <view class="subItem">
                <view class="subItem-count ">{{ safetyInfo.rectifyInTimeRate }}%</view>
                <view class="subItem-text"> 及时整改率</view>
              </view>
            </view>
          </view>
          <view class="card-body">
            <ring-chart
              v-if="safetyOptions && safetyOptions.series && safetyOptions.series.length"
              :dataAs="safetyOptions"
              canvasId="safe"
            />
            <view v-else class="empty-wrapper">
              <image src="../../../static/images/empty.png"></image>
            </view>
          </view>
          <view class="card-footer  border-top">
            <text>数据更新时间:{{ updateTime }}</text>
            <text class="moreTip" @click="$utils.toUrl('/pages/safe/index')">查看更多</text>
          </view>
        </uni-card>
        <!-- 安全检查 end  -->
        <!--  -->
        <!-- 成本情况统计 start  -->
        <uni-card>
          <view class="card-header">
            <view class="title">
              <view class="icon icon-board-cost"></view>
              <text>成本情况</text>
            </view>
            <view class="subTitle border-bottom">
              <view class="subItem">
                <view class="subItem-count warn">{{ costBaseInfo.totalProfitLoss | formatMoneyBaseWan }}</view>
                <view class="subItem-text border">总盈亏</view>
              </view>
              <view class="subItem">
                <view class="subItem-count warn">{{ costBaseInfo.currentMonthProfitLoss | formatMoneyBaseWan }}</view>
                <view class="subItem-text border">本月盈亏</view>
              </view>
              <view class="subItem">
                <view class="subItem-count "> {{ costBaseInfo.totalSectionSuper | formatMoneyBaseWan }}</view>
                <view class="subItem-text border">总节超</view>
              </view>
              <view class="subItem">
                <view class="subItem-count ">
                  {{ costBaseInfo.currentMonthSectionSuper | formatMoneyBaseWan }}
                </view>
                <view class="subItem-text">本月节超</view>
              </view>
            </view>
          </view>
          <view class="card-body">
            <view class="btn-container">
              <button class="mini-btn button costType" type="primary" size="mini" @click="handleToggleCostType">
                {{ costType === 'total' ? '月' : '总' }}
              </button>
            </view>
            <histogram-chart :dataAs="costOptions" canvasId="cost"></histogram-chart>
          </view>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import RingChart from '@/components/stan-ucharts/RingChart.vue'
import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue'
import GaugeChart from '@/components/stan-ucharts/GaugeChart.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'Project',
  components: {
    RingChart,
    HistogramChart,
    GaugeChart
  },
  data() {
    return {
      updateTime: moment().format('HH:mm'),
      // 项目状况数据,
      procedureType: 'month',
      procedureInfo: {},
      procedureOption: {
        series: [
          {
            name: '本月进度',
            data: 0
          }
        ]
      },
      degreeOptions: [
        {
          id: 'generalTroubleNum',
          name: '一般隐患',
          color: '#268dfe'
        },
        {
          name: '较大隐患',
          id: 'largerTroubleNum',
          color: '#ffcd69'
        },
        {
          name: '重大隐患',
          id: 'majorTroubleNum',
          color: '#ff9326'
        },
        {
          name: '严重隐患',
          id: 'seriousTroubleNum',
          color: '#fa7673'
        }
      ],
      inspectInfo: {},
      // 质量检查数据
      inspectOptions: {
        series: []
      },
      safetyInfo: {},
      // 安全检查数据
      safetyOptions: {
        series: []
      },
      // 成本情况
      costBaseInfo: {},
      costType: 'total', //total:总统计 ，month ：本月统计
      costTotalInfo: {
        categories: ['总合同收入', '总预算成本', '总实际成本']
      },
      costMonthInfo: {
        categories: ['月合同收入', '月预算成本', '月实际成本']
      },
      defaultData: [0, 0, 0],
      costOptions: {
        //总模板
        categories: ['总合同收入', '总预算成本', '实际成本'],
        series: [
          {
            name: '', //数据名称
            data: [],
            show: true, //图形显示状态，配合点击图例显示状态，也可默认指定是否显示
            color: '#268dfe', //	图形颜色 不传入则使用系统默认配色方案 即统一柱状图颜色
            textSize: 12 //图形上方标注文字的字体大小
            //如涉及混合图表请看 http://doc.ucharts.cn/1172126
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },

  onShow() {
    this.init()
  },
  methods: {
    init() {
      this.formatterCostOptions()
      this.initInspectInfo()
      this.initSafetyInfo()
      this.initProcedureInfo()
      this.initCostInfo()
    },
    // 项目状况切换年月
    handleToggleProcedureType() {
      this.procedureType = this.procedureType === 'month' ? 'year' : 'month'
      this.formatProcedureOption()
    },
    //成本情况切换月和total
    handleToggleCostType() {
      ;(this.costType = this.costType === 'total' ? 'month' : 'total'), this.formatterCostOptions()
    },
    async initCostInfo() {
      let result = await this.fly.synergy.get(`/cost/manage/statistics/${this.projectId}`)
      let datas = result.data || {}
      this.costBaseInfo = datas
      let monthInfo = [datas.currentMonthContractIncome, datas.currentMonthBudgetCost, datas.currentMonthRealCost]
      let totalInfo = [datas.totalContractIncome, datas.totalBudgetCost, datas.totalRealCost]
      this.costTotalInfo.data = totalInfo
      this.costMonthInfo.data = monthInfo
    },
    //格式化成本情况数据
    formatterCostOptions() {
      if (this.costType === 'total') {
        this.costOptions.categories = this.costTotalInfo.categories
        this.costOptions.series[0].data = this.costTotalInfo.data || this.defaultData
      } else {
        this.costOptions.categories = this.costMonthInfo.categories
        this.costOptions.series[0].data = this.costMonthInfo.data || this.defaultData
      }
    },
    // 初始化项目状况
    async initProcedureInfo() {
      let result = await this.fly.synergy.get(`progress/view/${this.projectId}`)
      this.procedureInfo = result.data || {}
      this.formatProcedureOption()
    },
    //格式化项目状况图表数据
    formatProcedureOption() {
      if (this.procedureType === 'month') {
        this.procedureOption = {
          series: [
            {
              name: '本月进度',
              data: this.procedureInfo.curMonthProgress || 0
            }
          ]
        }
      } else {
        this.procedureOption = {
          series: [
            {
              name: '年计划进度',
              data: this.procedureInfo.yearPlanProgress || 0
            }
          ]
        }
      }
    },
    // 获取质量检查统计信息
    initInspectInfo() {
      let params = {
        planType: 1,
        projectId: this.projectId
      }
      this.fly.safety
        .post('inspect/statistical', params, {
          isLoading: true
        })
        .then(result => {
          if (result.code === 200) {
            this.inspectInfo = result.data || {}
            this.inspectOptions.series = this._.map(this.degreeOptions, item => {
              let seriesItem = this._.cloneDeep(item)
              this.$set(seriesItem, 'data', this.inspectInfo[item.id])
              return seriesItem
            })
          }
        })
    },
    // 获取质量检查统计信息
    initSafetyInfo() {
      let params = {
        planType: 2,
        projectId: this.projectId
      }
      this.fly.safety
        .post('inspect/statistical', params, {
          isLoading: true
        })
        .then(result => {
          if (result.code === 200) {
            this.safetyInfo = result.data || {}
            this.safetyOptions.series = this._.map(this.degreeOptions, item => {
              let seriesItem = this._.cloneDeep(item)
              this.$set(seriesItem, 'data', this.safetyInfo[item.id])
              return seriesItem
            })
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./project.less');
</style>
