<template>
  <view class="main">
    <div class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm title="今日天气">
          <uni-form-item label="日期" prop="reportDate">
            <uni-date-picker v-model="form.reportDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="温度" prop="maximumTemperature">
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
          <uni-form-item label="形象进度" prop="visualSchedule" type="textarea" align="left" class="block-item">
            <textarea v-model.trim="form.visualSchedule" :maxlength="-1" placeholder="请输入形象进度" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件" prop="fileIds">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <uni-card isForm title="工作汇报">
          <uni-form-item
            label="生产情况记录"
            prop="productionSituationRecord"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.productionSituationRecord"
              :maxlength="-1"
              placeholder="(部位、项目、机械作业、班组工作，生产存在问题等)"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="技术质量安全工作记录"
            prop="qualitySafetyRecord"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.qualitySafetyRecord"
              :maxlength="-1"
              placeholder="(技术质量安全活动，技术质量安全问题，检查评定验收等)"
              auto-height
            />
          </uni-form-item>
          <uni-form-item
            label="材料、构配件进场记录"
            prop="materialEnterRecord"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.materialEnterRecord"
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
import Api from '@/pages/epcPpp/informationManage/api/constructionDayLog'
export default {
  name: 'EpcPPPConstructionDayLogAdd',
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        reportDate: [{ required: true, message: '日期不能为空' }]
        //maximumTemperature: [{ required: true, message: '温度不能为空' }],
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
      this.$utils.setTitle('编辑施工日志')
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
