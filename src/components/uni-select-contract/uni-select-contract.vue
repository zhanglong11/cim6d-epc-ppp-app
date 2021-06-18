<template>
  <textarea
    :value="name || localName"
    auto-height
    :maxlength="-1"
    class="align-right"
    :placeholder="placeholder"
    disabled
    @click="
      $utils.toUrl(
        `/pages/select-contract/select-contract?&key=${key}&secondPartyId=${secondPartyId}&status=${status}&firstPartyId=${firstPartyId}`
      )
    "
  />
</template>
<script>
import { uniqueId } from 'lodash'
export default {
  name: 'UniSelectUser',
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
    name: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    },
    secondPartyId: {
      type: String,
      default: ''
    },
    firstPartyId: {
      type: String,
      default: ''
    },
    status: {
      type: [Number, String],
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
    this.key = uniqueId('contract_')
    uni.$on('update:select-contract', data => {
      if (data.key === this.key) {
        let id = data.value.map(e => e.id).join(',')
        let name = data.value.map(e => e.name).join(',')
        let code = data.value.map(e => e.code).join(',')
        this.localName = name
        this.$emit('input', id)
        this.$emit('update:name', name)
        this.$emit('update:code', code)
        this.$emit('change', {
          id,
          name
        })
      }
    })
  }
}
</script>
<style lang="less" scoped></style>
