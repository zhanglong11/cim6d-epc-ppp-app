<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handlePreviewItemInfo(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title-wrap">
                  <view class="title">{{ item.code }}</view>
                  <uni-status :options="maintenanceStatus" :value="item.status" />
                </view>
                <view class="flex-item">
                  <p>
                    <span class="label">保养部门：</span
                    ><span class="info-item">{{ item.maintenanceDepartmentName }}</span>
                  </p>
                </view>
                <view class="flex-item">
                  <p>
                    <span class="label">保养负责人：</span><span class="info-item">{{ item.principalName }}</span>
                  </p>
                  <p>
                    <span class="label">保养人：</span><span class="info-item">{{ item.maintenancePersonName }}</span>
                  </p>
                </view>
              </view>
            </view>
            <view class="card-footer  border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | formatData }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <!--    <uni-add @click.native="handleAddItemInfo" />-->
    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef"  @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">保养状态</h6>
        <uni-checkbox-button-group v-model="filterForm.status" :options="maintenanceStatus" />
        <p class="item-line"></p>
        <h6 class="label">参与人员</h6>
        <uni-select-user v-model="filterForm.userIds" :mode="2" multiple></uni-select-user>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/material/equipment/maintenance'
import sourceList from './lib/sourceList'
import maintenanceStatus from './lib/maintenanceStatus'
import equipmentType from './lib/equipmentType'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        page: 1,
        rows: 10,
        status: '',
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      sourceList,
      maintenanceStatus,
      equipmentType,
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
      Api.list(data).then(res => {
        // this.list = [{ id: 1, name: '2', code: '111', status: 1 }]
        // this.total = 111
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
      this.$utils.toUrl('/pages/equipment/maintenance/add')
    },
    handlePreviewItemInfo(row) {
      console.log(row)
      switch (row.status) {
        case 0:
          this.$utils.toUrl(`/pages/equipment/maintenance/detailWaitMaintain?id=${row.id}`)
          return
        case 1:
          this.$utils.toUrl(`/pages/equipment/maintenance/detailMaintain?id=${row.id}`)
          return
        case 2:
          this.$utils.toUrl(`/pages/equipment/maintenance/detailWaitCheck?id=${row.id}`)
          return
        default:
          this.$utils.toUrl(`/pages/equipment/maintenance/detail?id=${row.id}`)
      }
      // this.$utils.toUrl(`/pages/equipment/list/detail?id=${row.id}`)
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
@import url('index.less');
</style>
