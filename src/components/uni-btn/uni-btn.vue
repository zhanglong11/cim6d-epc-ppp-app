<template>
  <div :class="['btn-wrap', type, size]" @click="$emit('click')">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'UniButton',
  components: {},
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import './uni-btn.less';
</style>
