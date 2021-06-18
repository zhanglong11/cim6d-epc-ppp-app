<template>
  <view class="main">
    <div class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm title="基本信息">
          <uni-form-item label="周报期号" prop="periodName">
            <input v-model="form.periodName" placeholder="请输入周报期号" />
          </uni-form-item>
          <uni-form-item label="报告开始时间" prop="startDate">
            <uni-date-picker v-model="form.startDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="报告结束时间" prop="endDate">
            <uni-date-picker v-model="form.endDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="编制" isLink prop="authorIds">
            <uni-select-user v-model="form.authorIds" multiple :name.sync="form.authorNames" placeholder="请选择编制" />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件" prop="fileIds">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
          <!-- <uni-form-item label="审核人" isLink prop="auditorId">
            <uni-select-user
              v-model="form.auditorId"
              :name.sync="form.auditorName"
              placeholder="请选择审核人"
            />
          </uni-form-item>
          <uni-form-item label="报告日期" prop="reportDate" isLink>
            <uni-date-picker v-model="form.reportDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>-->
        </uni-card>
        <uni-card isForm title="工作汇报">
          <uni-form-item
            label="上周工作完成情况"
            prop="workFinishSituation"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea v-model.trim="form.workFinishSituation" :maxlength="-1" placeholder="请输入内容" auto-height />
          </uni-form-item>
          <uni-form-item label="下周工作计划" prop="nextWorkPlan" type="textarea" align="left" class="block-item">
            <textarea v-model.trim="form.nextWorkPlan" :maxlength="-1" placeholder="请输入内容" auto-height />
          </uni-form-item>
          <uni-form-item label="工程质量情况" prop="qualitySituation" type="textarea" align="left" class="block-item">
            <textarea
              v-model.trim="form.qualitySituation"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="工程安全文明情况"
            prop="securityCivilization"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.securityCivilization"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item class="file-item" label="现场形象进度图片" prop="visualScheduleImageIds">
            <uni-attachment v-model="form.visualScheduleImageIds" uploadType="image" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleSubmit(true)">提交</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import Api from '@/pages/epcPpp/informationManage/api/supervisionWeekLog'
export default {
  name: 'EpcPPPSupervisionWeekLogAdd',
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        periodName: [{ required: true, message: '周报期号不能为空' }],
        startDate: [{ required: true, message: '报告开始时间不能为空' }],
        endDate: [{ required: true, message: '报告结束时间不能为空' }],
        authorNames: [{ required: true, message: '编制不能为空' }],
        workFinishSituation: [{ required: true, message: '上周工作完成情况不能为空' }],
        nextWorkPlan: [{ required: true, message: '下周工作计划不能为空' }],
        qualitySituation: [{ required: true, message: '工程质量情况不能为空' }],
        securityCivilization: [{ required: true, message: '工程安全文明情况不能为空' }],
        visualScheduleImageIds: [{ required: true, message: '现场形象进度图片不能为空' }]
      }
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    //天气
    weatherInfo() {
      return this.$store.state.project.weatherInfo
    }
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.$utils.setTitle('编辑监理周报')
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    this.handleSubmit(false)
  },
  methods: {
    async getDetail() {
      let res = await Api.getDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
    },
    // 点击保存按钮
    async handleSubmit(isSubmit = false) {
      await this.$refs.form.validate()
      let params = {
        ...this.form,
        reportDate: moment(this.form.reportDate).format('YYYY-MM-DD 00:00:00')
      }
      this.isLoading = true
      if (isSubmit) {
        await Api.submit(params).finally(() => (this.isLoading = false))
      } else {
        await Api.add(params).finally(() => (this.isLoading = false))
      }
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.isLoading = true
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../add.less');
.block-item {
  min-height: 250rpx;
}
/deep/ .uni-textarea-placeholder {
  overflow: inherit;
}
.temperature {
  margin: 0 20rpx;
  width: 80rpx;
}
</style>
