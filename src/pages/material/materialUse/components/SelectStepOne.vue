<template>
  <div class="main-body">
    <h1>{{ detail.planName }}</h1>
    <uni-card v-if="yearList.length">
      <ul class="list">
        <li v-for="item in yearList" :key="item.year" @click="handleOpenProcedureDrawer(item.year)">
          <span>{{ item.label }}</span>
          <span>任务数：{{ item.doneCount }}/{{ item.count }}</span>
        </li>
      </ul>
    </uni-card>
    <EmptyTemplate v-else></EmptyTemplate>
    <!-- 进度侧边栏start -->
    <uni-drawer ref="ProcedureOneList" class="drawer" :width="750" mode="right">
      <div class="header">
        <span class="close" @click="handleCloseDrawer">取消</span>
        <span class="title">关联进度</span>
      </div>
      <SelectStepTwo :year="year" @selected="handleSelectedSchdule" />
    </uni-drawer>
  </div>
</template>

<script>
import SelectStepTwo from '@/pages/material/materialUse/components/SelectStepTwo'
export default {
  name: 'SelectStepOne',
  components: {
    SelectStepTwo
  },
  data() {
    return {
      year: null
    }
  },
  computed: {
    detail() {
      return this.$store.state.schedule.detail
    },
    yearList() {
      return this.$store.state.schedule.yearList
    }
  },
  created() {
    this.$store.dispatch('schedule/getList')
  },
  methods: {
    // 显示进度选择模态框
    handleOpenProcedureDrawer(year) {
      this.year = year
      this.$refs.ProcedureOneList.open()
    },
    // 关闭进度选择模态框
    handleCloseDrawer() {
      this.$refs.ProcedureOneList.close()
    },
    // 选择进度完成
    handleSelectedSchdule(data) {
      this.$emit('selected', {
        checkedValue: data.checkedValue,
        checked: data.checked
      })
      this.$refs.ProcedureOneList.close()
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
