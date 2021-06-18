<template>
  <view class="main">
    <scroll-view v-if="list.length > 0" class="scroll-roll" scroll-y>
      <view class="main-body">
        <view v-for="item in list" :key="item.messageId" class="card">
          <view class="card-body" @click="toDetails(item)">
            <view class="item">
              <view class="messsage-info">
                <view class="title">
                  <view class="icon icon-msg"> </view>
                  <span :class="item.status === 1 ? 'gray' : ''">{{ item.title }}</span>
                </view>
                <view class="time">
                  <view class="icon icon-clock"> </view>
                  {{ item.createTime | formatDataTime }}
                </view>
              </view>
              <view class="icon-mark " :class="[item.readFlag == 2 ? 'unread-icon' : '']"> </view>
            </view>
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
import { mapGetters } from 'vuex'
import { msgApi } from '@/api/message'
import type from '@/pages/user/setting-items/lib/manageList'
import qualityType from '@/pages/user/setting-items/lib/qualityType'

export default {
  data() {
    return {
      category: '',
      qualityType,
      list: []
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    // 消息类型缓存
    messageTypes() {
      return this.$store.state.project.messageTypes
    }
  },
  onLoad(options) {
    this.category = options.type
  },
  onShow() {
    this.list = []
    this.handleQueryMsgList()
    this.refresh()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.list = []
    this.handleQueryMsgList()
  },
  methods: {
    refresh() {
      // let label = _.find(type, item => {
      //   return item.cateGory === this.category
      // })
      let matchedItem = _.find(type, item => {
        return item.cateGory.includes(this.category)
      })
      if (matchedItem) {
        this.$utils.setTitle(matchedItem.title)
      } else {
        this.$utils.setTitle('消息')
      }
    },
    // 加载消息列表
    async handleQueryMsgList() {
      let params = {
        cateogry: this.category,
        projectId: this.projectId
      }
      let result = await msgApi.queryMsgList(params)
      if (result.code === 200) {
        this.list = result.data.records || []
      }
    },
    // 跳转详情
    async toDetails(item) {
      let routerUrl = this.messageTypes[item.subModules]
      if (!routerUrl) {
        this.$utils.showToast('APP无详情页，请到PC端查看!')
        return
      }
      await this.fly.system.get(`/common/message/read/${item.id}`)
      if (routerUrl === '/quality/statistics/details') {
        this.fly.safety
          .post(`/quality/acceptanceApply/page`, { projectId: uni.getStorageSync('projectId') })
          .then(res => {
            let currentData = _.find(res.data.records, item => item.id === item.extension)
            let currentUrl = this.qualityType[currentData.acceptanceType - 1].url
            this.$utils.toUrl(`/pages/quality/statistics/acceptance/${currentUrl}/detail?id=${item.extension}`)
          })
      }
      this.$utils.toUrl(`${routerUrl}?id=${item.extension}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./message-list.less');
.gray {
  color: #999;
}
</style>
