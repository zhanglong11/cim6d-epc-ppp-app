<template>
  <div class="main is-white">
    <div class="about-header">
      <image src="~@/static/images/login/login-bg.png" class="logo" mode="widthFix" />
    </div>
    <div class="about-form">
      <uni-card isForm>
        <uni-form-item
          label="更新记录"
          :border="false"
          isLink
          @click="$utils.toUrl('/pages/about/update-records')"
        ></uni-form-item>
        <uni-form-item label="服务协议" isLink @click="$utils.toUrl('/pages/about/agreement')"></uni-form-item>
        <uni-form-item label="清除本地缓存文件" isLink @click="clearCache()"></uni-form-item>
      </uni-card>
    </div>
    <div class="about-footer">
      <p>北京华夏天信时空物联网技术有限公司</p>
      <p class="copyright">Copyright © www.chinatxiiot.com, All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import DownloadUtil from '@/pages/bim-model/downloadUtils'
export default {
  components: {},
  data() {
    //这里存放数据
    return {}
  },
  mounted() {},
  //方法集合
  methods: {
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
@import url('./index.less');
</style>
