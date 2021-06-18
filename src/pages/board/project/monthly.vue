<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="header">
        <s-tabs
          v-model="type"
          class="subTitle custom-tabs border-bottom"
          :lineScale="1"
          :height="60"
          effect
          @change="handleTabsChange"
        >
          <s-tab title="月度进度"></s-tab>
          <s-tab title="月度耗材"></s-tab>
        </s-tabs>
         <!-- <Calendar
            ref="calendar"
            :value="calendarValue"
            monFirst
            :weekSwitch="weekSwitch"
            :tileContent="tileContent"
            :arrowLeft="arrowLeft"
            :arrowRight="arrowRight"
            @select="handleCalendarSelect"
          
           
          ></Calendar> -->
        <ring-chart :dataAs="monthlyData" canvasId="monthly" />
      </view>
      <view class="main-body"> </view>
    </scroll-view>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import Calendar from 'mpvue-calendar'
// #endif
// #ifdef H5
import Calendar from 'mpvue-calendar'
// #endif
// #ifdef MP
import Calendar from '@/components/uni-calendar/uni-calendar.vue'
// #endif
import arrowLeft from '@/static/images/log/arrow-left-o.png'
import arrowRight from '@/static/images/log/arrow-right.png'
import RingChart from '@/components/stan-ucharts/RingChart.vue'
import sTabs from '@/components/s-tabs'
import sTab from '@/components/s-tab'
export default {
  name: 'Monthly',
  components: {
     Calendar,
    sTabs,
    sTab,
    RingChart
  },
  data() {
    return {
      type: 0,
       calendarValue: [],
       arrowLeft,
      arrowRight,

      monthlyData: {},

      progressData: {
        series: [
          {
            name: '当月完成工序',
            data: 3693,
            color: '#268dfe'
          },
          {
            name: '其他完成工序',
            data: 1231,
            color: '#36cbcb'
          },
          {
            name: '未开始工序',
            data: 1231,
            color: '#45d485'
          }
        ]
      },
      materialData: {
        series: [
          {
            name: '当月耗材',
            data: 1693,
            color: '#268dfe'
          },
          {
            name: '其他完成耗材',
            data: 2031,
            color: '#36cbcb'
          },
          {
            name: '材料库存',
            data: 231,
            color: '#45d485'
          }
        ]
      }
    }
  },
  onLoad() {
    this.init()
  },
  methods: {
    init() {
      this.monthlyData = this.type === 0 ? Object.assign({}, this.progressData) : Object.assign({}, this.materialData)
    },
    handleTabsChange(val) {
      this.monthlyData = val === 0 ? Object.assign({}, this.progressData) : Object.assign({}, this.materialData)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./monthly.less');
</style>
