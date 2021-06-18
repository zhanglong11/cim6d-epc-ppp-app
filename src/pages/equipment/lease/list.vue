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
                  <view class="flex-item-label">申请部门：</view>
                  <view class="flex-item-content">{{ item.applyDepartmentName }}</view>
                </view>
                <view class=" flex-item">
                  <view class="flex-item-label">租赁单位：</view>
                  <view class="flex-item-content">{{ item.leaseCompany }}</view>
                </view>
              </view>
              <view>
                <p>
                  <span class="circle" :style="{ backgroundColor: purchaseStatus[item.status].color }"></span
                  >{{ purchaseStatus[item.status].label }}
                </p>
              </view>
            </view>
            <view class="card-footer  border-top">
              <text>申请人：{{ item.applicantName }}</text>
              <text>申请时间： {{ item.applyTime | formatData }}</text>
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
        <h6 class="label">采购状态</h6>
        <uni-checkbox-button-group v-model="filterForm.status" :options="purchaseStatus" />
        <h6 class="label">参与人员</h6>
        <uni-select-user v-model="drawerForm.participantId" :mode="2" multiple></uni-select-user>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { Api } from '@/api/material/equipment/lease'
import purchaseStatus from './lib/purchaseStatus'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        status: '',
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      purchaseStatus,
      drawerForm: {}
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    'filterForm.inspectStatus'() {
      this.init()
    }
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
      Api.getLeaseList(data).then(res => {
        this.list = res.data.records || []
        this.total = res.data.total
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
      this.$utils.toUrl('/pages/equipment/lease/add')
    },
    handlePreviewItemInfo(row) {
      this.$utils.toUrl(`/pages/equipment/lease/detail?id=${row.id}&status=${row.status}`)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },

    handleDrawerFormChange() {
      // this.filterForm = this.drawerForm
      console.log('filter change', this.filterForm)
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
