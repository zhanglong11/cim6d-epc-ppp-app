<template>
  <view class="main">
    <uni-search-bar
      placeholder="设备编号/设备名称搜索"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleListItemClick(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.equipmentName }}({{ item.equipmentCode }})</view>
                <view class="flex-wrapper">
                  <view class="flex-left">
                    <view class="flex-item flex-100">
                      <view class="flex-item-label">故障等级：</view>
                      <view class="flex-item-content">{{ $getLabel(levelList, item.level) }}</view>
                    </view>
                    <view class=" flex-item">
                      <view class="flex-item-label">故障类别：</view>
                      <view class="flex-item-content">{{ $getLabel(categoryList, item.type) }}</view>
                    </view>
                    <view class=" flex-item">
                      <view class="flex-item-label">发生时间：</view>
                      <view class="flex-item-content">{{ item.faultTime | ymd }}</view>
                    </view>
                  </view>
                  <block>
                    <uni-status
                      v-if="item.handleState || item.handleState === 0"
                      :options="repairStatusList"
                      :value="item.handleState"
                    ></uni-status>
                    <uni-status v-else :options="applyStatusList" :value="item.repairStatus"></uni-status>
                  </block>
                </view>
              </view>
            </view>
            <view class="card-footer  border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | formatDataTime }}</text>
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
        <h6 class="label">报修状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.repairStatus" :options="applyStatusList" />
        <p class="item-line" />
        <h6 class="label">处理状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.handleState" :options="repairStatusList" />
        <p class="item-line" />
        <h6 class="label">参与人员</h6>
        <uni-select-user v-model="drawerForm.userIds" :mode="2" multiple></uni-select-user>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import levelList from './lib/levelList'
import categoryList from './lib/categoryList'
import repairStatusList from './lib/repairStatusList'
import applyStatusList from './lib/applyStatusList'
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
      total: 0,
      drawerForm: {},
      levelList,
      categoryList,
      repairStatusList,
      applyStatusList
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
        .post('equipmentRepair/list', data, { isLoading: true })
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
      this.$utils.toUrl('/pages/equipment/Troubleshooting/add')
    },
    handleListItemClick(row) {
      console.log('ceshi ', row)
      // 报修状态
      if (row.repairStatus === 2 && !row.handleState) {
        //审核通过且没有进行维修进入设备故障维修页面
        this.$utils.toUrl(`/pages/equipment/Troubleshooting/addShooting?id=${row.id}`)
      } else if (row.handleState) {
        // 维修完成待验收
        this.$utils.toUrl(`/pages/equipment/Troubleshooting/shootingDetail?id=${row.id}&handleState=${row.handleState}`)
      } else {
        //草稿、待审核、审核驳回界面
        this.$utils.toUrl(`/pages/equipment/Troubleshooting/detail?id=${row.id}&repairStatus=${row.repairStatus}`)
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
