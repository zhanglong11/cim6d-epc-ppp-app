<template>
  <div class="empty">
    <image v-if="noNetwork" src="@/static/images/no-network.png" class="img" />
    <image v-else src="@/static/images/empty.png" class="img" />
    <p class="desc">{{ noNetwork ? '' : desc }}</p>
  </div>
</template>

<script>
export default {
  props: {
    // 描述
    desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      noNetwork: false // 无网络
    }
  },
  mounted() {
    this.getNetworkType()
  },
  methods: {
    // 获取网络状态
    getNetworkType() {
      uni.getNetworkType({
        success: res => {
          let networkType = res.networkType
          if (!networkType || networkType === 'none') {
            this.noNetwork = true
          }
        },
        fail: err => {
          this.noNetwork = true
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import './empty-template.less';
</style>
