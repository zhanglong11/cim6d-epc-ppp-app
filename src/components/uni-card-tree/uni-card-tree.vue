<template>
  <view class="uni-card-tree">
    <view v-for="item in list" :key="item[itemKey]">
      <uni-card-tree-node :itemKey="itemKey" :item="item" @node-click="handleNodeClick">
        <div slot-scope="{ item }">
          <slot :item="item"></slot>
        </div>
      </uni-card-tree-node>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UniCardTree',
  components: {},
  props: {
    itemKey: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    refresh() {},
    // 点击事件
    onClick() {
      this.$emit('click')
    },
    handleNodeClick(item) {
      this.$emit('node-click', item)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.uni-card-tree {
  width: 700px;
  margin: 0 auto;
}
</style>
