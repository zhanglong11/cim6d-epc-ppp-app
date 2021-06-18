<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card>
          <ul class="list">
            <li v-if="$hasPower('QualityControlQualityCheck')" @click="toUrl('/pages/inspect/index')">
              <image class="list-icon" src="@/static/images/application/QualityControlQualityCheck.png"></image>
              <p>质量检查</p>
            </li>
            <li v-if="$hasPower('QualityAcceptance')" @click="toUrl('/pages/quality/statistics/acceptance/list')">
              <image class="list-icon" src="@/static/images/application/QualityAcceptance.png"></image>
              <p>质量验收</p>
            </li>
            <li v-if="$hasPower('MeasureQuantity')" @click="toUrl('/pages/quality/measure/list')">
              <image class="list-icon" src="@/static/images/application/MeasureQuantity.png"></image>
              <p>实测实量</p>
            </li>
            <li v-if="$hasPower('QualityStatistics')" @click="toUrl('/pages/quality/statistics/chartview/index')">
              <image class="list-icon" src="@/static/images/application/QualityStatistics.png"></image>
              <p>质量统计</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'ApplicationQuality',
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
