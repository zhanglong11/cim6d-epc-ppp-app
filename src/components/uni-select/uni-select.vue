<template>
  <picker
    v-if="!disabled"
    mode="selector"
    range-key="label"
    :class="{ placeholder: !activeOption.label }"
    :range="argGroup ? argOptions : options"
    :localValue="value"
    @change="change"
  >
    {{ activeOption.label || placeholder }}
  </picker>
  <span v-else>
    {{ activeOption.label || placeholder }}
  </span>
</template>

<script>
import { find, isNull } from 'lodash'
export default {
  name: 'UniSelect',
  props: {
    options: {
      type: Array,
      default() {
        return [
          { label: '合格', value: 1 },
          { label: '不合格', value: 2 }
        ]
      }
    },
    value: {
      type: [Number, String],
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    argGroup: {
      type: String,
      default: null
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localValue: null
    }
  },
  computed: {
    activeOption() {
      if (!isNull(this.localValue)) {
        return find(this.argGroup ? this.argOptions : this.options, { value: this.localValue }) || {}
      } else return {}
    },
    argOptions() {
      if (this.argGroup) {
        return find(this.$store.state.systemConfig.argTree, { argGroup: this.argGroup })?.children ?? []
      } else {
        return []
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.localValue = this.value
      }
    }
  },
  methods: {
    change({ target: { value: index } }) {
      this.localValue = this.argGroup ? this.argOptions[index].value : this.options[index].value
      this.$emit('input', this.localValue)
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-select.less';
</style>
