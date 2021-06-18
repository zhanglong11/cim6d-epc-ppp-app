<template>
  <view
    class="form-item"
    :class="{ 'no-border': !form.border || !border, [type]: type, 'is-cell': isCell }"
    @click="onClick"
  >
    <view
      v-if="icon"
      class="form-icon"
      :style="{
        width: iconSize + 'rpx',
        height: iconSize + 'rpx'
      }"
    >
      <image :src="icon" />
    </view>
    <slot name="icon" />
    <view
      v-if="!noLobel"
      class="title form-label"
      :class="{
        'form-label-required': (isRequired || required) && !form.hideRequiredAsterisk,
        'is-disabled': computedDisabled
      }"
    >
      {{ label }}
    </view>
    <view
      class="form-input"
      :class="{
        [computedAlign]: true,
        'no-lobel': noLobel,
        'is-disabled': computedDisabled
      }"
    >
      <slot />
    </view>
    <div v-if="isLink && !(disabled || form.disabled)" class="form-link" />
  </view>
</template>

<script>
import schema from 'async-validator'
import _ from 'lodash'
export default {
  name: 'UniFormItem',
  inject: {
    form: {
      default: {
        hideRequiredAsterisk: false, //是否显示label中的必选*号
        disabled: false, //是否禁止编辑
        rules: {},
        data: {},
        vm: null,
        align: null,
        border: true
      }
    }
  },
  provide() {
    return {
      formItem: {
        disabled: this.computedDisabled
      }
    }
  },
  props: {
    // 表单名字
    label: {
      type: String
    },
    // 禁用label
    noLobel: {
      type: Boolean,
      default: false
    },
    // 是否必填
    isRequired: {
      type: Boolean,
      default: false
    },
    // 是否显示右侧箭头
    isLink: {
      type: Boolean,
      default: false
    },
    // 是否显示边线
    border: {
      type: Boolean,
      default: true
    },
    // 类型
    type: {
      type: String,
      default: ''
    },
    // 右侧文字对齐方式
    align: {
      type: String,
      default: null
    },
    // 左侧图标
    icon: {
      type: String,
      default: ''
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: null
    },
    // 左侧图标大小
    iconSize: {
      type: Number,
      default: 30
    },
    // 用于表单验证
    prop: {
      type: String,
      default: null
    },
    // 是否用于显示
    isCell: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    required() {
      const rule = _.get(this.form.rules, this.prop)
      if (_.isPlainObject(rule)) {
        if (rule.required) {
          return true
        }
      } else if (_.isArray(rule)) {
        if (rule.filter(e => e.required).length) {
          return true
        }
      }
      return false
    },
    computedAlign() {
      return (!_.isNil(this.align) ? this.align : this.form.align) || 'right'
    },
    computedDisabled() {
      return (!_.isNil(this.disabled) ? this.disabled : this.form.disabled) || false
    }
  },
  created() {},
  mounted() {
    if (this.form.vm && this.prop) {
      this.form.vm.addField(this)
    }
  },
  beforeDestroy() {
    if (this.form.vm && this.prop) {
      this.form.vm.removeField(this)
    }
  },
  methods: {
    // 点击事件
    onClick() {
      if (this.disabled) {
        return
      }
      this.$emit('click')
    },
    validate() {
      if (this.prop && this.form.rules[this.prop]) {
        const rules = _.pick(this.form.rules, this.prop)
        const validator = new schema(rules)
        const value = _.get(this.form.vm.model, this.prop)
        const cn = {
          required: '%s 必填'
        }
        validator.messages(cn)
        return validator.validate({ [this.prop]: value }).catch(({ errors, fields }) => {
          errors[0].message = errors[0].message.replace(this.prop + ' ', this.label)
          return Promise.reject({ errors, fields })
        })
      }
    }
  }
}
</script>

<style lang="less">
@import './uni-form-item.less';
</style>
