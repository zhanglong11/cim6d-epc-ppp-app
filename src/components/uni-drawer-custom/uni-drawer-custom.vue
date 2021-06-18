<template>
  <uni-drawer ref="drawer" class="drawer uni-drawer-custom" mode="right" :width="width">
    <div class="header">
      <span v-text="title"></span>
      <span class="icon" @click="close">×</span>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <div class="content">
        <slot></slot>
      </div>
    </scroll-view>
    <div class="foot">
      <uni-btn v-if="isCancel" @click="reset" v-text="cancelText"></uni-btn>
      <uni-btn type="primary" @click="submit" v-text="confirmText"></uni-btn>
    </div>
  </uni-drawer>
</template>

<script>
export default {
  name: 'UniDrawerCustom',
  props: {
    // 标题栏
    title: {
      type: String,
      default: '数据筛选'
    },
    // 是否显示取消按钮
    isCancel: {
      type: Boolean,
      default: true
    },
    // 取消文字
    cancelText: {
      type: String,
      default: '重置'
    },
    // 确认文字
    confirmText: {
      type: String,
      default: '确定'
    },
    // 确认后是否需要验证才关闭抽屉
    isConfirm: {
      type: Boolean,
      default: false
    },
    //宽度
    width: {
      type: Number,
      default: 700
    }
  },
  methods: {
    open() {
      this.$refs.drawer.open()
    },
    close() {
      this.$refs.drawer.close()
    },
    reset() {
      this.$emit('reset')
      this.close()
    },
    submit() {
      this.$emit('submit')
      if (!this.isConfirm) {
        this.close()
      }
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-drawer-custom.less';
</style>
