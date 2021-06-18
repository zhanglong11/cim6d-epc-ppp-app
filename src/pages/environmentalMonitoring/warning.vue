<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <uni-card>
        <ul class="list">
          <li v-for="e in list" :key="e.id">
            <span class="name">{{ e.name }}</span>
            <uni-tag class="small" :color="e.status === 2 ? '#999999' : '#FF8000'">{{ e.level }}</uni-tag>
            <span>{{ e.value }}</span>
            <span class="time">{{ e.time }}</span>
          </li>
        </ul>
      </uni-card>
    </scroll-view>
    <EmptyTemplate v-if="list.length === 0" />
  </div>
</template>

<script>
export default {
  name: 'Warning',
  data() {
    return {
      list: [
        /*{ id: 1, name: '项目部西侧', level: '一级', value: 35, time: '2020-06-18 14:15:03', status: 1 },
        { id: 2, name: '项目部南侧', level: '一级', value: 37, time: '2020-06-18 14:15:03', status: 1 }*/
      ]
    }
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
.list {
  li {
    display: flex;
    align-items: center;
    padding: 20px 10px;
    border-bottom: 1px solid @line;
    &:last-child {
      border-bottom: none;
    }
    .name {
      width: 240px;
      font-size: 14px;
    }
    .uni-tag {
      margin-right: 10px;
    }
    .time {
      margin-left: 10px;
      font-size: 12px;
    }
  }
}
.uni-card {
  width: 700px;
}
</style>
