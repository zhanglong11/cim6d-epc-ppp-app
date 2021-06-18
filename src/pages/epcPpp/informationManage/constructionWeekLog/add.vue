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
            label="施工进度情况"
            prop="constructionScheduleSituation"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.constructionScheduleSituation"
              :maxlength="-1"
              placeholder="请输入内容"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="下周施工计划"
            prop="nextConstructionPlan"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea v-model.trim="form.nextConstructionPlan" :maxlength="-1" placeholder="请输入内容" auto-height />
          </uni-form-item>
          <uni-form-item label="重大事项" prop="majorEvents" type="textarea" align="left" class="block-item">
            <textarea
              v-model.trim="form.majorEvents"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="质量问题及建议"
            prop="qualityIssueSuggest"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.qualityIssueSuggest"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="现场安全生产工作检查记录"
            prop="safetyCheckRecord"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.safetyCheckRecord"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="现阶段危险源识别清单"
            prop="hazardSourceItem"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.hazardSourceItem"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="现场安全隐患整改落实情况"
            prop="safetyRectifySituation"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.safetyRectifySituation"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="疫情防控情况"
            prop="epidemicPreventionControl"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.epidemicPreventionControl"
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
import Api from '@/pages/epcPpp/informationManage/api/constructionWeekLog'
export default {
  name: 'EpcPPPConstructionWeekLogAdd',
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
        constructionScheduleSituation: [{ required: true, message: '施工进度情况不能为空' }],
        nextConstructionPlan: [{ required: true, message: '下周施工计划不能为空' }],
        qualityIssueSuggest: [{ required: true, message: '质量问题及建议不能为空' }],
        safetyCheckRecord: [{ required: true, message: '现场安全生产工作检查记录不能为空' }],
        hazardSourceItem: [{ required: true, message: '现阶段危险源识别清单不能为空' }],
        safetyRectifySituation: [{ required: true, message: '现场安全隐患整改落实情况不能为空' }],
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
      this.$utils.setTitle('编辑施工周报')
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
