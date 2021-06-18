<template>
  <view class="main is-white">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="card-container">
        <uni-card>
          <uni-form-item
            label="个人资料"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/user/setting-items/information-setting')"
          ></uni-form-item>
          <uni-form-item
            label="修改密码"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/user/setting-items/change-password')"
          ></uni-form-item>
          <!-- <uni-form-item
            label="手势密码"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/user/setting')"
          ></uni-form-item>
          <uni-form-item
            label="指纹解锁"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/user/setting')"
          ></uni-form-item> -->
        </uni-card>
        <!-- <uni-card>
          <uni-form-item
            label="首页设置"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/user/setting-items/home-setting')"
          ></uni-form-item>
          <uni-form-item
            label="提醒设置"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/user/setting-items/remind-setting')"
          ></uni-form-item>
          <uni-form-item
            label="考勤设置"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/user/setting-items/attendance-setting')"
          ></uni-form-item>
        </uni-card> -->
        <uni-card>
          <uni-form-item
            label="清空缓存"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="clearCache()"
          ></uni-form-item>
        </uni-card>
        <view class="login-out-btn" @click="handleLoginOut">
          退出账户
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'MySetting',
  components: {},
  data() {
    return {}
  },
  computed: {},
  onShow() {},
  // 下拉刷新
  onPullDownRefresh() {},
  methods: {
    handleLoginOut() {
      this.$store.commit('user/logOut')
      this.$utils.toUrl('/pages/login/login')
    },
    // 清除BIM缓存
    clearCache() {
      let self = this
      uni.showModal({
        title: '提示',
        content: '确定要清除本地缓存文件？',
        success: function(res) {
          if (res.confirm) {
						// #ifdef H5
						self.$utils.showToast('清除本地缓存文件成功!')
						return
						// #endif
            // 设置下载文件夹
            DownloadUtil.setOptions({
              downloadStoragePath: `_doc/`
            })
            DownloadUtil.clearAllLocalFileCache(
              function() {
                self.$utils.showToast('清除本地缓存文件成功!')
              },
              function(e) {
                self.$utils.showToast('清除本地缓存失败!' + e)
              }
            )
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./setting.less');
</style>
