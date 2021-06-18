<template>
  <div class="main">
    <scroll-view class="main-header" scroll-x>
      <ul class="nav-list">
        <li v-for="e in navList" :key="e.name" :class="{ active: e.name === activeName }" @click="activeName = e.name">
          {{ e.name }}
        </li>
      </ul>
    </scroll-view>
    <scroll-view>
      <div class="warn">
        <h6>{{ chartType }}</h6>
        <h1 style="display: flex;justify-content: center">
          <span v-if="chartType === '消防检测'" style="width: 20px" @click="handleChange">
            <uni-font-awesome type="fa fa-chevron-left" color="#5dc4f5" size="25"></uni-font-awesome>
          </span>
          <span style="flex:1">{{ seriesdata[0] }}{{ activeUnit !== '无' ? activeUnit : '' }} </span>
          <span v-if="chartType === '消防检测'" style="width: 20px" @click="handleChange">
            <uni-font-awesome @ type="fa fa-chevron-right" color="#5dc4f5" size="25"></uni-font-awesome>
          </span>
        </h1>
        <uni-card>
          <header slot="title">
            <span>{{ chartType }}{{ activeUnit !== '无' ? `(${activeUnit})` : '' }}</span>
            <span @click="mode = mode === 1 ? 2 : 1">
              <image mode="widthFix" style="width: 30rpx;" src="@/static/images/environment/switch.png"></image>
            </span>
          </header>
          <ul v-if="mode === 1" class="history-list">
            <li v-for="e in list" :key="e.time">
              <span>{{ e.value }}</span>
              <span>{{ e.time }}</span>
            </li>
          </ul>
          <LineChart
            v-if="mode === 2"
            :key="arrLabel + !!showFirst"
            :width="650"
            :dataAs="chartOption"
            :yAxisAs="{ formatter: { name: activeUnit !== '无' ? activeUnit : '' } }"
          ></LineChart>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import LineChart from '@/components/stan-ucharts/LineChart'
