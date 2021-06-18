<template>
  <view class="gauge_chart">
    <canvas id="canvasId" :canvasId="canvasId" :style="{ width: '100%', height: cHeight + 'px' }" />
    <slot />
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts'
const gaugeCharts = {},
  optionAs = {}
export default {
  name: 'GaugeChart',
  props: {
    dataAs: {
      //数据
      type: Object,
      default: () => ({})
    },
    basicAs: {
      ////通用基础项设置
      type: Object,
      default: () => ({})
    },
    legendAs: {
      //图例设置
      type: Object,
      default: () => ({})
    },
    extraAs: {
      //详情请看 http://doc.ucharts.cn/1172130
      type: Object,
      default: () => ({})
    },
    width: {
      //图标宽度
      type: Number,
      default: 750
    },
    height: {
      //图标高度
      type: Number,
      default: 500
    },
    labelKey: {
      type: String,
      default: 'categories'
    },
    valueKey: {
      type: String,
      default: 'series'
    },
    canvasId: {
      type: String,
      default: `gauge_canvas_${Math.ceil(Math.random(5) * 10000)}`
    }
  },
  data() {
    return {
      gaugeWidth: 15,
      defalutColor: '#18b7ec',
      subTitleColor: '#1890ff',
      categories: []
    }
  },
  computed: {
    cWidth() {
      return uni.upx2px(this.width)
    },
    cHeight() {
      return uni.upx2px(this.height)
    }
  },
  watch: {
    dataAs: {
      deep: true,
      handler({ series }) {
        this.initCategoryInfo()
        gaugeCharts[this.canvasId].updateData({
          series,
          categories: this.categories,
          title: {
            name: (series[0].data * 100).toFixed(0) + '%'
          },
          subtitle: {
            name: series[0].name
          }
        })
      }
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    initCategoryInfo() {
      // this.categories = [
      //   {
      //     value: this.dataAs[this.valueKey][0].data || 0,
      //     color: this.defalutColor
      //   },

      //   {
      //     value: 1,
      //     color: '#0d3964'
      //   }
      // ]
      this.categories = [
        {
          value: 0.2,
          color: '#2fc25b'
        },
        {
          value: 0.8,
          color: '#f04864'
        },
        {
          value: 1,
          color: '#1890ff'
        }
      ]
    },
    render() {
      this.initCategoryInfo()
      let defaultOption = {
        //通用基础项设置 basicAs
        $this: this, //this实例组件内使用图表，必须传入this实例
        canvasId: this.canvasId, //页面组件canvas-id，支付宝中为id
        type: 'gauge', //图表类型，可选值为pie、line、column、area、ring、radar、arcbar、gauge、candle、bar、mix、rose、word
        padding: [15, 15, 10, 15], //画布填充边距，顺序为上右下左，同css，但必须4位
        rotate: false, //是否横屏展示
        rotateLock: true, //	锁定横屏模式，如果在支付宝和百度小程序中使用横屏模式，请赋值true，否则每次都会旋转90度。跨端使用通过uni-app的条件编译来赋值
        // enableScroll: true, //是否开启图表可拖拽滚动 默认false 支持line, area, column, candle图表类型(需配合绑定@touchstart, @touchmove, @touchend方法)
        enableMarkLine: false, //是否显示辅助线 默认false 支持line, area, column, candle, mix图表类型
        animation: true, //是否动画展示
        dataLabel: true, //是否在图表中显示数据标签内容值
        duration: 1000, //动画展示时长单位毫秒
        fontSize: 12, //全局默认字体大小（可选，单位为px，默认13px）高分屏不必乘像素比，自动根据pixelRatio计算
        background: '#fff', //canvas背景颜色（如果页面背景颜色不是白色请设置为页面的背景颜色，默认#ffffff）无作用
        pixelRatio: 1, //像素比，默认为1，仅支付宝小程序需要大于1，其他平台必须为1
        width: this.cWidth, //canvas宽度，单位为px，支付宝高分屏需要乘像素比(pixelRatio)
        height: this.cHeight, //canvas高度，单位为px，支付宝高分屏需要乘像素比

        //数据列表配置项 dataAS
        categories: this.dataAs[this.labelKey] || this.categories, //数据类别(饼图、圆环图不需要)
        series: this.dataAs[this.valueKey], //数据列表

        //图列配置 legendAs
        legend: false,

        //扩展配置 extraAs 详情请看 http://doc.ucharts.cn/1172130
        title: {
          name: (this.dataAs[this.valueKey][0].data * 100).toFixed(0) + '%',
          color: '#1890ff',
          fontSize: 25,
          offsetY: 60 //新增参数，自定义调整Y轴文案距离
        },
        subtitle: {
          name: this.dataAs[this.valueKey][0].name,
          color: this.subTitleColor,
          fontSize: 15,
          offsetY: 80 //新增参数，自定义调整Y轴文案距离
        },
        extra: {
          gauge: {
            type: 'default',
            width: this.gaugeWidth, //仪表盘背景的宽度
            startAngle: 0.75,
            endAngle: 0.25,
            startNumber: 0,
            endNumber: 100,
            splitLine: {
              fixRadius: 0,
              splitNumber: 10,
              width: this.gaugeWidth, //仪表盘背景的宽度
              color: '#FFFFFF',
              childNumber: 5,
              childWidth: this.gaugeWidth * 0.4 //仪表盘背景的宽度
            },
            pointer: {
              width: this.gaugeWidth * 0.8, //指针宽度
              color: 'auto'
            }
          }
        }
      }
      let propsData = {
        ...this.basicAs,
        ...this.titleAs,
        ...this.legendAs,
        ...this.extraAs
      }
      optionAs[this.canvasId] = Object.assign(defaultOption, propsData)
      gaugeCharts[this.canvasId] = new uCharts(optionAs[this.canvasId])
    }
  }
}
</script>

<style scoped></style>
