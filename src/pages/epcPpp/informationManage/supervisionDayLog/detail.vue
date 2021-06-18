<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view>
          <view class="titleStatus">
            <h3>监理日志</h3>
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
            <uni-form-item class="file-item" label="附件" prop="fileIds">
              <uni-attachment v-model="info.fileIds"></uni-attachment>
            </uni-form-item>
          </uni-card>
          <uni-card isForm title="">
            <uni-form-item label="监理人员动态" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.supervisorPersonDynamic }}</view>
            </uni-form-item>
            <uni-form-item label="承包单位人员动态" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.contractorDynamic }}</view>
            </uni-form-item>
            <uni-form-item label="承包单位机械使用情况" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.contractorMachineDynamic }}</view>
            </uni-form-item>
            <uni-form-item label="材料进场情况" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.materialEnterSituation }}</view>
            </uni-form-item>
            <uni-form-item label="材料使用情况动态" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.materialUseDynamic }}</view>
            </uni-form-item>
            <uni-form-item label="质量检查、试验概要" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.qualityCheckSummary }}</view>
            </uni-form-item>
            <uni-form-item label="承包单位提出的问题" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.contractorIssue }}</view>
            </uni-form-item>
            <uni-form-item label="对承包单位提出问题的答复" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.contractorIssueReply }}</view>
            </uni-form-item>
            <uni-form-item label="来往函件记录" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.correspondencesRecord }}</view>
            </uni-form-item>
            <uni-form-item label="主要会议、会谈、洽谈" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.mainMeeting }}</view>
            </uni-form-item>
            <uni-form-item label="承包单位进行/完成的主要工作" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.contractorMainWork }}</view>
            </uni-form-item>
            <uni-form-item label="见证取样记录" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.witnessSamplesRecord }}</view>
            </uni-form-item>
            <uni-form-item label="巡视/旁站/平行检验记录" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.patrolInspectionRecord }}</view>
            </uni-form-item>
            <uni-form-item label="总监理工程师巡视纪要" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.chiefSupervisoryPatrolSummary }}</view>
            </uni-form-item>
            <uni-form-item label="记事" type="textarea" align="left" class="block-item">
              <view class="disabled">{{ info.recordEvents }}</view>
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
import Api from '@/pages/epcPpp/informationManage/api/supervisionDayLog'
import { mapGetters } from 'vuex'
import statusList from '@/pages/epcPpp/informationManage/lib/statusList'
export default {
  name: 'EpcPPPSupervisionDayLogDetail',
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
    this.$utils.toUrl(`/pages/epcPpp/informationManage/supervisionDayLog/add?id=${this.id}`)
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
