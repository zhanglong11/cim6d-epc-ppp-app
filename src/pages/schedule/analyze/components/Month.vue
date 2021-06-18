<template>
  <div>
    <uni-card :title="`${year}年${month}月进度分析柱状图`">
      <HistogramChart
        labelKey="label"
        valueKey="value"
        :dataAs="chartData"
        :legendAs="legendAs"
        :colors="colors"
        :yAxisAs="{ formatter: { unit: '个' } }"
        :width="700"
        :height="600"
        style="width: 700rpx; height: 600rpx; padding: 15px 0; background-color: #fff;"
      ></HistogramChart>
    </uni-card>
    <uni-card :title="`${year}年${month}不同状态任务完成数量占比统计`">
      <PieChart
        :dataAs="chartData2"
        :colors="colors"
        valueKey="value"
        :yAxisAs="{ formatter: { unit: '个' } }"
        :width="700"
        :height="600"
        style="width: 700rpx; height: 600rpx; padding: 15px 0; background-color: #fff;"
      ></PieChart>
    </uni-card>
    <uni-card-tree :list="list" itemKey="taskId" style="margin-top: 15px;">
      <template v-slot="{ item }">
        <div
          class="item"
          :style="{ color: item.status === 5 ? 'red' : item.status === 3 ? '#00CC66' : '' }"
          @click="$utils.toUrl('/pages/schedule/view/taskDetail?id=' + item.taskId)"
        >
          <h6 :style="{ color: [2, 5].includes(item.status) ? 'red' : item.status === 3 ? '#00CC66' : '' }">
            {{ item.taskName }}
          </h6>
          <ul>
            <li>
              <span>计划开始日期:</span><span>{{ item.planStartDate | ymd }}</span>
            </li>
            <li>
              <span>计划结束日期:</span><span>{{ item.planEndDate | ymd }}</span>
            </li>
          </ul>
          <uni-status :options="taskStatusList" :value="item.status"></uni-status>
          <footer class="border-top">
            <span>领取人： {{ item.receivePersonName }}</span>
          </footer>
        </div>
      </template>
    </uni-card-tree>
  </div>
</template>

<script>
import HistogramChart from '@/components/stan-ucharts/HistogramChart'
import PieChart from '@/components/stan-ucharts/PieChart'
import api from '../../api'
import moment from 'moment'
import toTree from '@/utils/toTree'
import taskStatusList from '@/pages/schedule/lib/taskStatusList'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PieChart, HistogramChart },
  props: {
    year: {
      type: Number
    },
    month: {
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
      chartData2: {
        value: [
          // { name: '啊啊', data: 50 }
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
      colors: ['#1890FF', '#2FC25B', '#FACC14', '#f00'],
      // 下方任务表格数据
      list: [],
      taskStatusList
    }
  },
  computed: {
    date() {
      return moment().year(this.year).month(this.month)
    }
  },
  watch: {
    date() {
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
        .getScheduleTaskList({
          unicode: this.unicode,
          startDate: this.date.startOf('month').format('YYYY-MM-DD 00:00:00'),
          endDate: this.date.endOf('month').format('YYYY-MM-DD 23:59:59')
        })
        .then(res => {
          this.list = toTree(res.data.baseList, 'parentTaskUniqueId', null, 'taskUniqueId')
        })
      api
        .getPeriodAnalyze({
          cycleType: 0,
          start: this.date.startOf('month').format('YYYY-MM-DD 00:00:00'),
          end: this.date.endOf('month').format('YYYY-MM-DD 23:59:59')
        })
        .then(res => {
          let data = _.values(res.data)
          this.chartData = {
            label: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周'].slice(0, data.length),
            value: [
              {
                name: '正常完成数量',
                data: _.map(data, e => e?.normalFinishedNum || null)
              },
              {
                name: '超前完成数量',
                data: _.map(data, e => e?.advanceFinishedNum || null)
              },
              {
                name: '滞后延期数量',
                data: _.map(data, e => e?.delayFinishedNum || null)
              }
            ]
          }
          this.chartData2 = {
            value: [
              {
                name: '正常完成数量',
                data: _.sumBy(data, e => e?.normalFinishedNum)
              },
              {
                name: '超前完成数量',
                data: _.sumBy(data, e => e?.advanceFinishedNum)
              },
              {
                name: '滞后延期数量',
                data: _.sumBy(data, e => e?.delayFinishedNum)
              }
            ]
          }
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
  width: 700px;
}
.item {
  padding: 31px 31px 0;
  font-size: 12px;
  color: #4f6481;
  line-height: 48px;
  width: 700px;
  h6 {
    padding-right: 50px;
    font-size: @h2FontSize;
    font-weight: bold;
    position: relative;
    margin-bottom: 15px;
    color: #020202;
  }
  footer {
    display: flex;
    line-height: 76px;
    justify-content: space-between;
  }
  .uni-status {
    position: absolute;
    bottom: 110px;
    right: 50px;
  }
}
</style>
