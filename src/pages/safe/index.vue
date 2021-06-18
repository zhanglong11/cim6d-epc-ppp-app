<template>
  <view class="main">
    <div class="tabs-wrap">
      <uni-tabs v-model="filterForm.inspectStatus">
        <uni-tab-pane :name="null" label="全部"></uni-tab-pane>
        <uni-tab-pane :name="1" label="合格"></uni-tab-pane>
        <uni-tab-pane :name="2" label="不合格"></uni-tab-pane>
      </uni-tabs>
    </div>
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.inspectTaskId" @click.native="handleInspectItemClick(item)">
            <view class="card-body">
              <view
                class="card-info"
                :class="{
                  special: item.planNature === 4,
                  commonly: item.planNature === 2,
                  linJian: item.planNature === 1
                }"
              >
                <!--
                  checkNature
                  1:临时检查 2：一般检查 3：阶段性检查 4：专业性检查
                 -->
                <view class="title">{{ item.planName }}</view>
                <view>检查性质：{{ $getLabel(planNatureList, item.planNature) }}</view>
                <view>安全检查类型：{{ $getLabel(safeCheckTypeList, item.planType) }}</view>
              </view>

              <block>
                <uni-status :options="rectifyStatusList" :value="item.rectifyStatus"></uni-status>
              </block>
            </view>
            <view class="card-footer  border-top">
              <text>检查人：{{ item.inspectPrincipalName }}</text>
              <text>检查日期： {{ item.planInspectTime | ymd }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAddInspectItem" />
    <EmptyTemplate v-if="total === 0" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">紧要程度</h6>
        <uni-checkbox-button-group v-model="drawerForm.emergencyLevel" :options="emergencyLevelList" />
        <h6 class="label">检查性质</h6>
        <uni-checkbox-button-group v-model="drawerForm.planNature" class="check-nature" :options="planNatureList" />
        <h6 class="label">参与人员</h6>
        <uni-select-user v-model="drawerForm.participantId" :mode="2" multiple></uni-select-user>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { inspectApi } from '@/api/inspect'
import rectifyStatusList from './lib/rectifyStatusList'
import planNatureList from './lib/planNatureList'
import emergencyLevelList from './lib/emergencyLevelList'
import safeCheckTypeList from './lib/safeCheckTypeList'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        planType: 2,
        page: 1,
        rows: 10,
        projectId: wx.getStorageSync('projectId')
      },
      drawerForm: {},
      rectifyStatusList,
      planNatureList,
      emergencyLevelList,
      safeCheckTypeList,
      loading: false,
      list: [],
      total: 0
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
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  methods: {
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      data.participantId = data.participantId ? data.participantId.split(',') : null
      this.fly.safety
        .post('inspect/list', data, { isLoading: true })
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
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
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
    handleAddInspectItem() {
      const itemList = [
        {
          name: '安全巡检',
          handler: () => {
            this.$utils.toUrl('/pages/safe/add?planNature=4')
          }
        },
        {
          name: '安全定点巡视',
          handler: () => {
            this.$utils.toUrl('/pages/safe/add?planType=3&planNature=5')
          }
        }
      ]
      uni.showActionSheet({
        itemList: itemList.map(e => e.name),
        success: ({ tapIndex }) => {
          itemList[tapIndex].handler()
        }
      })
    },
    handleInspectItemClick(row) {
      if (row.rectifyStatus === 0) {
        //未检查
        this.$utils.toUrl('/pages/safe/add?id=' + row.inspectTaskId)
      } else {
        this.$utils.toUrl(`/pages/safe/detail?id=${row.inspectTaskId}`)
      }
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
