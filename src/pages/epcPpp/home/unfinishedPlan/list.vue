<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block v-for="items in list" :key="items.planStartDate">
          <view class="title flex-item">计划开始时间：{{ items.planStartDate | formatData }}</view>
          <uni-card v-for="item in items.baseList" :key="item.taskId" class="receive-body">
            <view class="card-info">
              <view class="receivedContent">
                <view class="flex-item">
                  <view :class="{ 'is-delay': items.isDelay === 1 }">{{ item.taskName }}</view>
                </view>
                <view v-if="item.status === 1" class="received">
                  <view class="flex-item-label">已领取，领取人：{{ item.receivePersonName }}</view>
                </view>
              </view>
              <view>
                <p v-if="item.status === 1"><span class="circle" style="background: #ccc"></span>已领取</p>
                <button v-else type="primary" size="mini" class="receiveBtn" @click="receive(item)">领取</button>
              </view>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">进度文件名称</h6>
        <uni-checkbox-button-group v-model="filterForm.keyWord" :options="scheduleName" />
        <h6 class="label">选择日期</h6>
        <uni-date-picker
          v-model="filterForm.date"
          fields="day"
          placeholder="点击选择"
          valueFormat="YYYY-MM-DD hh:mm:ss"
          mode="range"
        ></uni-date-picker>
        <!--        <uni-date-picker-->
        <!--          v-model="filterForm.startDate"-->
        <!--          fields="day"-->
        <!--          mode="date"-->
        <!--          placeholder="请选择开始时间"-->
        <!--          valueFormat="YYYY-MM-DD hh:mm:ss"-->
        <!--          class="dataList"-->
        <!--        ></uni-date-picker>-->
        <!--        <uni-date-picker-->
        <!--          v-model="filterForm.endDate"-->
        <!--          placeholder="请选择结束时间"-->
        <!--          fields="day"-->
        <!--          mode="date"-->
        <!--          class="dataList"-->
        <!--        ></uni-date-picker>-->
      </div>
    </uni-drawer-custom>

    <uni-popup ref="popup" type="center">
      <uni-popup-dialog type="warn" :duration="2000" title="温馨提示" @confirm="confirmReceive">
        <view style="padding: 15px">
          您确定领取 <span style="font-weight: 600">“ {{ dialogContent }} ” </span> 进度任务吗？
          <view style="font-size: 12px; color: red">一旦领取将无法撤销，且别人也将无法领取该 任务，请慎重！</view>
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { homeApi } from '../api'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import _ from 'lodash'
export default {
  components: {
    uniPopupDialog
  },
  data() {
    return {
      filterForm: {
        startDate: '',
        endDate: '',
        keyWord: '',
        page: 1,
        rows: 10,
        status: '',
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      dialogContent: '',
      drawerForm: {},
      taskId: '',
      scheduleName: []
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
    // 查询未完成进度计划
    refresh: _.debounce(async function (type) {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      homeApi.queryScheduleUnfinishedTaskList(data).then(res => {
        let list = res.data || []
        if (list.length) {
          let scheduleName = list
            .map(item => {
              return item.baseList.map(item => {
                return {
                  label: item.scheduleFileName,
                  value: item.scheduleFileName
                }
              })
            })
            .reduce((prev, next) => {
              return prev.concat(next)
            })
          if (!type) {
            this.scheduleName = _.uniqBy(scheduleName, 'label')
          }
        }
        this.list = list
        console.log(1111, type, list, this.scheduleName)
        this.total = res.data.length
      })
    }, 100),

    // 领取
    receive(item) {
      this.$refs.popup.open()
      this.dialogContent = item.taskName
      this.taskId = item.taskId
    },
    //领取任务弹窗
    async confirmReceive() {
      await this.getScheduleTaskReceive(this.taskId)
      this.$refs.popup.close()
    },
    // 领取任务
    async getScheduleTaskReceive(taskId) {
      if (!taskId) {
        return
      }
      await homeApi.getScheduleTaskReceive(taskId)
      this.$utils.showToast('领取成功')
      this.$emit('taskReceive')
      this.init()
    },

    // 初始化
    init(type = false) {
      this.filterForm.page = 1
      this.list = []
      this.refresh(type)
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.keyWord = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyWord = ''
      this.init()
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },

    //筛选功能
    handleDrawerFormChange() {
      // this.filterForm = this.drawerForm
      if (this.filterForm.date) {
        this.filterForm.startDate = this.filterForm.date?.[0] + ' 00:00:00'
        this.filterForm.endDate = this.filterForm.date?.[1] + ' 23:59:59'
      }
      this.init(true)
    },
    // 筛选重置
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../styles/list.less');
@import url('list.less');
</style>
