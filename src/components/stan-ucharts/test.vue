<template>
  <view class="qiun-columns">
    <view class="qiun-bg-white qiun-title-bar qiun-common-mt">
      <view class="qiun-title-dot-light">仪表盘</view>
    </view>
    <view class="qiun-charts">
      <canvas id="canvasGauge" canvas-id="canvasGauge" class="charts"></canvas>
    </view>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js'
var _self
var canvaGauge = null

export default {
  data() {
    return {
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      gaugeWidth: 15
    }
  },
  onLoad() {
    _self = this
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)
    this.getServerData()
  },
  methods: {
    getServerData() {
      uni.request({
        url: 'https://www.ucharts.cn/data.json',
        data: {},
        success: function(res) {
          console.log(res.data.data)
          let Gauge = { categories: [], series: [] }
          //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
          Gauge.categories = res.data.data.Gauge.categories
          Gauge.series = res.data.data.Gauge.series
          _self.showGauge('canvasGauge', Gauge)
        },
        fail: () => {
          _self.tips = '网络错误，小程序端请检查合法域名'
        }
      })
    },
    showGauge(canvasId, chartData) {
      canvaGauge = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'gauge',
        fontSize: 11,
        legend: false,
        title: {
          name: Math.round(chartData.series[0].data * 100) + '%',
          color: chartData.categories[1].color,
          fontSize: 25 * _self.pixelRatio,
          offsetY: 50 * _self.pixelRatio //新增参数，自定义调整Y轴文案距离
        },
        subtitle: {
          name: chartData.series[0].name,
          color: '#666666',
          fontSize: 15 * _self.pixelRatio,
          offsetY: -50 * _self.pixelRatio //新增参数，自定义调整Y轴文案距离
        },
        extra: {
          gauge: {
            type: 'default',
            width: _self.gaugeWidth * _self.pixelRatio, //仪表盘背景的宽度
            startAngle: 0.75,
            endAngle: 0.25,
            startNumber: 0,
            endNumber: 100,
            splitLine: {
              fixRadius: 0,
              splitNumber: 10,
              width: _self.gaugeWidth * _self.pixelRatio, //仪表盘背景的宽度
              color: '#FFFFFF',
              childNumber: 5,
              childWidth: _self.gaugeWidth * 0.4 * _self.pixelRatio //仪表盘背景的宽度
            },
            pointer: {
              width: _self.gaugeWidth * 0.8 * _self.pixelRatio, //指针宽度
              color: 'auto'
            }
          }
        },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        dataLabel: true
      })
    }
  }
}
</script>

<style>
/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
.qiun-charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}

.charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}
</style>
