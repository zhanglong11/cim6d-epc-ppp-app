<template>
  <div class="item" :class="{ active: name === activeName }" @click="$parent.$emit('input', name)">
    <div class="wrap">
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'UniTabPane',
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      activeName: false
    }
  },
  created() {
    this.activeName = this.$parent.value
    this.$parent.$watch('value', val => {
      this.activeName = val
    })
  }
}
</script>

<style scoped lang="less">
@import './uni-tab-pane.less';
</style>
