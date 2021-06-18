<template>
  <view class="main is-white">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="card-container">
        <uni-card>
          <uni-form-item label="新消息通知">
            <view>已开启</view>
          </uni-form-item>
        </uni-card>
        <view class="tooltip-info">在手机系统“设置”-“通知”中找到应用进行修改</view>
        <uni-card style="margin-top: 0">
          <uni-form-item label="声音提示">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="振动提示">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
        </uni-card>
        <view class="tooltip-info">设置提醒消息类型</view>
        <uni-card style="margin-top: 0">
          <uni-form-item label="系统公告">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="工作动态">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="提醒消息">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="到期任务">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="待办事项">
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'RemindSetting',
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
@import url('./remind-setting.less');
</style>
