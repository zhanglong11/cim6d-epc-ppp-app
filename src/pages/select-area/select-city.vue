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
export default {
  name: 'SelectArea',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      areaList: [],
      provinceCode: null,
      key: '',
      checkedIds: null,
      curCode: null
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.getCityData()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    getCityData() {
      if (this.provinceCode) {
        this.areaList = areaData.find(r => r.value === this.provinceCode).children
      }
    },
    selectCountry(item) {
      this.$utils.toUrl(
        `/pages/select-area/select-area?name=${item.label}&code=${item.value}&checkedIds=${this.checkedIds}&key=${this.key}`
      )
    }
  },
  onLoad(options) {
    this.provinceCode = options.code
    this.key = options.key
    this.checkedIds = options.checkedIds
    this.curCode = options.checkedIds ? options.checkedIds.slice(3, 7) : null
  }
}
</script>

<style scoped lang="less">
@import url('./select-city.less');
</style>
