<template>
  <view class="main">
    <div class="tabs-wrap">
      <uni-tabs v-model="mode">
        <uni-tab-pane name="in" label="入库记录"></uni-tab-pane>
        <uni-tab-pane name="out" label="出库记录"></uni-tab-pane>
      </uni-tabs>
    </div>
    <uni-search-bar
      ref="searchBar"
      placeholder="请输入编码/入库人/出库人搜索"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="(item, index) in list" :key="mode == 'in' ? item.inputCode : item.outputCode">
            <view class="card-body">
              <view class="card-info">
                <view class="title flex-item">{{
                  `${item.materialName}${index + 1 > 9 ? index + 1 : '0' + (index + 1)}`
                }}</view>
                <!-- 入库信息 -->
                <block v-if="mode === 'in'">
                  <view class="flex-item">
                    <view class="flex-item-label">入库类型：</view>
                    <view class="flex-item-content">{{ $getLabel(receiptType, item.type) }}</view>
                  </view>
                  <view class=" flex-item">
                    <view class="flex-item-label">入库量：</view>
                    <view class="flex-item-content">{{ item.number }}</view>
                  </view>
                  <view class="flex-item">
                    <view class="flex-item-label">单价：</view>
                    <view class="flex-item-content">{{ item.univalence }}</view>
                  </view>
                  <view class="flex-item">
                    <view class="flex-item-label">合价：</view>
                    <view class="flex-item-content">{{ item.combinedPrice }}</view>
                  </view>
                </block>
                <block v-else-if="mode === 'out'">
                  <view class="flex-item">
                    <view class="flex-item-label">使用部位：</view>
                    <view class="flex-item-content">{{ item.usePart || '--' }}</view>
                  </view>
                  <view class=" flex-item">
                    <view class="flex-item-label">出库量：</view>
                    <view class="flex-item-content">{{ item.number }}</view>
                  </view>
                  <view class=" flex-item">
                    <view class="flex-item-label">库存量：</view>
                    <view class="flex-item-content">{{ item.inventoryNumber }}</view></view
                  >
                  <view class="flex-item">
                    <view class="flex-item-label">领料人：</view>
                    <view class="flex-item-content">{{ item.recipientName }}</view>
                  </view>
                </block>
              </view>
            </view>
            <view class="card-footer  border-top">
              <text>{{ mode === 'in' ? '入库人' : '出库人' }}：{{ item.creatorName }}</text>
              <text>{{ mode === 'in' ? '入库时间' : '出库时间' }}： {{ item.createTime | formatDataTime }}</text>
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
import receiptType from '../receipt/lib/receiptType'
export default {
  data() {
    return {
      mode: 'in',
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      receiptType
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    mode() {
      this.filterForm.search = ''
      this.$refs.searchBar.clear()
      this.init()
    }
  },
  onLoad(options) {
    this.filterForm.materialId = options.id
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
      let url = this.mode === 'in' ? 'materialInput/pageListInputMaterial' : 'materialOutput/pageListOutputMaterial'
      this.fly.material
        .post(url, data, { isLoading: true })
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
@import url('./record.less');
</style>
