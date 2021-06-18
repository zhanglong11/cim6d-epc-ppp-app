<template>
  <view class="main">
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <view v-for="item in list" :key="item.messageId" class="card">
          <view class="card-body" @click="toDetails(item)">
            <view class="item">
              <view class="messsage-info">
                <view class="title">
                  <view class="icon icon-msg"> </view>
                  <span>{{ item.taskName }}</span>
                </view>
                <view class="time">
                  <view class="icon icon-clock"> </view>
                  {{ item.createTime | formatDataTime }}
                </view>
              </view>
              <view class="icon-mark" :class="[item.readFlag == 2 ? 'unread-icon' : '']"> </view>
            </view>
          </view>
        </view>
        <uni-more :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="list.length === 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { msgApi } from '@/api/message'
import api from './api'

export default {
  data() {
    return {
      category: '',
      list: [],
      total: 0,
      loading: false,
      formData: {
        sortField: 'createTime',
        sortValue: 'desc',
        taskStatus: 0,
        projectId: this.projectId || '',
        page: 1,
        rows: 10
      }
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    // 待办跳转定义
    taskTodoPower() {
      return this.$store.state.userPower.taskTodoPower
    }
  },
  onShow() {
    this.init()
  },
  onLoad(options) {
    this.$utils.setTitle(options.name + '待审核')
    this.formData.processDefinitionKey = options.processDefinitionKey
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.formData.page = 1
      this.list = []
      this.getTaskTodo()
    },
    // 获取我的待办
    async getTaskTodo() {
      let result = await api.queryTaskList(this.formData)
      let datas = result.data
      let list = datas.records || []
      this.total = datas.total
      this.list.push(...list)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.formData.page++
      this.getTaskTodo()
    },
    // 跳转详情
    toDetails(item) {
      const targetRouter = this.$store.state.userPower.approvalRouter[item.processDefinitionKey]
      const url = _.get(targetRouter, 'appRouteUrl')
      if (!url) {
        this.$utils.showToast('功能开发中，敬请期待!')
        return false
      } else {
        this.$utils.toUrl(`${url}?id=${item.targetId}`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./message-list.less');
</style>
