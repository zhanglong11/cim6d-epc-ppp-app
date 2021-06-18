<template>
  <view>
    <h4 style="margin: 10rpx 0 0 20rpx;">分析类型</h4>
    <LineChart :dataAs="qualityIssueOptions" :xAxisAs="{ itemCount: 7 }" canvasId="qualityIssueChart"></LineChart>
    <h4 style="margin: 30rpx 0 0 20rpx;">{{ thisYearLabel[0] }}年安全问题数据对比分析表</h4>
    <view class="tableContainer">
      <t-table style="width: 700rpx; margin: 20rpx auto;">
        <t-tr>
          <t-th></t-th>
          <t-th :width="300">{{ thisYearLabel[0] }}</t-th>
          <t-th>{{ lastYearLabel[0] }}</t-th>
          <t-th>同比增加</t-th>
        </t-tr>
        <t-tr v-for="(item, index) in thisYearData" :key="'yearDate' + index">
          <t-td>{{ index + 1 }}月</t-td>
          <t-td>{{ item }}</t-td>
          <t-td>{{ lastYearData[index] }}</t-td>
          <t-td>{{ item - lastYearData[index] }}</t-td>
        </t-tr>
        <t-tr>
          <t-th>总计</t-th>
          <t-th>{{ thisTotal }}</t-th>
          <t-th>{{ lastTotal }}</t-th>
          <t-th>{{ thisTotal - lastTotal }}</t-th>
        </t-tr>
      </t-table>
    </view>
  </view>
</template>

<script>
import _ from 'lodash'
import LineChart from '@/components/stan-ucharts/LineChart.vue'
import Api from '@/pages/epcPpp/safety/api'
import tTable from '@/components/t-table/t-table'
import tTh from '@/components/t-table/t-th'
import tTr from '@/components/t-table/t-tr'
import tTd from '@/components/t-table/t-td'
export default {
  name: 'SafetyIssueDiff',
  components: { LineChart, tTable, tTh, tTr, tTd },
  data() {
    return {
      projectId: wx.getStorageSync('projectId'),
      qualityIssueOptions: {
        categories: [],
        series: []
      },
      thisTotal: 0, //今年总记
      thisYearLabel: '', //今年标题
      thisYearData: [], //今年数据数组
      lastTotal: 0, //去年总记
      lastYearLabel: 0, //去年标题
      lastYearData: 0 //去年数据数组
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      let res = await Api.getYearDiff()
      let thisYear = res.data.thisYear || []
      let thisYearInit = {
        year: thisYear?.[0]?.year,
        january: _.find(thisYear, { month: '1' })?.data || 0,
        february: _.find(thisYear, { month: '2' })?.data || 0,
        march: _.find(thisYear, { month: '3' })?.data || 0,
        april: _.find(thisYear, { month: '4' })?.data || 0,
        may: _.find(thisYear, { month: '5' })?.data || 0,
        june: _.find(thisYear, { month: '6' })?.data || 0,
        july: _.find(thisYear, { month: '7' })?.data || 0,
        august: _.find(thisYear, { month: '8' })?.data || 0,
        september: _.find(thisYear, { month: '9' })?.data || 0,
        october: _.find(thisYear, { month: '10' })?.data || 0,
        november: _.find(thisYear, { month: '11' })?.data || 0,
        december: _.find(thisYear, { month: '12' })?.data || 0
      }
      let thisTotal = 0
      Object.keys(thisYearInit).map(item => {
        if (item !== 'year') {
          thisTotal += thisYearInit[item] - 0
        }
      })
      thisYearInit.total = thisTotal
      this.thisTotal = thisTotal
      let thisYearData = Object.values(thisYearInit).splice(1, 12)
      let thisYearLabel = Object.values(thisYearInit).splice(0, 1)
      this.thisYearData = thisYearData
      this.thisYearLabel = thisYearLabel
      let lastYear = res.data.lastYear || []
      let lastYearInit = {
        year: lastYear?.[0]?.year,
        january: _.find(lastYear, { month: '1' })?.data || 0,
        february: _.find(lastYear, { month: '2' })?.data || 0,
        march: _.find(lastYear, { month: '3' })?.data || 0,
        april: _.find(lastYear, { month: '4' })?.data || 0,
        may: _.find(lastYear, { month: '5' })?.data || 0,
        june: _.find(lastYear, { month: '6' })?.data || 0,
        july: _.find(lastYear, { month: '7' })?.data || 0,
        august: _.find(lastYear, { month: '8' })?.data || 0,
        september: _.find(lastYear, { month: '9' })?.data || 0,
        october: _.find(lastYear, { month: '10' })?.data || 0,
        november: _.find(lastYear, { month: '11' })?.data || 0,
        december: _.find(lastYear, { month: '12' })?.data || 0
      }
      let lastTotal = 0
      Object.keys(lastYearInit).map(item => {
        if (item !== 'year') {
          lastTotal += lastYearInit[item] - 0
        }
      })
      lastYearInit.total = lastTotal
      this.lastTotal = lastTotal
      let lastYearData = Object.values(lastYearInit).splice(1, 12)
      let lastYearLabel = Object.values(lastYearInit).splice(0, 1)
      this.lastYearData = lastYearData
      this.lastYearLabel = lastYearLabel
      this.qualityIssueOptions = {
        categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        series: [
          {
            name: lastYearLabel,
            data: lastYearData,
            color: '#42f569'
          },
          {
            name: thisYearLabel,
            data: thisYearData,
            color: '#1196ec'
          }
        ]
      }
    }
  }
}
</script>

<style scoped lang="less">
.tableContainer {
  margin-top: 30rpx;
}
</style>
