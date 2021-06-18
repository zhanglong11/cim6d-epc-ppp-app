<template>
  <ul class="tag-wrap">
    <li
      v-for="item in computedOptions"
      :key="item.value"
      :class="{ active: computedValue.includes(item.value) }"
      @click="select(item)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'UniCheckboxButtonGroup',
  components: {},
  props: {
    value: {},
    options: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    join: {
      // 交互的数据是否是 , 连起来的数组
      type: Boolean,
      default: false
    },
    //是否有选项 全部
    hasAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedList: []
    }
  },
  computed: {
    computedOptions() {
      if (this.hasAll) {
        return [{ label: '全部', value: '' }, ...this.options]
      } else {
        return this.options
      }
    },
    computedValue() {
      if (_.isString(this.value)) {
        return this.value.split(',')
      } else if (_.isArray(this.value)) {
        return this.value
      } else if (this.value || this.value === 0) {
        return [this.value]
      } else {
        return []
      }
    }
  },
  methods: {
    select(item) {
      if (this.multiple) {
        if (this.computedValue.includes(item.value)) {
          this.selectedList = this.selectedList.filter(r => r.value !== item.value)
        } else {
          this.selectedList.push(item)
        }
      } else {
        if (this.selectedList.concat({ value: this.value }).some(r => r.value === item.value)) {
          this.selectedList = []
        } else {
          this.selectedList = [item]
        }
      }
      this.$emit('change', this.selectedList)
      const values = _.map(this.selectedList, 'value')
      if (this.multiple) {
        if (this.join) {
          this.$emit('input', values.join(','))
        } else {
          this.$emit('input', values)
        }
      } else {
        this.$emit('input', values[0])
      }
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-checkbox-button-group.less';
</style>
