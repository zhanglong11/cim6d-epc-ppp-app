<template>
  <textarea
    :value="name || localName"
    auto-height
    :maxlength="-1"
    class="align-right"
    :placeholder="placeholder"
    disabled
    @click="$utils.toUrl(`/pages/select-location/select-location?key=${key}&selectId=${value}`)"
  />
</template>
<script>
import { uniqueId } from 'lodash'
export default {
  name: 'UniSelectLocation',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      key: '',
      localName: ''
    }
  },
  created() {
    this.key = uniqueId('location_')
    uni.$on('update:select-location', data => {
      if (data.key === this.key) {
        this.localName = data.name
        this.$emit('input', data.value)
        this.$emit('update:name', data.name)
      }
    })
  }
}
</script>
<style lang="less" scoped></style>
