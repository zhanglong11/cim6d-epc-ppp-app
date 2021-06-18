<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view v-if="categoryList.length > 0 || approvalList.messageCount > 0" class="main-body">
        <view class="card">
          <view class="card-body">
            <!--            <view class="item" @click="approvalTodo()">-->
            <!--              <view class="message-type approval">审</view>-->
            <!--              <view class="messsage-info">-->
            <!--                <view class="title">待办</view>-->
            <!--                <view class="detail">{{ approvalList.tipMessage }}</view>-->
            <!--              </view>-->
            <!--              <uni-badge :text="approvalList.messageCount" type="error"></uni-badge>-->
            <!--              <view class="arrow-right"> </view>-->
            <!--            </view>-->
            <template v-for="item in categoryList">
              <view
                v-if="($appType !== 1 && item.cateGory !== 'working_procedure_manage') || $appType === 1"
                :key="item.cateGory"
                class="item"
                @click="handleCategoryItemClick(item)"
              >
                <uni-avatar :user="item" :size="80"></uni-avatar>
                <view class="messsage-info">
                  <view class="title">{{ item.cateGoryName }}</view>
                  <view class="detail">{{ item.tipMessage }}</view>
                </view>
                <uni-badge v-if="item.messageCount > 0" :text="item.messageCount" type="error"></uni-badge>
                <view class="arrow-right"> </view>
              </view>
            </template>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="categoryList.length === 0 && approvalList.messageCount == 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import uniBadge from '@/components/uni-badge/uni-badge.vue'
import { mapGetters } from 'vuex'
import { msgApi } from '@/api/message'
import { workFlowApi } from '@/api/work-flow'

export default {
  components: {
    uniBadge
  },
  data() {
    return {
      categoryList: [],
      approvalList: {
        messageCount: 0,
        tipMessage: ''
      } // 待办
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    userId() {
      return this.$store.state.user.userId
    }
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.handleQueryMsgCategoryList()
      if (this.$appType === 2) {
        this.getTaskTodo()
      }
    },
    //获取消息类型列表
    async handleQueryMsgCategoryList() {
      let result = await msgApi.queryMsgCategoryList(this.projectId)
      if (result.code === 200) {
        // this.categoryList = result.data || []
        this.categoryList = result.data.map(item => {
          return {
            ...item,
            name: item.cateGoryName
          }
        })
        // console.log(this.categoryList)
      }
    },
    //跳转至选中的类型的消息列表
    handleCategoryItemClick({ redirectUrl, cateGory }) {
      // this.$utils.toUrl(`${redirectUrl}?type=${cateGory}`)
      this.$utils.toUrl(`/pages/user/message-list?type=${cateGory}`)
    },
    // 获取我的待办
    async getTaskTodo() {
      let params = {
        sortField: 'createTime',
        sortValue: 'desc',
        taskStatus: 0,
        projectId: this.projectId || '',
        page: 1,
        rows: 1000
      }
      let result = await workFlowApi.queryTaskList(params)
      let datas = result.data
      if (!datas) {
        return
      }
      this.approvalList.messageCount = datas.total
      if (datas.total) {
        this.approvalList.tipMessage = datas.records[0].taskName
      }
    },
    // 跳转到待办列表
    approvalTodo() {
      this.$utils.toUrl('/pages/user/approval-todo')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./message.less');
</style>
