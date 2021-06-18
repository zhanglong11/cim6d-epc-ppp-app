<template>
  <div>
    <web-view
      v-if="yearList.length"
      :src="
        `${$utils.webBimUrl}/web-view/html/schedule.html` +
          '?baseUrl=' +
          $utils.bimBaseUrl +
          '&projectId=' +
          projectId +
          '&token=' +
          token +
          '&urlSuffix=' +
          urlSuffix
      "
    ></web-view>
    <div v-else style="background-color:#F9F9F9;width: 100vw;height: 100vh;">
      <EmptyTemplate></EmptyTemplate>
    </div>
  </div>
</template>

<script>
import { urlSuffix } from '@/utils/http'
export default {
  name: 'Statistics',
  data() {
    return {
      urlSuffix
    }
  },
  computed: {
    projectId() {
      return uni.getStorageSync('projectId')
    },
    token() {
      return uni.getStorageSync('token')
    },
    yearList() {
      return [1]
    }
  },
  created() {
    this.$store.dispatch('schedule/getList')
  },
  // 顶部按钮点击事件
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'bim') {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=4`)
    }
  },
  mounted() {
    setTimeout(() => {
      plus.screen.lockOrientation('landscape-primary')
    }, 1000)
  },
  onBackPress() {
    plus.screen.lockOrientation('portrait-primary')
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
