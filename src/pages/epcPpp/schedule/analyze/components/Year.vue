<template>
  <div>
    <div v-if="tableData2.length">
      <uni-card :title="year + '年进度分析柱状图'">
        <HistogramChart
          key="year-chart-1"
          canvas-id="chart-1"
          labelKey="label"
          valueKey="value"
          :dataAs="chartData"
          :legendAs="legendAs"
          :colors="colors"
          :yAxisAs="{ formatter: { unit: '个' } }"
          :width="700"
          :height="620"
          style="width: 700rpx; height: 640rpx; padding: 15px 0; background-color: #fff"
        ></HistogramChart>
      </uni-card>
      <uni-card :title="year + '年进度总数据对比分析表'">
        <t-table>
          <t-tr>
            <t-th></t-th>
            <t-th>进度领取数量</t-th>
            <t-th>进度完成数量</t-th>
            <t-th>进度延期数量</t-th>
          </t-tr>
          <t-tr v-for="(item, index) in data1" :key="index">
            <t-td>{{ index + 1 + '月' }}</t-td>
            <t-td>{{ _.get(item, 'normalFinishedNum') }}</t-td>
            <t-td>{{ _.get(item, 'advanceFinishedNum') }}</t-td>
            <t-td>{{ _.get(item, 'delayFinishedNum') }}</t-td>
          </t-tr>
          <t-tr>
            <t-td>总计</t-td>
            <t-td>{{ _.sumBy(data1, 'normalFinishedNum') }}</t-td>
            <t-td>{{ _.sumBy(data1, 'advanceFinishedNum') }}</t-td>
            <t-td>{{ _.sumBy(data1, 'delayFinishedNum') }}</t-td>
          </t-tr>
        </t-table>
      </uni-card>
      <uni-card :title="year + '年不同单位进度分析柱状图'">
        <HistogramChart
          key="year-chart-2"
          :showTooltipCategory="false"
          canvas-id="chart-2"
          labelKey="label"
          valueKey="value"
          :dataAs="chartDataTwo"
          :legendAs="legendAs"
          :colors="colors"
          :yAxisAs="{ formatter: { unit: '个' } }"
          :width="700"
          :height="620"
          style="width: 700rpx; height: 640rpx; padding: 15px 0; background-color: #fff"
        ></HistogramChart>
      </uni-card>
      <uni-card v-for="(company, index) in tableData2" :key="index" :title="company.title">
        <t-table>
          <t-tr>
            <t-th></t-th>
            <t-th>进度领取数量</t-th>
            <t-th>进度完成数量</t-th>
            <t-th>进度延期数量</t-th>
          </t-tr>
          <t-tr v-for="(item, index2) in company.data" :key="index2">
            <t-td>{{ index + 1 + '月' }}</t-td>
            <t-td>{{ _.get(item, 'normalFinishedNum') }}</t-td>
            <t-td>{{ _.get(item, 'advanceFinishedNum') }}</t-td>
            <t-td>{{ _.get(item, 'delayFinishedNum') }}</t-td>
          </t-tr>
          <t-tr>
            <t-td>总计</t-td>
            <t-td>{{ _.sumBy(data1, 'normalFinishedNum') }}</t-td>
            <t-td>{{ _.sumBy(data1, 'advanceFinishedNum') }}</t-td>
            <t-td>{{ _.sumBy(data1, 'delayFinishedNum') }}</t-td>
          </t-tr>
        </t-table>
      </uni-card>
    </div>
    <EmptyTemplate v-else></EmptyTemplate>
  </div>
</template>

<script>
import HistogramChart from '@/components/stan-ucharts/HistogramChart'
import api from '../../api'
import moment from 'moment'
import tTable from '@/components/t-table/t-table'
import tTh from '@/components/t-table/t-th'
import tTr from '@/components/t-table/t-tr'
import tTd from '@/components/t-table/t-td'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { HistogramChart, tTable, tTh, tTr, tTd },
  props: {
    year: {
      type: Number
    }
  },
  data() {
    // 这里存放数据
    return {
      // 年进度分析数据
      chartData: {
        label: [
          // '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
        ],
        value: [
          // { name: '啊啊', data: [1, 2, 3] }
        ]
      },
      // 不同单位图表数据
      chartDataTwo: {
        label: [
          // '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
        ],
        value: [
          // { name: '啊啊', data: [1, 2, 3] }
        ]
      },
      legendAs: {
        legend: {
          show: true, //是否显示各类别的图例标识
          position: 'bottom',
          float: 'center',
          padding: 10,
          margin: 0
        },
        extra: {
          column: {
            width: 6
          }
        }
      },
      colors: ['#0079fe', '#fecc68', '#fe9225', '#f00'],
      tableData: [{}, {}],
      tableData2: [{}, {}],
      filterForm: {
        year: 2020
      },
      data1: []
    }
  },
  watch: {
    year() {
      this.refresh()
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      api
        .getPeriodAnalyze({
          cycleType: 1,
          start: moment().year(this.year).startOf('year').format('YYYY-MM-DD 00:00:00'),
          end: moment().year(this.year).endOf('year').format('YYYY-MM-DD 23:59:59')
        })
        .then(res => {
          let arr = []
          for (let i = 1; i < 13; i++) {
            arr.push(res.data[i])
          }
          this.data1 = arr
          this.chartData = {
            label: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            value: [
              {
                name: '正常完成数量',
                data: _.map(arr, e => e?.normalFinishedNum || '')
              },
              {
                name: '超前完成数量',
                data: _.map(arr, e => e?.advanceFinishedNum || '')
              },
              {
                name: '滞后延期数量',
                data: _.map(arr, e => e?.delayFinishedNum || '')
              }
            ]
          }
        })
      api
        .getCompanyPeriodAnalyze({
          cycleType: 1,
          start: moment().year(this.year).startOf('year').format('YYYY-MM-DD 00:00:00'),
          end: moment().year(this.year).endOf('year').format('YYYY-MM-DD 23:59:59')
        })
        .then(res => {
          let prettyDataHash = _.mapValues(res.data, (v, k) => {
            let arr = []
            for (let i = 1; i < 13; i++) {
              arr.push(v[i])
            }
            return {
              name: k,
              totalNormalFinishedNum: _.sumBy(arr, 'normalFinishedNum'),
              totalAdvanceFinishedNum: _.sumBy(arr, 'advanceFinishedNum'),
              totalDelayFinishedNum: _.sumBy(arr, 'delayFinishedNum')
            }
          })
          let prettyDataArray = _.values(prettyDataHash)
          this.chartDataTwo = {
            label: _.map(prettyDataArray, 'name'),
            value: [
              {
                name: '正常完成数量',
                data: _.map(prettyDataArray, e => e.totalNormalFinishedNum || '')
              },
              {
                name: '超前完成数量',
                data: _.map(prettyDataArray, e => e.totalAdvanceFinishedNum || '')
              },
              {
                name: '滞后延期数量',
                data: _.map(prettyDataArray, e => e.totalDelayFinishedNum || '')
              }
            ]
          }

          this.tableData2 = _.map(res.data, (v, k) => {
            let arr = []
            for (let i = 1; i < 13; i++) {
              arr.push(v[i])
            }
            return {
              title: k,
              data: arr
            }
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.main {
  padding-top: 10px;
}
.uni-card {
  width: 720px;
}
.t-table {
  width: 720px;
  margin: 0;
}
.t-th {
  font-size: 12px;
}
</style>
