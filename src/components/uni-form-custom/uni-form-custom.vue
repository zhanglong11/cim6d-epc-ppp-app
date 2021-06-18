<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'UniFormCustom',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default: null
    },
    model: {
      type: Object,
      default() {
        return {}
      }
    },
    align: {
      type: String,
      default: 'right'
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fields: []
    }
  },
  provide() {
    return {
      form: {
        disabled: this.disabled,
        hideRequiredAsterisk: this.hideRequiredAsterisk,
        rules: this.rules,
        data: this.model,
        align: this.align,
        vm: this,
        border: this.border
      }
    }
  },
  methods: {
    validate() {
      const items = this.fields
      return Promise.all(items.map(e => e.validate())).catch(({ errors }) => {
        this.$utils.showToast(errors[0].message)
        return Promise.reject(errors)
      })
    },
    validateField(field, callback) {
      const target = _.find(this.fields, { prop: field })
      if (target) {
        target
          .validate()
          .then(() => callback())
          .catch(err => callback(err))
      }
    },
    addField(field) {
      this.fields.push(field)
    },
    removeField(field) {
      this.fields = this.fields.filter(e => e !== field)
    },
    setRules(rules) {
      this.rules = rules
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
