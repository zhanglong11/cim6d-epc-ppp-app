<template>
  <div class="main">
    <h1>{{ detail.planName }}</h1>
    <uni-card v-if="yearList.length">
      <ul class="list">
        <li v-for="item in yearList" :key="item.year" @click="$utils.toUrl('step-2?year=' + item.year)">
          <span>{{ item.label }}</span>
          <span>任务数：{{ item.doneCount }}/{{ item.count }}</span>
        </li>
      </ul>
    </uni-card>
    <EmptyTemplate v-else></EmptyTemplate>
  </div>
</template>

<script>
export default {
  name: 'Step1',
  data() {
    return {}
  },
  computed: {
    detail() {
      return this.$store.state.schedule.detail
    },
    yearList() {
      return this.$store.state.schedule.yearList
    }
  },
  created() {
    this.$store.dispatch('schedule/getList')
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
h1 {
  font-weight: normal;
  font-size: 20px;
  text-align: center;
}
.uni-card {
  width: 700px;
}
.list {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 20px 30px;
    border-bottom: 1px solid rgba(241, 241, 241, 1);
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
