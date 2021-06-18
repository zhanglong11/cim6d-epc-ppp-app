<template>
  <view class="main is-white">
    <view class="tooltip-info">设置首页显示的功能菜单及排序，至少需显示一项</view>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="card-container">
        <uni-card>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
          <uni-form-item label="个人资料" icon="../../../static/images/icon/@2x/icon-message.png" isLink>
            <switch class="switch" checked @change="() => {}" />
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'HomeSetting',
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
@import url('./home-setting.less');
</style>
