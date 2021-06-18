<template>
  <div v-if="total > 0" class="load-more">
    <p v-if="loading">加载中</p>
    <template v-else>
      <p v-if="listLength < total">加载更多</p>
      <p v-else>没有更多了</p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'UniMore',
  props: {
    // 当前加载的数据条数
    listLength: {
      type: Number,
      default: 0
    },
    // 总条数
    total: {
      type: Number,
      default: 0
    },
    // 是否显示加载中
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-more.less';
</style>
