<template>
  <view class="main">
    <view class="main-body">
      <view class="card">
        <uni-form-item label="活动预告标题">
          <view class="disabled">{{ info.title }}</view>
        </uni-form-item>
        <uni-form-item label="活动时间">
          <view class="disabled">{{ info.startTime }}~{{ info.endTime }}</view>
        </uni-form-item>
        <uni-form-item label="活动内容">
          <view class="disabled">{{ info.content }}</view>
        </uni-form-item>
        <uni-form-item label="活动地点">
          <view class="disabled">{{ info.address }}</view>
        </uni-form-item>
        <uni-form-item label="活动参与人">
          <view class="disabled">{{ info.participantNames }}</view>
        </uni-form-item>
        <uni-form-item label="活动状态">
          <view class="disabled">{{ info.statusName }}</view>
        </uni-form-item>
        <uni-form-item label="创建人">
          <view class="disabled">{{ info.creatorName }}</view>
        </uni-form-item>
        <uni-form-item label="创建时间">
          <view class="disabled">{{ info.createTime }}</view>
        </uni-form-item>
      </view>
    </view>
  </view>
</template>

<script>
import Api from '@/pages/epcPpp/partyConstruct/api'
import { mapGetters } from 'vuex'
export default {
  name: 'EpcPPPPartyConstructActivityPreviewDetail',
  components: {},
  data() {
    return {
      info: {},
      id: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id
    this.init()
  },
  onShow() {},
  mounted() {},
  methods: {
    //初始化页面参数
    init() {
      this.getDetail()
    },
    //获取详情
    async getDetail() {
      let res = await Api.getActivityDetail(this.id)
      this.info = { ...res.data }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../style/detail.less');
</style>
