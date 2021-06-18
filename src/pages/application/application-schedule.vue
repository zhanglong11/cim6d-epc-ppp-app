<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card>
          <ul class="list">
            <li v-if="$hasPower('ScheduleStatistics')" @click="$utils.toUrl('/pages/schedule/statistics')">
              <image class="list-icon" src="@/static/images/application/ScheduleStatistics.png"></image>
              <p>进度统计</p>
            </li>
            <li v-if="$hasPower('ScheduleFillIn')" @click="$utils.toUrl('/pages/schedule/step-1')">
              <image class="list-icon" src="@/static/images/application/ScheduleFillIn.png"></image>
              <p>进度填报</p>
            </li>
            <li v-if="$hasPower('ScheduleSimulation')" @click="progressSimulation(5)">
              <image class="list-icon" src="@/static/images/application/ScheduleSimulation.png"></image>
              <p>进度模拟</p>
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
    // 进度模拟
    progressSimulation(type) {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=${type}`)
    },
    toUrl(url) {
      this.$utils.toUrl(url)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
