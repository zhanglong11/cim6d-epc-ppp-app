<template>
  <div class="outWrapper" :style="{ height: height + 'px' }">
    <div
      v-if="icon"
      class="iconWrapper"
      :style="{ width: iconSize + 20 + 'px', height: height + 'px', maxWidth: height + 'px' }"
    >
      <!--    <uni-icons :type="icon" :size="iconSize" :color="iconColor"></uni-icons>-->
      <uni-font-awesome :type="icon" :color="iconColor"></uni-font-awesome>
    </div>
    <div class="inputWrapper" :style="{ height: height }">
      <input :value="value" :placeholder="placeholder" :type="inputType" @input="handleInput" />
    </div>
    <div class="btnWrapper" :style="{ color: btnColor }">
      <button v-if="btnText" class="btn" @click="handBtnClick">{{ btnText }}</button>
      <slot name="btn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UniInputIcon',
  components: {},
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: Number,
      default: 40
    },
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: Number,
      default: 14
    },
    iconColor: {
      type: String,
      default: '#333333'
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    inputType: {
      type: String,
      default: 'text'
    },
    btnText: {
      type: String,
      default: ''
    },
    btnColor: {
      type: String,
      default: '#0079FE'
    }
  },
  data() {
    return {
      valueCopy: this.value
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value)
    },
    handBtnClick() {
      this.$emit('btnClick')
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-input-icon.less';
</style>
