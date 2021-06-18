<template>
  <div class="select-danger-source" @click="handleClick">
    <slot></slot>
  </div>
</template>
<script>
import { uniqueId } from 'lodash'
export default {
  name: 'SelectDangerSourceShell',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    contractId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      key: ''
    }
  },
  created() {
    this.key = uniqueId('dangerSource_')
    uni.$on('update:selectDangerSource', data => {
      if (data.key === this.key) {
        this.$emit('change', data.value[0])
      }
    })
  },
  methods: {
    handleClick() {
      this.$utils.toUrl(`/pages/safe/selectDangerSource?key=${this.key}`)
    }
  }
}
</script>
<style lang="less" scoped></style>
