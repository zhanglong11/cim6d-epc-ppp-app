<template>
  <div>
    <ul class="department-list">
      <li v-for="item in data" :key="item.id" :class="{ active: item.checked }">
        <div class="content" @click="handleClick(item)">
          <uni-avatar :user="item" :size="80"></uni-avatar>
          <p>{{ item.name }}</p>
        </div>
        <DepartmentTree
          v-if="item.children && item.children.length"
          :data="item.children"
          class="department-list"
          @nodeClick="handleClick"
        ></DepartmentTree>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DepartmentTree',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    submit() {},
    remove() {},
    handleClick(item) {
      this.$emit('nodeClick', item)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
@import url('./department.less');
</style>