export default {
  name: 'EnvironmentalMonitoring',
  components: { LineChart },
  onLoad(options) {
    this.chartType = options.chartType
    this.initChart()
  },
  data() {
    return {
      navList: [{ name: '项目部东侧' }, { name: '项目部西侧' }, { name: '项目部南侧' }, { name: '项目部北侧' }],
      chartType: '',
      showFirst: true, //消防检测显示烟感还是温感
      defaultCategories: [
        '00:00',
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00'
      ],
      chartDataList: {
        wendu: {
          E: [20, 17, 19, 23, 27, 29, 31, 34, 30, 28, 27, 24],
          W: [21, 19, 18, 21, 24, 26, 31, 36, 35, 28, 26, 25],
          S: [21, 20, 19, 23, 25, 29, 35, 37, 36, 27, 25, 22],
          N: [19, 18, 18, 20, 24, 25, 29, 33, 30, 27, 23, 20]
        },
        shidu: {
          E: [50, 54, 52, 50, 46, 45, 41, 38, 45, 49, 50, 50],
          W: [48, 50, 54, 53, 50, 48, 46, 42, 45, 47, 49, 52],
          S: [49, 53, 55, 54, 52, 50, 47, 41, 45, 45, 47, 49],
          N: [54, 55, 54, 54, 53, 51, 50, 46, 48, 52, 55, 57]
        },
        feng: {
          E: [1, 1, 1, 2, 2, 2, 3, 4, 3, 3, 2, 1],
          W: [1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 1],
          S: [1, 1, 1, 2, 2, 2, 2, 3, 3, 2, 1, 1],
          N: [1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1]
        },
        chen: {
          E: [10, 10, 10, 11, 19, 24, 27, 29, 32, 32, 27, 17],
          W: [8, 8, 9, 9, 13, 17, 22, 25, 27, 27, 22, 15],
          S: [11, 11, 12, 12, 15, 17, 23, 26, 26, 27, 22, 13],
          N: [10, 12, 10, 12, 14, 18, 24, 23, 31, 35, 22, 14]
        },
        zao: {
          E: [22, 14, 16, 51, 61, 66, 55, 68, 62, 60, 56, 33],
          W: [20, 13, 15, 44, 58, 64, 57, 64, 66, 58, 50, 27],
          S: [19, 11, 16, 46, 55, 60, 56, 67, 64, 68, 57, 31],
          N: [22, 10, 12, 47, 57, 66, 57, 65, 60, 66, 54, 29]
        },
        pm: {
          E: [60, 45, 46, 46, 65, 76, 84, 95, 110, 116, 112, 95],
          W: [66, 46, 46, 44, 68, 79, 86, 91, 99, 103, 96, 88],
          S: [61, 46, 47, 46, 65, 74, 84, 89, 92, 97, 85, 81],
          N: [68, 43, 44, 47, 71, 78, 81, 97, 106, 115, 103, 93]
        },
        ph: {
          E: [6.6, 7.1, 7.3, 7.8, 6.3, 7.1, 7.7, 8.6, 6.2, 5.3, 5.4, 6.6],
          W: [6.3, 7.7, 7.6, 6.3, 5.3, 8.2, 8.7, 7.1, 6.3, 6.6, 6.9, 7.3],
          S: [6.7, 7.1, 7.1, 6.2, 5.9, 7.7, 9.1, 7.7, 6.6, 6.1, 5.3, 6.7],
          N: [6.8, 7.6, 7.7, 6.0, 5.5, 7.1, 8.8, 7.3, 6.1, 6.6, 5.9, 6.9]
        },
        wen: {
          E: [20, 17, 19, 23, 27, 29, 31, 34, 30, 28, 27, 24],
          W: [21, 19, 18, 21, 24, 26, 31, 36, 35, 28, 26, 25],
          S: [21, 20, 19, 23, 25, 29, 35, 37, 36, 27, 25, 22],
          N: [19, 18, 18, 20, 24, 25, 29, 33, 30, 27, 23, 20]
        },
        yan: {
          E: [2, 1.2, 2.3, 2.6, 2.5, 1.5, 1.9, 2.2, 2.6, 1.8, 1.3, 0.4],
          W: [1.5, 2.1, 2.2, 1.4, 2.3, 2.2, 1.7, 1.1, 1.3, 1.6, 1.9, 2.3],
          S: [1.3, 0.9, 2.4, 2.3, 0.9, 1.7, 2.1, 2.7, 1.6, 1.1, 1.3, 1.7],
          N: [1.7, 1.2, 1.9, 1.6, 2.5, 1.1, 1.8, 1.3, 1.1, 1.6, 1.9, 1.9]
        }
      },
      chartOption: {},
      activeName: '项目部东侧',
      list: [],
      mode: 1,
      arrLabel: 'E',
      seriesName: '东侧',
      seriesColor: '',
      seriesdata: [], //当前的chart数组
      activeUnit: ''
    }
  },
  computed: {
    timeIndex() {
      return Math.floor(new Date().getHours() / 2) + 1
    }
  },
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        switch (val) {
          case '项目部东侧':
            this.arrLabel = 'E'
            this.seriesName = '东侧'
            this.seriesColor = '#1890FF'
            break
          case '项目部西侧':
            this.arrLabel = 'W'
            this.seriesName = '西侧'
            this.seriesColor = '#2FC25B'
            break
          case '项目部南侧':
            this.arrLabel = 'S'
            this.seriesName = '南侧'
            this.seriesColor = '#FFC44F'
            break
          case '项目部北侧':
            this.arrLabel = 'N'
            this.seriesName = '北侧'
            this.seriesColor = '#223273'
            break
        }
        this.initChart()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    initChart() {
      let timeList = [
        ...this.defaultCategories.slice(this.timeIndex),
        ...this.defaultCategories.slice(0, this.timeIndex)
      ].reverse()
      let seriesdata = []
      switch (this.chartType) {
        case '温度':
          this.activeUnit = '℃'
          seriesdata = [
            ...this.chartDataList.wendu[this.arrLabel].slice(this.timeIndex),
            ...this.chartDataList.wendu[this.arrLabel].slice(0, this.timeIndex)
          ].reverse()
          this.seriesdata = seriesdata
          this.list = timeList.map((item, index) => {
            return {
              value: seriesdata[index],
              time: item + '时'
            }
          })
          this.chartOption = {
            categories: timeList,
            series: [
              {
                name: this.seriesName,
                data: seriesdata,
                color: this.seriesColor
              }
            ]
          }
          break
        case '湿度':
          this.activeUnit = '%'
          seriesdata = [
            ...this.chartDataList.shidu[this.arrLabel].slice(this.timeIndex),
            ...this.chartDataList.shidu[this.arrLabel].slice(0, this.timeIndex)
          ].reverse()
          this.seriesdata = seriesdata
          this.list = timeList.map((item, index) => {
            return {
              value: seriesdata[index],
              time: item + '时'
            }
          })
          this.chartOption = {
            categories: timeList,
            series: [
              {
                name: this.seriesName,
                data: seriesdata,
                color: this.seriesColor
              }
            ]
          }
          break
        case '风级':
          this.activeUnit = '级'
          seriesdata = [
            ...this.chartDataList.feng[this.arrLabel].slice(this.timeIndex),
            ...this.chartDataList.feng[this.arrLabel].slice(0, this.timeIndex)
          ].reverse()
          this.seriesdata = seriesdata
          this.list = timeList.map((item, index) => {
            return {
              value: seriesdata[index],
              time: item + '时'
            }
          })
          this.chartOption = {
            categories: timeList,
            series: [
              {
                name: this.seriesName,
                data: seriesdata,
                color: this.seriesColor
              }
            ]
          }
          break
        case '扬尘':
          this.activeUnit = 'µg/m3'
          seriesdata = [
            ...this.chartDataList.chen[this.arrLabel].slice(this.timeIndex),
            ...this.chartDataList.chen[this.arrLabel].slice(0, this.timeIndex)
          ].reverse()
          this.seriesdata = seriesdata
          this.list = timeList.map((item, index) => {
            return {
              value: seriesdata[index],
              time: item + '时'
            }
          })
          this.chartOption = {
            categories: timeList,
            series: [
              {
                name: this.seriesName,
                data: seriesdata,
                color: this.seriesColor
              }
            ]
          }
          break
        case '噪声':
          this.activeUnit = 'dB'
          seriesdata = [
            ...this.chartDataList.zao[this.arrLabel].slice(this.timeIndex),
            ...this.chartDataList.zao[this.arrLabel].slice(0, this.timeIndex)
          ].reverse()
          this.seriesdata = seriesdata
          this.list = timeList.map((item, index) => {
            return {
              value: seriesdata[index],
              time: item + '时'
            }
          })
          this.chartOption = {
            categories: timeList,
            series: [
              {
                name: this.seriesName,
                data: seriesdata,
                color: this.seriesColor
              }
            ]
          }
          break
        case 'PM值':
          this.activeUnit = '%'
          seriesdata = [
            ...this.chartDataList.pm[this.arrLabel].slice(this.timeIndex),
            ...this.chartDataList.pm[this.arrLabel].slice(0, this.timeIndex)
          ].reverse()
          this.seriesdata = seriesdata
          this.list = timeList.map((item, index) => {
            return {
              value: seriesdata[index],
              time: item + '时'
            }
          })
          this.chartOption = {
            categories: timeList,
            series: [
              {
                name: this.seriesName,
                data: seriesdata,
                color: this.seriesColor
              }
            ]
          }
          break
        case '酸碱度':
          this.activeUnit = '无'
          seriesdata = [
            ...this.chartDataList.ph[this.arrLabel].slice(this.timeIndex),
            ...this.chartDataList.ph[this.arrLabel].slice(0, this.timeIndex)
          ].reverse()
          this.seriesdata = seriesdata
          this.list = timeList.map((item, index) => {
            return {
              value: seriesdata[index],
              time: item + '时'
            }
          })
          this.chartOption = {
            categories: timeList,
            series: [
              {
                name: this.seriesName,
                data: seriesdata,
                color: this.seriesColor
              }
            ]
          }
          break
        case '消防检测':
          this.activeUnit = this.showFirst ? '℃' : '%'
          seriesdata = [
            ...this.chartDataList[this.showFirst ? 'wen' : 'yan'][this.arrLabel].slice(this.timeIndex),
            ...this.chartDataList[this.showFirst ? 'wen' : 'yan'][this.arrLabel].slice(0, this.timeIndex)
          ].reverse()
          this.seriesdata = seriesdata
          this.list = timeList.map((item, index) => {
            return {
              value: seriesdata[index],
              time: item + '时'
            }
          })
          this.chartOption = {
            categories: timeList,
            series: [
              {
                name: this.seriesName,
                data: seriesdata,
                color: this.seriesColor
              }
            ]
          }
          break
        default:
          return
      }
    },
    refresh() {},
    submit() {},
    remove() {},
    handleChange() {
      this.showFirst = !this.showFirst
      this.initChart()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  padding-bottom: 30px;
  padding-top: 0;
}
.main-header {
  overflow: hidden;
  border-radius: 30px;
  font-size: 13px;
  display: block;
  background-color: #fff;
  line-height: 48px;
  padding: 20px 0 20px;
}

.nav-list {
  display: flex;
  li {
    flex: 1 0 auto;
    margin: 20px 20px;
    &.active {
      color: @mainColor;
    }
  }
}

.uni-card {
  width: 700px;
}
.warn {
  h6,
  h1 {
    font-weight: normal;
    text-align: center;
  }
  h6 {
    margin-top: 90px;
    font-size: 14px;
  }
  h1 {
    margin-top: 40px;
    margin-bottom: 120px;
    font-size: 40px;
  }
  .history-list {
    li {
      display: flex;
      justify-content: space-between;
      color: #555;
      padding: 0 20px;
      line-height: 2;
      span:last-child {
        font-size: 16px;
      }
    }
  }
  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
}
</style>
