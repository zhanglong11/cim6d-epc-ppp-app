<template>
  <view class="main">
    <div class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <!-- 点位选择组件 start -->
          <uni-select-anchor :uUid="uUid" isAddAnchor isEidt anchorType="safe" @change="changeAnchor" />
          <!-- 点位选择组件 start -->
          <!--  <uni-form-item label="工程类别" prop="engineeringCategory" isLink>
            <uni-select
              v-model="form.engineeringCategory"
              :options="engineeringTypeList"
              placeholder="请选择工程类型"
            />
          </uni-form-item>-->
          <uni-form-item label="问题类型" prop="issueType" isLink>
            <uni-select v-model="form.issueType" :options="safetyQuestionTypeList" placeholder="请选择问题类型" />
          </uni-form-item>
          <uni-form-item label="问题描述" prop="description">
            <textarea v-model.trim="form.description" :maxlength="-1" placeholder="请输入问题描述" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="现场照片" prop="imageIds">
            <uni-attachment v-model="form.imageIds" uploadType="image" edit></uni-attachment>
          </uni-form-item>
          <uni-form-item
            label="整改要求"
            prop="rectificationRequirement"
            type="textarea"
            align="left"
            class="block-item"
          >
            <textarea
              v-model.trim="form.rectificationRequirement"
              :maxlength="-1"
              placeholder="请输入整改要求"
              auto-height
            />
          </uni-form-item>
          <uni-form-item label="整改期限" prop="rectificationDate">
            <uni-date-picker v-model="form.rectificationDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="责任人" isLink prop="pushPersonId">
            <uni-select-user v-model="form.pushPersonId" :name.sync="form.pushPersonName" placeholder="请选择责任人" />
          </uni-form-item>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleSubmit">提交</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import Api from '@/pages/epcPpp/safety/api'
export default {
  name: 'EpcPPPSafetyIssueAdd',
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        locationName: '',
        locationId: '',
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        locationName: { required: true },
        engineeringCategory: { required: true },
        issueType: { required: true },
        description: { required: true },
        imageIds: { required: true },
        rectificationDate: { required: true },
        pushPersonId: { required: true }
      },
      uUid: this.$utils.getUuid() || '' // 接收选择的构件或其他服务使用
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    //工程类型
    /*engineeringTypeList() {
      return (
        this.$getArgList('epcPPPEngineeringType') || [
          { value: 1, label: '混凝土工程' },
          { value: 2, label: '模板工程' },
          { value: 3, label: '钢筋工程' },
          { value: 4, label: '砌体工程' },
          { value: 5, label: '防水工程1' }
        ]
      )
    },*/
    //问题类型
    safetyQuestionTypeList() {
      return this.$getArgList('epcPPPSafetyIssueType')
    },
    // 选择的构件
    selectGuid() {
      return this.$store.state.bim.selectGuid
    }
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {},
  methods: {
    // 选择问题部位回传事件
    changeAnchor(obj) {
      this.form.modelId = obj.modelId
      this.form.viewId = obj.viewId
      this.form.locationId = obj.id
      this.form.locationName = obj.locationName
    },
    async getDetail() {
      let res = await Api.getDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
    },
    // 点击保存按钮
    async handleSubmit() {
      let guidArray = _.map(this.selectGuid, 'guid')
      let posArray = _.map(this.selectGuid, 'pos')
      this.form.componentIds = guidArray
      this.form.componentPos = posArray
      if (!this.form.locationId) {
        this.$utils.showToast('请选择问题部位')
        return
      }
      if (guidArray.length === 0) {
        this.$utils.showToast('请先在BIM选择问题构件')
        return
      }
      // 开启表单验证
      await this.$refs.form.validate()
      let bimBindParam = {
        modelName: '',
        projectId: this.projectId,
        safetyIssueId: this.id || ''
      }
      let params = {
        ...this.form,
        saveDTO: bimBindParam,
        rectificationDate: moment(this.form.rectificationDate).format('YYYY-MM-DD 00:00:00')
      }
      this.isLoading = true
      await Api.add(params).finally(() => (this.isLoading = false))
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
@import url('./add.less');
</style>
