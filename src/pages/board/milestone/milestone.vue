<template>
  <div class="milestone-wrap">
    <div v-if="dataList.length" class="content">
      <div v-for="group in dataList" :key="group.year">
        <h6>{{ group.year }}</h6>
        <div v-for="item in group.data" :key="item.id" class="list">
          <p :class="['date', `status-${item.status}`]">
            <span>{{ item.planStartTime.slice(5, 10) }}</span>
            <span>~</span>
            <span>{{ item.planEndTime.slice(5, 10) }}</span>
          </p>
          <p class="desc">
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>
    <emptyTemplate v-else></emptyTemplate>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Milestone',
  components: {},
  data() {
    return {
      dataList: []
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    async refresh() {
      let data = await this.fly.schedule
        .get('app/construct/task/timerShaft/' + uni.getStorageSync('projectId'))
        .then(res => res.data)
      data = _.sortBy(data, 'planStartTime').reverse()
      data.forEach(e => {
        e.year = e.planStartTime.slice(0, 4)
      })
      data = _.groupBy(data, 'year')
      data = _.map(data, (v, k) => {
        return { data: v, year: k }
      })
      this.dataList = data
    }
  }
}
</script>

<style scoped lang="less">
@import url('./milestone.less');
</style>
