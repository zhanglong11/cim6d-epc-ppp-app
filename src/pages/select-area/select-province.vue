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
import { flattenDeep, chain } from 'lodash'
export default {
  name: 'SelectArea',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      areaList: [],
      key: '',
      curCode: null,
      checkedIds: null
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新列表
    refresh() {
      this.areaList = areaData
    },
    selectCountry(item) {
      this.$utils.toUrl(
        `/pages/select-area/select-city?name=${item.label}&code=${item.value}&checkedIds=${this.checkedIds}&key=${this.key}`
      )
    }
  },
  onLoad(options) {
    this.key = options.key
    this.checkedIds = options.checkedIds
    this.curCode = options.checkedIds ? options.checkedIds.slice(0, 2) : null
  }
}
</script>

<style scoped lang="less">
@import url('./select-province.less');
</style>
