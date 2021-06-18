<template>
  <div class="main-body">
    <h1>{{ year }} 年度</h1>
    <uni-card>
      <ul class="list">
        <li v-for="item in monthList" :key="item.month" @click="handleOpenProcedureDrawer(item)">
          <span>{{ item.label }}</span>
          <span>任务数：{{ item.doneCount }}/{{ item.count }}</span>
        </li>
      </ul>
    </uni-card>
    <!-- 进度侧边栏start -->
    <uni-drawer ref="ProcedureTwoList" class="drawer" :width="750" mode="right">
      <div class="header">
        <span class="close" @click="handleCloseDrawer">取消</span>
        <span class="title">关联进度</span>
      </div>
      <SelectStepList :year="year" :month="month" @selected="handleSelectedSchdule" />
    </uni-drawer>
  </div>
</template>

<script>
import _ from 'lodash'
import SelectStepList from '@/pages/material/materialUse/components/SelectStepList'
export default {
  name: 'SelectStepTwo',
  components: {
    SelectStepList
  },
  props: {
    year: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      // years: null,
      month: null
    }
  },
  computed: {
    monthList() {
      return _.find(this.$store.state.schedule.yearList, { year: +this.year })?.children ?? []
    },
    total() {
      return _.find(this.$store.state.schedule.yearList, { year: +this.year })?.count
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 显示进度选择模态框
    handleOpenProcedureDrawer(item) {
      this.month = item.month
      this.$refs.ProcedureTwoList.open()
    },
    // 关闭进度选择模态框
    handleCloseDrawer() {
      this.$refs.ProcedureTwoList.close()
    },
    // 选择进度完成
    handleSelectedSchdule(data) {
      this.$emit('selected', {
        checkedValue: data.checkedValue,
        checked: data.checked
      })
      this.$refs.ProcedureTwoList.close()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
@import url('../step.less');
h1 {
  font-weight: normal;
  font-size: 20px;
  text-align: center;
}
.uni-card {
  width: 700px;
}
.list {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 20px 30px;
    border-bottom: 1px solid rgba(241, 241, 241, 1);
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
