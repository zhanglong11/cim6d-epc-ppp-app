<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handlePreviewItemInfo(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title flex-item">{{ item.code }}</view>
                <view class="flex-item">
                  <view class="flex-item-label">入库类型：</view>
                  <view class="flex-item-content">{{ $getLabel(receiptType, item.type) }}</view>
                </view>
                <view class=" flex-item">
                  <view class="flex-item-label">入库金额(￥)：</view>
                  <view class="flex-item-content">{{
                    isNaN(Number(item.money)) ? '' : Number(item.money).toFixed(2)
                  }}</view>
                </view>
              </view>
            </view>
            <view class="card-footer  border-top">
              <text>入库人：{{ item.creatorName }}</text>
              <text>入库时间： {{ item.createTime | formatDataTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAddItemInfo" />
    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">入库类型</h6>
        <uni-checkbox-button-group v-model="drawerForm.type" :options="receiptType" />
        <h6 class="label">入库人</h6>
        <uni-select-user v-model="drawerForm.creators" :mode="2" multiple></uni-select-user>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import receiptType from './lib/receiptType'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      receiptType,
      drawerForm: {}
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      if (data.creators) {
        data.creators = data.creators.split(',')
      } else {
        data.creators = null
      }
      this.fly.material
        .post('/materialInput/page', data, { isLoading: true })
        .then(res => {
          this.list.push(...res.data.records)
          this.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.search = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.search = ''
      this.init()
    },
    handleAddItemInfo() {
      this.$utils.toUrl('/pages/material/receipt/add')
    },
    handlePreviewItemInfo(row) {
      this.$utils.toUrl('/pages/material/receipt/detail?id=' + row.id)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },

    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      this.filterForm.type = this.filterForm.type || null
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../styles/list.less');
@import url('./list.less');
</style>
