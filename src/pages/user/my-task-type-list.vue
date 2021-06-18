<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view v-if="list.length > 0" class="main-body">
        <view class="card">
          <view class="card-body">
            <template v-for="item in list">
              <view :key="item.id" class="item" @click="approvalTodo(item)">
                <uni-avatar :user="item" :size="80"></uni-avatar>
                <view class="messsage-info">
                  <view class="title">{{ item.title }}</view>
                  <view class="detail">{{ item.content }}</view>
                </view>
                <uni-badge v-if="item.count > 0" :text="item.count" type="error"></uni-badge>
                <view class="arrow-right"> </view>
              </view>
            </template>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="list.length === 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import uniBadge from '@/components/uni-badge/uni-badge.vue'
import { mapGetters } from 'vuex'
import api from './api'
import qs from 'qs'
export default {
  components: {
    uniBadge
  },
  data() {
    return {
      list: []
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
      api.queryInstanceActivitiTypeList().then(res => {
        this.list = res.data
      })
    },
    // 跳转到待办列表
    approvalTodo(item) {
      const query = qs.stringify({ processDefinitionKey: item.processDefinitionKey, name: item.title })
      this.$utils.toUrl('/pages/user/my-task?' + query)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./message.less');
</style>
