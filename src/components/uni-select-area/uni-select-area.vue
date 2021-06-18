<template>
  <textarea
    :value="addressText"
    auto-height
    class="align-right"
    :placeholder="placeholder"
    @click="$utils.toUrl(`/pages/select-area/select-province?key=${key}&checkedIds=${value}`)"
  />
</template>

<script>
import { uniqueId } from 'lodash'
import getPcaName from '@/utils/getPcaName'
export default {
  name: 'UniSelectArea',
  // import引入的组件需要注入到对象中才能使用
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
    // 这里存放数据
    return {
      key: '',
      addressText: ''
    }
  },
  watch: {
    value(val) {
      this.getPcaName()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getPcaName()
      this.key = uniqueId('address_')
      uni.$on('update:select-address', data => {
        if (data.key === this.key) {
          if (data.value) {
            const areaCode = data.value
            const provinceCode = areaCode.slice(0, 2)
            const cityCode = areaCode.slice(0, 4)
            this.$emit('input', [provinceCode, cityCode, areaCode].join('_'))
          }
        }
      })
    },
    // 获取地区中文
    getPcaName() {
      if (!this.value) {
        return
      }
      const areaCode = this.value.slice(0, 8)
      const provinceCode = areaCode.slice(0, 2)
      const cityCode = areaCode.slice(0, 4)
      this.addressText = [provinceCode, cityCode, areaCode].map(getPcaName).join(' ')
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-select-area.less';
</style>
