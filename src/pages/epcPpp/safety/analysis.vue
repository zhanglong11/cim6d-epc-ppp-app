<template>
  <view class="main" style="padding-top: 10rpx;">
    <block v-if="filterForm.diff">
      <SafetyIssueDiff></SafetyIssueDiff>
    </block>
    <block v-if="filterForm.year && !filterForm.month">
      <IssueYear :key="filterForm.year" :year="filterForm.year"></IssueYear>
    </block>
    <block v-if="filterForm.month">
      <IssueMonth :key="filterForm.month" :year="filterForm.year" :month="filterForm.month"> </IssueMonth>
    </block>
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <!--<h6 class="label">安全问题分析</h6>
        <uni-checkbox-button-group-no-cancel
          key="aa"
          v-model="drawerForm.diff"
          :options="[{ label: '年度对比分析', value: 1 }]"
          @change="handleDiffSelectChange"
        />-->
        <h6 class="label">年度分析</h6>
        <uni-checkbox-button-group-no-cancel
          key="bb"
          v-model="drawerForm.year"
          :options="yearOptions"
          @change="handleYearSelectChange"
        />
        <h6 class="label">月度分析</h6>
        <uni-checkbox-button-group-no-cancel
          key="cc"
          v-model="drawerForm.month"
          :options="monthOptions"
          @change="handleMonthSelectChange"
        ></uni-checkbox-button-group-no-cancel>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import _ from 'lodash'
import SafetyIssueDiff from '@/pages/epcPpp/safety/components/SafetyIssueDiff'
import IssueYear from '@/pages/epcPpp/safety/components/IssueYear'
import IssueMonth from '@/pages/epcPpp/safety/components/IssueMonth'
import Api from '@/pages/epcPpp/safety/api'
export default {
  name: 'Manage',
  components: { SafetyIssueDiff, IssueYear, IssueMonth },
  data() {
    return {
      projectId: wx.getStorageSync('projectId'),
      filterForm: {
        // diff: 1,
        month: '',
        year: this.moment().format('YYYY')
      },
      drawerForm: {},
      yearOptions: [
        {
          label: this.moment().format('YYYY') + '年',
          value: this.moment().format('YYYY')
        }
      ],
      monthOptions: [
        {
          label: this.moment().format('YYYY') + '年' + this.moment().format('MM') + '月',
          value: this.moment().format('MM')
        }
      ]
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.getYear()
    this.getMonth(this.moment().format('YYYY'))
  },
  methods: {
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
    },
    //筛选项改变时
    handleDiffSelectChange(data) {
      this.drawerForm = { ...this.drawerForm, diff: data, year: '', month: '' }
    },
    handleYearSelectChange(data) {
      this.drawerForm = { ...this.drawerForm, diff: '', year: data, month: '' }
      this.getMonth(data)
    },
    handleMonthSelectChange(data) {
      this.drawerForm = { ...this.drawerForm, diff: '', month: data }
    },
    //获取年份
    async getYear() {
      let res = await Api.getYear()
      this.yearOptions =
        res.data &&
        res.data.map(item => {
          return {
            label: item.year + '年',
            value: item.year
          }
        })
    },
    //获取月份
    async getMonth(month) {
      let res = await Api.getMonth({ year: month })
      this.monthOptions =
        res.data &&
        res.data.map(item => {
          return {
            label: item.year + '年' + item.month + '月',
            value: item.month
          }
        })
    }
  }
}
</script>

<style scoped></style>
