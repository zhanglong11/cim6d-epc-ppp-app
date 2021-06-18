<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div>
        <uni-card>
          <uni-form-item label="验收名称" isRequired>
            <textarea class="align-right disabledInput" :value="aaa" auto-height placeholder="点此输入内容" disabled />
          </uni-form-item>
          <uni-form-item label="验收类型" :border="false">
            <input v-model.trim="form.acceptanceTypeName" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="检验批编号" :border="false">
            <input v-model.trim="form.inspectionLotNumber" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="检验批名称" :border="false">
            <input v-model.trim="form.inspectionLotName" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="所属分项" :border="false">
            <input v-model.trim="form.engineeringName" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="检验批部位" :border="false">
            <input v-model.trim="form.inspectionLotPoint" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="检验批容量" :border="false">
            <input v-model.trim="form.inspectionLotCapacity" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="施工依据" :border="false">
            <input v-model.trim="form.constructionBases" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="验收依据" :border="false">
            <input v-model.trim="form.acceptanceSpecificationId" class="disabledInput" disabled />
          </uni-form-item>
        </uni-card>
        <div class="card-title">
          检验批明细
        </div>
        <div v-for="(item, index) of form.detailList" :key="'item' + index">
          <uni-card>
            <uni-form-item label="序号" :border="false">
              <div>{{ index + 1 }}</div>
            </uni-form-item>
            <uni-form-item label="验收项目" :border="false">
              <div>{{ item.acceptanceItem }}</div>
            </uni-form-item>
            <uni-form-item label="项目种类" :border="false">
              <div>{{ item.itemCategory === 1 ? '主控项目' : '一般项目' }}</div>
            </uni-form-item>
            <uni-form-item label="设计要求及规范" :border="false">
              <div>{{ item.designRequirements }}</div>
            </uni-form-item>
            <uni-form-item label="实际抽样量" isRequired>
              <input v-model="form.detailList[index].sampleNum" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="检查记录" isRequired>
              <textarea
                v-model="form.detailList[index].examineRecord"
                :maxlength="-1"
                auto-height
                placeholder="请输入"
              />
            </uni-form-item>
            <uni-form-item label="检查结果" isRequired>
              <uni-select v-model="form.detailList[index].examineResult" :options="resultList" />
            </uni-form-item>
          </uni-card>
        </div>
        <uni-card>
          <uni-form-item label="备注">
            <textarea v-model.trim="form.remark" :maxlength="-1" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="上传附件">
            <uni-attachment v-model="form.files" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </div>
      <view class="submit-button-wrapper">
        <button class="button" type="primary" :loading="loading" @click="submit">保存并提交</button>
      </view>
    </scroll-view>
  </div>
</template>

<script>
import Api from '@/api/quality/accept'
export default {
  name: 'Edit',
  data() {
    return {
      acceptId: '',
      form: { acceptanceType: 1, acceptanceTypeName: '检验批验收' },
      loading: false,
      resultList: [
        { label: '通过', value: 1 },
        { label: '没通过', value: 2 }
      ]
    }
  },
  onLoad(options) {
    this.acceptId = options.acceptId
  },
  computed: {
    aaa() {
      return this.form.acceptanceName + this.form.acceptanceApplyNumber
    }
  },
  created() {
    this.getDetail()
  },
  mounted() {},
  methods: {
    async getDetail() {
      this.loading = true
      let res = await Api.getAcceptanceDetail(this.acceptId)
      this.loading = false
      let detailList = (res.data.detailList || []).map(item => {
        item.examineResult = item.examineResult || ''
        item.examineRecord = item.examineRecord || ''
        item.sampleNum = item.sampleNum || ''
        return item
      })
      this.form = { ...this.form, ...res.data, detailList: detailList }
    },
    validForm() {
      let valid = true
      let examineResultNullLength = this.form.detailList.filter(item => item.examineResult === '').length
      if (examineResultNullLength > 0) {
        this.$utils.showToast('请选择是否通过')
        valid = false
      }
      let examineRecordNullLength = this.form.detailList.filter(item => item.examineRecord === '').length
      if (examineRecordNullLength > 0) {
        this.$utils.showToast('请输入检查记录')
        valid = false
      }
      let sampleNumNullLength = this.form.detailList.filter(item => item.sampleNum === 0).length
      if (sampleNumNullLength > 0) {
        this.$utils.showToast('请输入实际抽样量')
        valid = false
      }
      return valid
    },
    async submit() {
      let valid = this.validForm()
      let res
      if (valid) {
        res = await Api.saveAcceptance(this.form)
        //await Api.auditAcceptance(this.acceptId).catch(() => {})
      }
      if (res && res.code === 200) {
        this.$utils.showToast('保存成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 500)
      }
    },
    remove() {},
    change(a) {
      console.log(a)
    }
  }
}
</script>

<style scoped lang="less">
@import url('../danwei/detail.less');
</style>
