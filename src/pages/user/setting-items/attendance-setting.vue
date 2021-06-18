<template>
  <view class="main is-white">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="card-container">
        <uni-card>
          <uni-form-item label="上班前15分钟提醒我">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="下班前15分钟提醒我">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item label="自动考勤">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
        </uni-card>
        <view class="tooltip-info has-margin-top">
          开启自动考勤后，如果您已进入考勤范围，应用会在考勤时间内自动完成考勤。请保持应用处于后台活跃，并在系统隐私设置中开启始终使用位置功能。
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'AttendanceSetting',
  components: {},
  data() {
    return {}
  },
  computed: {},
  onShow() {},
  // 下拉刷新
  onPullDownRefresh() {},
  methods: {}
}
</script>

<style lang="less" scoped>
@import url('./attendance-setting.less');
</style>
