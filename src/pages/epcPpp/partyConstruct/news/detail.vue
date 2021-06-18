<template>
  <view class="main">
    <view class="main-body">
      <h3>{{ info.title }}</h3>
      <ul>
        <li>
          <span><uni-font-awesome type="fa fa-user-plus" color="#999" size="26"></uni-font-awesome></span
          >{{ info.creatorName }}
        </li>
        <li>
          <span><uni-font-awesome type="fa fa-eye" color="#999" size="26"></uni-font-awesome></span
          >{{ info.readingNum || 0 }}
        </li>
        <li>
          <span><uni-font-awesome type="fa fa-clock" color="#999" size="26"></uni-font-awesome></span
          >{{ info.createTime }}
        </li>
      </ul>
      <view class="imageContainer">
        <uni-preview-image :id="info.imageId"></uni-preview-image></view>
      <p class="content" v-html="info.content || '<p>无<\/p>'"></p>
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
      let res = await Api.getNewsDetail(this.id)
      this.info = { ...res.data }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../style/detail.less');
</style>
