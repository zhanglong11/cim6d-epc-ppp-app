<template>
  <textarea :value="value" auto-height class="align-right" :placeholder="placeholder" disabled @click="toDetails" />
</template>

<script>
import { uniqueId } from 'lodash'

export default {
  name: 'UniDocumentSelect',
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
    this.key = uniqueId('document_select_')
    uni.$on('update:document-select', data => {
      console.log(data)
      if (data.key === this.key) {
        this.$emit('input', data.subCustomContent)
        this.$emit('selectData', data)
      }
    })
  },
  methods: {
    // 跳转详情
    toDetails() {
      this.$utils.toUrl(`/pages/document/select-document?allowLast=false&key=${this.key}`)
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-document-select.less';
</style>
