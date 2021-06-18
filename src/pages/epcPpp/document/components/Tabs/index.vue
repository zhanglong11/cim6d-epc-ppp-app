<template>
  <div class="wrapper">
    <span
      v-for="item in tabList"
      :key="item.value"
      :class="value === item.value ? 'active' : ''"
      @click="tabClick(item)"
    >
      {{ item.label }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'Tabs',
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    // v-model双向绑定
    value: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {}
  },
  methods: {
    tabClick(item) {
      this.$emit('click', item.value)
    }
  }
}
</script>
<style lang="less">
.wrapper {
  display: flex;
  padding: 20px 0;
  justify-content: space-between;
  overflow-x: auto;
  line-height: 30px;
  > span {
    flex: 1;
    text-align: center;
    white-space: nowrap;
    padding: 20px;
    border-bottom: 6px solid transparent;
    &.active {
      color: #496fe5;
      border-bottom: 6px solid #496fe5;
    }
  }
}
</style>
