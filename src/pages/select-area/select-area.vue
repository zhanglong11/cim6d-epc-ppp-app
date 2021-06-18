<template>
  <ul class="address-wrapper">
    <li
      v-for="item in areaList"
      :key="item.value"
      :class="item.value === curCode ? 'isCheck' : 'noCheck'"
      @click="selectCountry(item)"
    >
      <span>{{ item.label }}</span>
    </li>
  </ul>
</template>

<script>
import areaData from '@/lib/pca.json'
import { flattenDeep } from 'lodash'
export default {
  name: 'SelectArea',
  data() {
    // 这里存放数据
    return {
      areaList: [],
      cityCode: null,
      areaCode: null,
      key: '',
      curCode: null
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.getAreaData()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    getAreaData() {
      if (this.cityCode) {
        this.areaList = flattenDeep(areaData.map(r => r.children)).find(r => r.value === this.cityCode).children
      }
    },
    selectCountry(item) {
      uni.$emit('update:select-address', { key: this.key, value: item.value })
      this.$utils.goBack(3)
    }
  },
  onLoad(options) {
    this.cityCode = options.code
    this.key = options.key
    this.curCode = options.checkedIds ? options.checkedIds.slice(8) : null
  }
}
</script>

<style scoped lang="less">
@import url('./select-area.less');
</style>
