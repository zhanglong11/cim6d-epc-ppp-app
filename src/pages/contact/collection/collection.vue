<template>
  <div class="main">
    <div class="card">
      <uni-form-item v-for="item in list" :key="item.id" :label="item.name" isLink @click="handleClick(item)">
        <uni-avatar slot="icon" :size="80" :user="{ name: item.name }"></uni-avatar>
      </uni-form-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collection',
  data() {
    return {
      list: [
        { name: '小收藏', id: 1 },
        { name: '大收藏', id: 2 }
      ]
    }
  },
  onNavigationBarButtonTap(options) {
    if (options.key === 'add') {
      this.$utils.toUrl(`add`)
    }
  },

  methods: {
    handleClick({ id, name }) {
      this.$utils.toUrl(`detail?id=${id}&name=${name}`)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.card {
  width: 700px;
}
</style>
