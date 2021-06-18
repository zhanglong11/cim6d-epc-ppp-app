<template>
  <view class="main">
    <div class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm title="今日天气">
          <uni-form-item label="日期" prop="reportDate">
            <uni-date-picker v-model="form.reportDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="温度" prop="temp">
            <view style="display: flex; justify-content: flex-end; margin-right: -13px;">
              <input
                v-model.number="form.minimumTemperature"
                type="number"
                style="text-align: left;"
                class="temperature"
                placeholder="最低"
              />
              ℃ ~
              <input
                v-model.number="form.maximumTemperature"
                style="text-align: left;"
                type="number"
                class="temperature"
                placeholder="最高"
              />
              ℃
            </view>
          </uni-form-item>
          <uni-form-item label="风力" prop="remark">
            <input v-model="form.windPower" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="风向" prop="remark">
            <input v-model="form.windDirection" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="上午天气" prop="remark">
            <input v-model="form.morningWeather" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="下午天气" prop="remark">
            <input v-model="form.afternoonWeather" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件" prop="fileIds">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <uni-card isForm title="工作汇报">
          <uni-form-item
            label="监理人员动态"
            prop="supervisorPersonDynamic"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea v-model.trim="form.supervisorPersonDynamic" :maxlength="-1" placeholder="请输入" auto-height />
          </uni-form-item>
          <uni-form-item
            label="承包单位人员动态"
            prop="contractorDynamic"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea v-model.trim="form.contractorDynamic" :maxlength="-1" placeholder="请输入" auto-height />
          </uni-form-item>
          <uni-form-item
            label="承包单位机械使用情况"
            prop="contractorMachineDynamic"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.contractorMachineDynamic"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="材料进场情况"
            prop="materialEnterSituation"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.materialEnterSituation"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="材料使用情况动态"
            prop="materialUseDynamic"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.materialUseDynamic"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="质量检查、试验概要"
            prop="qualityCheckSummary"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.qualityCheckSummary"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="承包单位提出的问题"
            prop="contractorIssue"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.contractorIssue"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="对承包单位提出问题的答复"
            prop="contractorIssueReply"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.contractorIssueReply"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="来往函件记录"
            prop="correspondencesRecord"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.correspondencesRecord"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="主要会议、会谈、洽谈"
            prop="mainMeeting"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.mainMeeting"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="承包单位进行/完成的主要工作"
            prop="contractorMainWork"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.contractorMainWork"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="见证取样记录"
            prop="witnessSamplesRecord"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.witnessSamplesRecord"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="巡视/旁站/平行检验记录"
            prop="patrolInspectionRecord"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.patrolInspectionRecord"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="(工程部位、时间、存在问题、处理措施)"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="总监理工程师巡视纪要"
            prop="chiefSupervisoryPatrolSummary"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.chiefSupervisoryPatrolSummary"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
          </uni-form-item>
          <uni-form-item label="记事" prop="recordEvents" type="textarea" align="left" class="block-item">
            <textarea
              v-model.trim="form.recordEvents"
              style="height: 100px;"
              :maxlength="-1"
              placeholder="请输入"
              auto-height
            />
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
import Api from '@/pages/epcPpp/informationManage/api/supervisionDayLog'
export default {
  name: 'EpcPPPSupervisionDayLogAdd',
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        reportDate: [{ required: true, message: '日期不能为空' }]
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
  watch: {
    weatherInfo: {
      immediate: true,
      handler(val) {
        this.form.minimumTemperature = val.lowTemperature
        this.form.maximumTemperature = val.highTemperature
        this.form.windPower = val.windPower
        this.form.windDirection = val.windDirection
      }
    }
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.$utils.setTitle('编辑监理日志')
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
