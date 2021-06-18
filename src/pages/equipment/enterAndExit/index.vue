<template>
  <view class="main">
    <uni-search-bar
      placeholder="进场编号/负责人搜索"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleListItemClick(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.equipmentName || '' + item.equipmentCode }}</view>
                <view class="flex-wrapper">
                  <view class="flex-left">
                    <view class="flex-item">
                      <view class="flex-item-label">进场编号：</view>
                      <view class="flex-item-content">{{ item.code }}</view>
                    </view>

                    <view class=" flex-item">
                      <view class="flex-item-label">使用位置：</view>
                      <view class="flex-item-content">{{ item.location }}</view>
                    </view>
                  </view>
                  <block>
                    <uni-status :options="equipmentStatusList" :value="item.status"></uni-status>
                  </block>
                </view>
              </view>
            </view>
            <view class="card-footer  border-top">
              <template v-if="item.status === 1">
                <text>进场负责人：{{ item.enterPrincipalName }}</text>
                <text>进场日期： {{ item.enterTime | ymd }}</text>
              </template>
              <template v-else>
                <text>退场负责人：{{ item.exitPrincipalName }}</text>
                <text>退场日期： {{ item.realExitTime | ymd }}</text>
              </template>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAddItem" />
    <EmptyTemplate v-if="total === 0" />
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">设备状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" :options="equipmentStatusList" />
        <p class="item-line" />
        <h6 class="label">参与人员</h6>
        <uni-select-user v-model="drawerForm.userIds" :mode="2" multiple></uni-select-user>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import equipmentStatusList from './lib/equipment'
import { mapGetters } from 'vuex'
import SelectEquipment from '../select-equipment/select-equipment'

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
      total: 0,
      drawerForm: {},
      equipmentStatusList
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
      this.fly.material
        .post('equipmentEnterExit/list', data, { isLoading: true })
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
    handleAddItem() {
      this.$utils.toUrl('/pages/equipment/enterAndExit/enter')
    },
    handleListItemClick(row) {
      if (row.status === 1) {
        this.$utils.toUrl('/pages/equipment/enterAndExit/enterDetail?id=' + row.id)
      } else if (row.status === 2) {
        this.$utils.toUrl('/pages/equipment/enterAndExit/exitDetail?id=' + row.id)
      }
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      this.filterForm.status = this.filterForm.status || ''
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
@import url('./index.less');
</style>
