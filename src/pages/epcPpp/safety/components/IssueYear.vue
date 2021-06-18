<template>
  <view>
    <h4 style="margin: 10rpx 0 0 20rpx;">分析类型</h4>
    <HistogramChart
      :dataAs="IssueOptions"
      :xAxisAs="{ itemCount: 6 }"
      :yAxisAs="{ formatter: { unit: '' } }"
      :legendAs="legendAs"
      canvasId="safetyIssueYearChart"
    ></HistogramChart>
    <h4 style="margin: 30rpx 0 0 20rpx;">{{ year }}年不同种类的安全问题数量占比统计</h4>
    <view class="marginTop20">
      <PieChart
        :dataAs="IssueTypeOptions"
        :legendAs="{
          legend: {
            lineHeight: 20
          }
        }"
        canvasId="qualityIssueYearTypeChart"
      />
    </view>
    <h4 style="margin: 30rpx 0 0 20rpx;">{{ year }}年安全问题数据对比分析表</h4>
    <view class="marginTop20">
      <t-table style="width: 700rpx; margin: 20rpx auto;">
        <t-tr>
          <t-th></t-th>
          <t-th>安全问题</t-th>
          <t-th>按期整改</t-th>
          <t-th>未按期整改</t-th>
          <t-th>环比增加</t-th>
        </t-tr>
        <t-tr v-for="(item, index) in tableObj['1']" :key="'yearTableData' + index">
          <t-td>{{ index + 1 }}月</t-td>
          <t-td>{{ tableObj['1'][index] }}</t-td>
          <t-td>{{ tableObj['2'][index] }}</t-td>
          <t-td>{{ tableObj['3'][index] }}</t-td>
          <t-td v-if="index === 0">/</t-td>
          <t-td v-else>{{ tableObj['1'][index] - tableObj['1'][index - 1] }}</t-td>
        </t-tr>
        <t-tr>
          <t-th>总计</t-th>
          <t-th>{{ _.sum(tableObj['1']) }}</t-th>
          <t-th>{{ _.sum(tableObj['2']) }}</t-th>
          <t-th>{{ _.sum(tableObj['3']) }}</t-th>
          <t-th>/</t-th>
        </t-tr>
      </t-table>
    </view>
  </view>
</template>

<script>
import _ from 'lodash'
import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue'
import PieChart from '@/components/stan-ucharts/PieChart.vue'
import Api from '@/pages/epcPpp/safety/api'
import tTable from '@/components/t-table/t-table'
import tTh from '@/components/t-table/t-th'
import tTr from '@/components/t-table/t-tr'
import tTd from '@/components/t-table/t-td'
export default {
  name: 'IssueYear',
  components: { HistogramChart, PieChart, tTable, tTh, tTr, tTd },
  props: {
    year: {
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
      tableObj: {}
    }
  },
  computed: {
    //问题类型
    safetyQuestionTypeList() {
      return this.$getArgList('epcPPPSafetyIssueType') || []
    }
  },
  created() {
    this.getData()
    this.getTypeData()
  },
  methods: {
    async getData() {
      let res = await Api.getYearAnalysis({ year: this.year })
      let obj = {
        1: _.fill(Array(12), 0),
        2: _.fill(Array(12), 0),
        3: _.fill(Array(12), 0)
      }
      res.data &&
        res.data.map(item => {
          obj[item.projectType] = [
            item.january || 0,
            item.february || 0,
            item.march || 0,
            item.april || 0,
            item.may || 0,
            item.june || 0,
            item.july || 0,
            item.august || 0,
            item.september || 0,
            item.october || 0,
            item.november || 0,
            item.december || 0
          ]
        })
      this.IssueOptions = {
        enableScroll: true,
        categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        series: [
          {
            name: '安全问题',
            data: obj[1]
          },
          {
            name: '按期整改',
            data: obj[2]
          },
          {
            name: '未按期整改',
            data: obj[3]
          }
        ]
      }
      this.tableObj = obj
    },
    async getTypeData() {
      let res = await Api.getIssueTypeByYear({ year: this.year })
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
    }
  }
}
</script>

<style scoped lang="less">
.marginTop20 {
  margin-top: 40rpx;
}
</style>
