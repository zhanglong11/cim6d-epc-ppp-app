<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div>
        <uni-card>
          <uni-form-item label="验收名称" isRequired>
            <textarea :value="aaa" auto-height class="disabledInput align-right" disabled />
          </uni-form-item>
          <uni-form-item label="验收类型">
            <input v-model.trim="form.acceptanceTypeName" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="隐蔽项目">
            <input v-model.trim="form.hideProject" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="隐蔽部位">
            <textarea v-model.trim="form.hidePart" class="disabledInput align-right" auto-height />
          </uni-form-item>
          <uni-form-item label="隐蔽内容">
            <textarea v-model.trim="form.hideContent" class="disabledInput align-right" auto-height />
          </uni-form-item>
          <uni-form-item label="验收结果" isRequired>
            <uni-select v-model="form.hideResult" :options="resultList" />
          </uni-form-item>
        </uni-card>

        <uni-card>
          <uni-form-item label="备注">
            <textarea v-model.trim="form.remark" :maxlength="-1" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="附件">
            <uni-attachment v-model="form.files" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <view class="submit-button-wrapper">
          <button class="button" type="primary" :loading="loading" @click="submit">保存并提交</button>
        </view>
        <uni-card>
          <uni-form-item label="验收人">
            <view>{{ $store.state.user.userName }}</view>
          </uni-form-item>
          <uni-form-item label="验收日期">
            <view>{{ moment().format('YYYY-MM-DD') }}</view>
          </uni-form-item>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import Api from '@/api/quality/accept'
import moment from 'moment'
export default {
  name: 'Edit',
  data() {
    return {
      acceptId: '',
      form: { acceptanceType: 2, acceptanceTypeName: '隐蔽工程验收' },
      loading: false,
      moment,
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
      this.form = { ...this.form, ...res.data }
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
      //let valid = this.validForm()
      let valid = true
      let res
      if (valid) {
        res = await Api.saveAcceptance(this.form)
        // await Api.auditAcceptance(this.acceptId).catch(() => {})
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
