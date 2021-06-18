<template>
  <div class="main">
    <Year v-if="_.isNil(filterForm.month)" key="year" :year="filterForm.year"></Year>
    <Month v-else key="month" :year="filterForm.year" :month="filterForm.month"></Month>
    <uni-drawer-custom ref="filterRef" :width="570" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <h6>年度分析</h6>
      <uni-checkbox-button-group
        v-model="drawerForm.year"
        :options="
          new Array(10).fill('').map((e, index) => ({
            label: moment().year() - index + '年',
            value: moment().year() - index
          }))
        "
      >
      </uni-checkbox-button-group>
      <h6>月度分析</h6>
      <uni-checkbox-button-group
        v-model="drawerForm.month"
        :options="
          new Array(12).fill('').map((e, index) => ({
            label: index + 1 + '月',
            value: index
          }))
        "
      >
      </uni-checkbox-button-group>
    </uni-drawer-custom>
  </div>
</template>

<script>
import Year from './components/Year'
import Month from './components/Month'
import _ from 'lodash'
import moment from 'moment'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Year, Month },
  data() {
    // 这里存放数据
    return {
      filterForm: {
        year: moment().year(),
        month: moment().month()
      },
      drawerForm: {}
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'filter') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.main {
  padding-top: 0;
  padding-bottom: 30px;
}
.uni-drawer-custom {
  h6 {
    font-size: 14px;
    margin-bottom: 15px;
  }
}
</style>
