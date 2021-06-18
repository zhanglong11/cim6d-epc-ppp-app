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
      <uni-card v-if="activeName === '消防检测'" class="alarm-card">
        <div v-if="!alarmed" class="alarm-wrap">
          <div class="alarm" @click="alarm">
            <image mode="widthFix" style="width: 64rpx;" src="@/static/images/environment/alarm.png" alt="" />
            <h3>一键报警</h3>
          </div>
        </div>
        <div v-else class="logs">
          <h3>报警信息</h3>
          <uni-steps :options="stepOptions" :active="1" direction="column"></uni-steps>
          <button type="primary">救援完成</button>
        </div>
      </uni-card>
      <div>
        <p v-if="activeName === '消防检测'" style="margin: 20px 20px 0">温度检测(℃)</p>
        <LineChart
          :key="activeName"
          :extraAs="extraAs"
          :dataAs="chartOption"
          :yAxisAs="{ formatter: { name: activeUnit !== '无' ? activeUnit : '' } }"
          :canvas-id="'item' + activeName"
        ></LineChart>
        <div v-if="activeName === '消防检测'">
          <p style="margin: 20px 20px 0">烟感检测(%)</p>
          <LineChart
            :key="'yan' + activeName"
            :extraAs="extraAs"
            :dataAs="chartOption2"
            :yAxisAs="{ formatter: { name: activeUnit !== '无' ? activeUnit : '%' } }"
            :canvas-id="'itemyan' + activeName"
          ></LineChart>
        </div>
        <uni-card class="warn">
          <header slot="title">
            <span v-if="activeName === '消防检测'">消防预警</span>
            <span v-else>当前{{ activeName !== 'PM值' ? activeName : 'PM2.5值' }}({{ activeUnit }})</span>
            <image
              mode="widthFix"
              style="width: 40rpx;"
              src="@/static/images/environment/monit.png"
              alt=""
              @click="$utils.toUrl(`monit?chartType=${activeName}`)"
            />
          </header>
          <div>
            <uni-form-item label="项目部东侧">{{ infoList[0] }}</uni-form-item>
            <uni-form-item label="项目部西侧">{{ infoList[1] }}</uni-form-item>
            <uni-form-item label="项目部南侧">{{ infoList[2] }}</uni-form-item>
            <uni-form-item label="项目部北侧">{{ infoList[3] }}</uni-form-item>
          </div>
          <h3>最新预警节点</h3>
          <div class="list" style="position: relative;min-height: 200px">
            <div v-for="item of list" :key="item.id" class="list-item">
              <p>{{ item.content }}</p>
              <div>
                <span class="level" :style="{ backgroundColor: levelList[item.level - 1].color }">
                  {{ levelList[item.level - 1].label }}
                </span>
                <span class="content">{{ item.detail }}</span>
              </div>
            </div>
            <EmptyTemplate v-if="list.length === 0" />
          </div>
          <div v-if="list.length !== 0" class="view-more">
            <span @click="$utils.toUrl('warning')">查看更多 &gt;&gt;</span>
          </div>
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
  data() {
    return {
      navList: [
        { name: '温度' },
        { name: '湿度' },
        { name: '风级' },
        { name: '扬尘' },
        { name: '噪声' },
        { name: 'PM值' },
        { name: '酸碱度' },
        { name: '消防检测' }
        /* { name: '闸机检测' }*/
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
      chartOption: {},
      chartOption1: {},
      extraAs: {
        extra: {
          tooltip: {
            showBox: true, //是否显示半透明黑色的提示区域
            bgColor: '#fff', //主体背景颜色
            bgOpacity: 0.8, //背景颜色透明度
            gridType: 'dash', //辅助线类型（虚线）
            dashLength: 5, //虚线单段长度
            gridColor: '#1890ff', //辅助线颜色
            fontColor: '#000', //主体文字颜色
            horizentalLine: true, //是否显示横向辅助线
            xAxisLabel: true, //是否显示X轴辅助标签
            yAxisLabel: true, //是否显示Y轴辅助标签
            labelBgColor: '#DFE8FF', //标签背景颜色
            labelBgOpacity: 0.95, //背景颜色透明度
            labelFontColor: '#666666' //标签文字颜色
          }
        }
      },
      activeName: '温度',
      activeUnit: '℃',
      infoList: [34, 36, 37, 33],
      levelList: [
        { value: 1, label: '一级', color: '#fe9225' },
        { value: 2, label: '二级', color: '#f00' }
      ],
      list: [
        /* {
          id: 1,
          content: '项目部西侧温度高于一级预警值，请负责人采取有效降温措施',
          detail: '已超出预警上限温度1℃',
          level: 1
        },
        {
          id: 2,
          content: '项目部南侧温度高于二级预警值，请负责人采取有效降温措施',
          detail: '已超出预警上限温度2℃',
          level: 1
        }*/
      ],
      alarmed: false,
      stepOptions: [
        { title: '一键报警成功', desc: '2020-03-11 17:16' },
        {
          title: '消防中心已派出救援分队\n' + '负责人：XXXX，联系电话：XXXX\n' + '预计10分钟内到达',
          desc: '2020-03-11 17:16'
        }
      ]
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
          case '温度':
            this.activeUnit = '℃'
            this.infoList = [
              this.chartDataList.wendu.E[this.timeIndex - 1],
              this.chartDataList.wendu.W[this.timeIndex - 1],
              this.chartDataList.wendu.S[this.timeIndex - 1],
              this.chartDataList.wendu.N[this.timeIndex - 1]
            ]
            this.list = [
              /* {
                id: 1,
                content: '项目部西侧温度高于一级预警值，请负责人采取有效降温措施',
                detail: '已超出预警上限温度1℃',
                level: 1
              },
              {
                id: 2,
                content: '项目部南侧温度高于二级预警值，请负责人采取有效降温措施',
                detail: '已超出预警上限温度2℃',
                level: 1
              }*/
            ]
            this.chartOption = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.wendu.E.splice(this.timeIndex), ...this.chartDataList.wendu.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.wendu.W.splice(this.timeIndex), ...this.chartDataList.wendu.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.wendu.S.splice(this.timeIndex), ...this.chartDataList.wendu.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.wendu.N.splice(this.timeIndex), ...this.chartDataList.wendu.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            break
          case '湿度':
            this.activeUnit = '%'
            this.infoList = [
              this.chartDataList.shidu.E[this.timeIndex - 1],
              this.chartDataList.shidu.W[this.timeIndex - 1],
              this.chartDataList.shidu.S[this.timeIndex - 1],
              this.chartDataList.shidu.N[this.timeIndex - 1]
            ]
            this.list = []
            this.chartOption = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.shidu.E.splice(this.timeIndex), ...this.chartDataList.shidu.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.shidu.W.splice(this.timeIndex), ...this.chartDataList.shidu.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.shidu.S.splice(this.timeIndex), ...this.chartDataList.shidu.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.shidu.N.splice(this.timeIndex), ...this.chartDataList.shidu.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            break
          case '风级':
            this.activeUnit = '级'
            this.infoList = [
              this.chartDataList.feng.E[this.timeIndex - 1],
              this.chartDataList.feng.W[this.timeIndex - 1],
              this.chartDataList.feng.S[this.timeIndex - 1],
              this.chartDataList.feng.N[this.timeIndex - 1]
            ]
            this.list = []
            this.chartOption = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.feng.E.splice(this.timeIndex), ...this.chartDataList.feng.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.feng.W.splice(this.timeIndex), ...this.chartDataList.feng.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.feng.S.splice(this.timeIndex), ...this.chartDataList.feng.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.feng.N.splice(this.timeIndex), ...this.chartDataList.feng.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            break
          case '扬尘':
            this.activeUnit = 'µg/m3'
            this.infoList = [
              this.chartDataList.chen.E[this.timeIndex - 1],
              this.chartDataList.chen.W[this.timeIndex - 1],
              this.chartDataList.chen.S[this.timeIndex - 1],
              this.chartDataList.chen.N[this.timeIndex - 1]
            ]
            this.list = []
            this.chartOption = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.chen.E.splice(this.timeIndex), ...this.chartDataList.chen.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.chen.W.splice(this.timeIndex), ...this.chartDataList.chen.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.chen.S.splice(this.timeIndex), ...this.chartDataList.chen.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.chen.N.splice(this.timeIndex), ...this.chartDataList.chen.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            break
          case '噪声':
            this.activeUnit = 'dB'
            this.infoList = [
              this.chartDataList.zao.E[this.timeIndex - 1],
              this.chartDataList.zao.W[this.timeIndex - 1],
              this.chartDataList.zao.S[this.timeIndex - 1],
              this.chartDataList.zao.N[this.timeIndex - 1]
            ]
            this.list = []
            this.chartOption = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.zao.E.splice(this.timeIndex), ...this.chartDataList.zao.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.zao.W.splice(this.timeIndex), ...this.chartDataList.zao.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.zao.S.splice(this.timeIndex), ...this.chartDataList.zao.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.zao.N.splice(this.timeIndex), ...this.chartDataList.zao.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            break
          case 'PM值':
            this.activeUnit = '%'
            this.infoList = [
              this.chartDataList.pm.E[this.timeIndex - 1],
              this.chartDataList.pm.W[this.timeIndex - 1],
              this.chartDataList.pm.S[this.timeIndex - 1],
              this.chartDataList.pm.N[this.timeIndex - 1]
            ]
            this.list = []
            this.chartOption = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.pm.E.splice(this.timeIndex), ...this.chartDataList.pm.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.pm.W.splice(this.timeIndex), ...this.chartDataList.pm.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.pm.S.splice(this.timeIndex), ...this.chartDataList.pm.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.pm.N.splice(this.timeIndex), ...this.chartDataList.pm.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            break
          case '酸碱度':
            this.activeUnit = '无'
            this.infoList = [
              this.chartDataList.ph.E[this.timeIndex - 1],
              this.chartDataList.ph.W[this.timeIndex - 1],
              this.chartDataList.ph.S[this.timeIndex - 1],
              this.chartDataList.ph.N[this.timeIndex - 1]
            ]
            this.list = []
            this.chartOption = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.ph.E.splice(this.timeIndex), ...this.chartDataList.ph.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.ph.W.splice(this.timeIndex), ...this.chartDataList.ph.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.ph.S.splice(this.timeIndex), ...this.chartDataList.ph.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.ph.N.splice(this.timeIndex), ...this.chartDataList.ph.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            break
          case '消防检测':
            this.activeUnit = '无'
            this.infoList = ['正常', '正常', '正常', '正常']
            this.list = []
            this.chartOption = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.wen.E.splice(this.timeIndex), ...this.chartDataList.wen.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.wen.W.splice(this.timeIndex), ...this.chartDataList.wen.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.wen.S.splice(this.timeIndex), ...this.chartDataList.wen.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.wen.N.splice(this.timeIndex), ...this.chartDataList.wen.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            this.chartOption2 = {
              categories: [
                ...this.defaultCategories.slice(this.timeIndex),
                ...this.defaultCategories.slice(0, this.timeIndex)
              ].reverse(),
              series: [
                {
                  name: '东侧',
                  data: [...this.chartDataList.yan.E.splice(this.timeIndex), ...this.chartDataList.yan.E].reverse(),
                  color: '#1890FF'
                },
                {
                  name: '西侧',
                  data: [...this.chartDataList.yan.W.splice(this.timeIndex), ...this.chartDataList.yan.W].reverse(),
                  color: '#2FC25B'
                },
                {
                  name: '南侧',
                  data: [...this.chartDataList.yan.S.splice(this.timeIndex), ...this.chartDataList.yan.S].reverse(),
                  color: '#FFC44F'
                },
                {
                  name: '北侧',
                  data: [...this.chartDataList.yan.N.splice(this.timeIndex), ...this.chartDataList.yan.N].reverse(),
                  color: '#223273'
                }
              ]
            }
            break
          default:
            return
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    submit() {},
    remove() {},
    alarm() {
      uni.showModal({
        title: '报警确认',
        content: '是否确认报警？',
        success: res => {
          if (res.confirm) {
            this.alarmed = true
          }
        }
      })
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
    margin: 10px 20px;
    &.active {
      color: @mainColor;
    }
  }
}

.uni-card {
  width: 700px;
}
.warn {
  padding-bottom: 20px;
  header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 20px 40px;
  }
  h3 {
    border-top: 1px solid @line;
    font-weight: normal;
    padding: 20px 0 20px 30px;
    font-size: 18px;
  }
  .list {
    padding: 0 10px;
    border-top: 1px solid @line;
    .list-item {
      padding: 10px 10px 10px 40px;
      &:not(:last-child) {
        border-bottom: 1px @line solid;
      }
      p {
        line-height: 1.7;
      }
      > div {
        display: flex;
        margin: 20px 0;
        align-items: center;
        .level {
          padding: 6px 10px;
          color: #fff;
          font-size: 12px;
          border-radius: 10px;
          margin-right: 10px;
        }
        .content {
          color: #f00;
          font-size: 12px;
        }
      }
    }
  }
  .view-more {
    text-align: right;
    span {
      display: inline-block;
      color: @mainColor;
      font-size: 14px;
      padding: 0 30px;
    }
  }
}
.alarm-card {
  .alarm-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
  }
  .alarm {
    border-radius: 50%;
    width: 200px;
    height: 200px;
    background-color: red;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    img {
      width: 64px;
      height: 64px;
    }
    h3 {
      color: #fff;
      font-size: 16px;
      font-weight: normal;
      margin-top: 10px;
    }
  }
  .logs {
    padding: 0 30px;
    h3 {
      font-size: 16px;
      margin-top: 15px;
      font-weight: normal;
    }
    /deep/ .uni-steps__column-text {
      border-bottom: none;
    }
    /deep/ .uni-steps__column-title {
      font-size: 13px;
    }
  }
}
</style>
