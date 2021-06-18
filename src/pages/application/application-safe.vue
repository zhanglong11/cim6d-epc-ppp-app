<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card>
          <ul class="list">
            <li v-if="$hasPower('SafeProcessCheck')" @click="$utils.toUrl('/pages/safe/index')">
              <image class="list-icon" src="@/static/images/application/SafeProcessCheck.png"></image>
              <p>安全检查</p>
            </li>
            <!-- <li @click="$utils.toUrl('/pages/safeCivilizationCheck/index')">
              <image class="list-icon" src="@/static/images/application/anquanwenming.png"></image>
              <p>安全文明</p>
            </li> -->
            <li v-if="$hasPower('SafeStatistics')" @click="toUrl('/pages/safe/statistics/chartview/index')">
              <image class="list-icon" src="@/static/images/application/SafeStatistics.png"></image>
              <p>安全统计</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'ApplicationSafe',
  data() {
    return {}
  },
  methods: {
    refresh() {},
    toUrl(url) {
      this.$utils.toUrl(url)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
