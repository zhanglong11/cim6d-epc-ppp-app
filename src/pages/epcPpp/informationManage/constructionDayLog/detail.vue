<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view>
          <view class="titleStatus">
            <h3>施工日志</h3>
            <view class="statusBox"> <uni-status :options="statusList" :value="info.status"></uni-status></view>
          </view>
          <uni-card isForm title="">
            <uni-form-item label="创建人">
              <view class="disabled">{{ info.creatorName }}</view>
            </uni-form-item>
            <uni-form-item label="创建时间">
              <view class="disabled">{{ info.createTime }}</view>
            </uni-form-item>
          </uni-card>
          <uni-card isForm title="">
            <uni-form-item label="日期">
              <view class="disabled">{{ info.reportDate | ymd }}</view>
            </uni-form-item>
            <uni-form-item label="温度">
              <view class="disabled">{{ info.minimumTemperature }}℃~{{ info.maximumTemperature }}℃</view>
            </uni-form-item>
            <uni-form-item label="风力">
              <view class="disabled">{{ info.windPower }}</view>
            </uni-form-item>
            <uni-form-item label="风向">
              <view class="disabled">{{ info.windDirection }}</view>
            </uni-form-item>
            <uni-form-item label="上午天气">
              <view class="disabled">{{ info.morningWeather }}</view>
            </uni-form-item>
            <uni-form-item label="下午天气">
              <view class="disabled">{{ info.afternoonWeather }}</view>
            </uni-form-item>
            <uni-form-item label="形象进度">
              <view class="disabled">{{ info.rectificationRequirement }}</view>
            </uni-form-item>
            <uni-form-item class="file-item" label="附件" prop="fileIds">
              <uni-attachment v-model="info.fileIds"></uni-attachment>
            </uni-form-item>
          </uni-card>
          <uni-card isForm title="">
            <uni-form-item label="生产情况记录" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.productionSituationRecord }}</view>
            </uni-form-item>
            <uni-form-item label="技术质量安全工作记录" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.qualitySafetyRecord }}</view>
            </uni-form-item>
            <uni-form-item label="材料、构配件进场记录" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.materialEnterRecord }}</view>
            </uni-form-item>
          </uni-card>
        </view>
        <view v-if="info.status === 0" class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading">
            删除
          </button>
        </view>
        <!-- 审批记录 start -->
        <uni-check-detail :id="id"></uni-check-detail>
        <!-- 审批记录 end -->
        <!-- 通用审批 start -->
        <uni-check-card :id="id" ref="checkCard" />
        <!-- 通用审批 end -->
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Api from '@/pages/epcPpp/informationManage/api/constructionDayLog'
import { mapGetters } from 'vuex'
import statusList from '@/pages/epcPpp/informationManage/lib/statusList'
export default {
  name: 'EpcPPPConstructionDayLogDetail',
  components: {},
  data() {
    return {
      statusList,
      info: {},
      id: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  //草稿是跳转到编辑页面
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(`/pages/epcPpp/informationManage/constructionDayLog/add?id=${this.id}`)
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
      let res = await Api.getDetail(this.id)
      this.info = { ...res.data }
      if (res.data.status !== 0) {
        this.$utils.setNavButton(0, {
          text: '',
          fontSize: 0
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../detail.less');
</style>
