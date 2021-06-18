<template>
  <p class="uni-status status">
    <span
      class="status-icon"
      :style="{ backgroundColor: activeOption.color }"
      :class="[activeOption.color ? activeOption.color : '']"
    />
    <span>{{ activeOption.label }}</span>
  </p>
</template>

<script>
import { find } from 'lodash'
export default {
  name: 'UniStatus',
  props: {
    options: {
      type: Array,
      default() {
        return [
          { label: '合格', value: 1, color: '#0079FE' },
          { label: '不合格', value: 2, color: '#FF0000' }
        ]
      }
    },
    value: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    activeOption() {
      return find(this.options, { value: this.value }) || {}
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-status.less';
</style>
