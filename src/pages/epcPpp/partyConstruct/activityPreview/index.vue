<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item of list" :key="item.id" class="activityPreview" @click.native="handleItemClick(item)">
            <view class="card-info">
              <view class="title">{{ item.title }}</view>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <EmptyTemplate v-if="total === 0" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from '@/pages/epcPpp/partyConstruct/api'
export default {
  name: 'EpcPartyConstructActivityPreview',
  data() {
    return {
      filterForm: {
        title: '',
        page: 0,
        rows: 15,
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      total: 0,
      list: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {},
  methods: {
    //获取列表
    getData: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getActivityPreviewList(data).finally(() => {
        this.loading = false
      })
      let records = (res.data && res.data.records) || []
      this.list = [...this.list, ...records]
      this.total = res.data ? res.data.total : 0
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.getData()
    },
    handleDrawerFormChange() {
      this.init()
    },
    handleDrawerReset() {
      this.init()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.title = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.title = ''
      this.init()
    },
    handleItemClick(row) {
      this.$utils.toUrl(`/pages/epcPpp/partyConstruct/activityPreview/detail?id=${row.id}`)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../style/index.less');
</style>
