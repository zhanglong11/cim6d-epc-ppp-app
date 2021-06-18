<template>
  <ul class="tag-wrap">
    <li v-for="item in options" :key="item.value" :class="{ active: value === item.value }" @click="select(item)">
      {{ item.label }}
    </li>
  </ul>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'UniCheckboxButtonGroupNoCancel',
  components: {},
  props: {
    value: { type: [Number, String], default: '' },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    select(item) {
      this.$emit('change', item.value)
      this.$emit('input', item.value)
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-checkbox-button-group-no-cancel.less';
</style>
