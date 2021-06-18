<template>
  <canvas :style="canvasSize" :canvas-id="id"></canvas>
</template>

<script>
export default {
  props: {
    totalCount: {
      //总任务量
      type: Number,
      required: true
    },
    actualCount: {
      //实际完成任务量
      type: Number,
      required: true
    },
    targetCount: {
      //计划完成的任务量
      type: Number,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    canvasSize: {
      //cancas 的大小
      type: Object,
      default() {
        return {
          width: '96rpx',
          height: '96rpx'
        }
      }
    }
  },
  mounted() {
    this.drawCanvas()
  },
  methods: {
    drawCanvas() {
      var context = uni.createCanvasContext(this.id)
      let actualPercent = this.actualCount / this.totalCount
      let actualPI = parseFloat((actualPercent * 2).toFixed(2))
      let color = '#8B8B8B'
      if (this.actualCount > this.targetCount) {
        color = '#11C593'
      } else if (this.actualCount < this.targetCount) {
        color = '#EA5252'
      }
      context.beginPath() // 开始绘制路径
      context.arc(24, 24, 22, Math.PI * -0.5, Math.PI * (actualPI - 0.5)) // arc画圆
      context.setStrokeStyle(color) // 线条颜色
      context.setLineWidth(2) // 线条宽度
      context.stroke() // 绘制成线条
      //未完成的饼状图
      context.beginPath() // 开始绘制路径
      context.arc(24, 24, 22, Math.PI * (actualPI - 0.5), 1.5 * Math.PI) // arc画圆
      context.setStrokeStyle('#A0A0A0') // 线条颜色
      context.setLineWidth(1) // 线条宽度
      context.stroke() // 绘制成线条
      // 内部的填充圆形
      context.beginPath() // 开始绘制路径
      context.arc(24, 24, 18, 0, 2 * Math.PI) // arc画圆
      context.setStrokeStyle(color) // 线条颜色
      context.setFillStyle('#f6f6f6')
      context.setLineWidth(1) // 线条宽度
      context.stroke() // 绘制成线条
      context.fill() // 绘制成线条

      // 内部填充字体
      context.setFillStyle(color)
      context.font = '12px bold'
      context.fillText(`${parseInt(actualPercent * 100)}%`, 13, 28)
      context.setTextAlign('center')
      context.stroke()
      context.draw()
    }
  }
}
</script>

<style></style>
