<template>
  <ul class="tabs uni-tabs">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'UniTabs',
  props: {
    value: {
      type: [String, Number],
      default: null
    }
  }
}
</script>

<style lang="less">
@import './uni-tabs.less';
</style>
