<template>
  <div class="main">
    <h1>{{ year }} 年度</h1>
    <uni-card>
      <ul class="list">
        <li v-for="item in monthList" :key="item.month" @click="$utils.toUrl(`list?year=${year}&month=${item.month}`)">
          <span>{{ item.label }}</span>
          <span>任务数：{{ item.doneCount }}/{{ item.count }}</span>
        </li>
      </ul>
    </uni-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Step2',
  data() {
    return {
      year: null
    }
  },
  computed: {
    monthList() {
      return _.find(this.$store.state.schedule.yearList, { year: +this.year })?.children ?? []
    },
    total() {
      return _.find(this.$store.state.schedule.yearList, { year: +this.year })?.count
    }
  },
  onLoad(options) {
    this.year = options.year
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    submit() {},
    remove() {}
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
