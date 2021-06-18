<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleInventoryItemClick(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.name }}</view>
                <view class="flex-wrapper">
                  <view class="flex-item">
                    <view class="flex-item-label">材料编码：</view>
                    <view class="flex-item-content">{{ item.code }}</view>
                  </view>
                  <view class=" flex-item">
                    <view class="flex-item-label">品牌：</view>
                    <view class="flex-item-content">{{ item.brand }}</view>
                  </view>
                </view>
                <view class="flex-wrapper">
                  <view class="flex-item">
                    <view class="flex-item-label">规格型号：</view>
                    <view class="flex-item-content">{{ item.models }}</view>
                  </view>
                  <view class=" flex-item">
                    <view class="flex-item-label">库存量：</view>
                    <view class="flex-item-content">{{ item.inventoryNumber }}</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="card-footer  border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | ymd }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAddInventorytItem" />
    <EmptyTemplate v-if="total === 0" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        page: 1,
        rows: 10,
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0
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
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      this.fly.material
        .post('material/list', data, { isLoading: true })
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
      this.filterForm.keyword = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    handleAddInventorytItem() {
      this.$utils.toUrl('/pages/material/inventory/add')
    },
    handleInventoryItemClick(row) {
      this.$utils.toUrl('/pages/material/inventory/detail?id=' + row.id)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
