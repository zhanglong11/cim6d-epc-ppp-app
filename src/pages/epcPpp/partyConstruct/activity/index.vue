<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item of list" :key="item.id" @click.native="handleItemClick(item)">
            <view class="card-body">
              <view class="bodyContainer">
                <view v-if="item.imageId" class="left">
                  <!--                  <image :src="item.imageUrl"></image>-->
                  <uni-preview-image :id="item.imageId"></uni-preview-image>
                </view>
                <view class="right">
                  <view class="title">{{ item.title }}</view>
                  <view class="content">{{ item.content }}</view>
                </view>
              </view>
            </view>
            <view class="card-footer border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建日期： {{ item.createTime }}</text>
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
  name: 'EpcPartyConstructActivity',
  data() {
    return {
      filterForm: {
        title: '',
        search: '',
        page: 0,
        rows: 10,
        projectId: wx.getStorageSync('projectId')
      },
      onlyFinished: false, //活动回顾true,所有活动false
      loading: false,
      total: 0,
      list: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  onShow() {
    //this.init()
  },
  onLoad(options) {
    this.onlyFinished = options.onlyFinished
    if (this.onlyFinished) {
      this.$utils.setTitle('党建活动回顾')
    }
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {},
  methods: {
    getData: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res
      if (this.onlyFinished) {
        //活动回顾
        res = await Api.getActivityList(data).finally(() => {
          this.loading = false
        })
      } else {
        //所有活动
        res = await Api.getActivity(data).finally(() => {
          this.loading = false
        })
      }

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
      this.filterForm.search = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.title = ''
      this.filterForm.search = ''
      this.init()
    },
    handleItemClick(row) {
      this.$utils.toUrl(`/pages/epcPpp/partyConstruct/activity/detail?id=${row.id}`)
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
