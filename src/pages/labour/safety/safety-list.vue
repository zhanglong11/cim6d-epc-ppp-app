<template>
  <div class="main">
    <uni-search-bar placeholder="搜索" @input="changeSearch"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y @click.stop>
      <div class="main-body">
        <template v-for="(item, i) in list">
          <uni-card :key="i" class="safety-list" @click="toDetails(item)">
            <h2>{{ item.trainingTheme }}</h2>
            <p class="desc">培训课时：{{ item.trainingHour }}</p>
            <p class="desc">
              合格率：{{
                item.totalEmployee && item.qualifiedEmployee
                  ? _.ceil((item.qualifiedEmployee.split(',').length / item.totalEmployee.split(',').length) * 100, 2) +
                    '%'
                  : ''
              }}
            </p>
            <div class="safety-footer">
              <p>培训讲师：{{ item.lecturer }}</p>
              <p>培训时间：{{ item.trainingTime }}</p>
            </div>
          </uni-card>
        </template>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
    </scroll-view>
    <uni-more :listLength="list.length" :total="total" :loading="loading" />
    <uni-add @click.native="addSafety"></uni-add>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'SafetyList',
  data() {
    //这里存放数据
    return {
      _,
      keyWorks: '',
      list: [],
      total: 3,
      loading: false,
      filterForm: {
        page: 1,
        rows: 10,
        projectId: uni.getStorageSync('projectId')
      }
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.refresh()
  },
  onShow() {
    this.init()
  },
  //方法集合
  methods: {
    async refresh() {
      this.loading = true
      const res = await this.fly.labourSafety.post('training/list', this.filterForm)
      this.loading = false
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    },
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh(true)
    },
    // 搜索
    changeSearch({ value }) {
      this.keyWorks = value
      this.filterForm.trainingTheme = value
      this.init()
    },
    // 新增安全培训
    addSafety() {
      this.$utils.toUrl('/pages/labour/safety/safety-add')
    },
    // 跳转详情
    toDetails(item) {
      this.$utils.toUrl(`/pages/labour/safety/safety-details?id=${item.id}`)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./safety.less');
</style>
