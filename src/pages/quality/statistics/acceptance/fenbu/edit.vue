<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div>
        <uni-card>
          <uni-form-item label="验收名称" isRequired>
            <textarea class="disabledInput align-right" :value="aaa" auto-height disabled />
          </uni-form-item>
          <uni-form-item label="验收类型" :border="false">
            <input v-model.trim="form.acceptanceTypeName" class="disabledInput" disabled />
          </uni-form-item>
          <uni-form-item label="分部编号" :border="false">
            <div>{{ form.engineeringNumber }}</div>
          </uni-form-item>
          <uni-form-item label="分部名称" :border="false">
            <div>{{ form.engineeringName }}</div>
          </uni-form-item>
          <uni-form-item label="分部数量" :border="false">
            <div>{{ form.targetList.length || 0 }}</div>
          </uni-form-item>
        </uni-card>
        <div class="card-title">
          分部明细
        </div>
        <div v-for="(item, index) of form.targetList" :key="'item' + index">
          <uni-card>
            <uni-form-item label="序号" :border="false">
              <div>{{ index + 1 }}</div>
            </uni-form-item>
            <uni-form-item label="分部名称" :border="false">
              <div>{{ item.engineeringName }}</div>
            </uni-form-item>
            <uni-form-item label="检验批数量" :border="false">
              <div>{{ item.acceptanceNum }}</div>
            </uni-form-item>
            <uni-form-item label="检查结果" isRequired>
              <uni-select v-model="form.targetList[index].examineResult" :options="resultList" />
            </uni-form-item>
          </uni-card>
        </div>
        <uni-card>
          <uni-form-item label="备注">
            <textarea v-model.trim="form.remark" :maxlength="-1" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="附件">
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
      form: { acceptanceType: 4, acceptanceTypeName: '分部工程验收', targetList: [] },
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
      let targetList = (res.data.targetList || []).map(item => {
        item.examineResult = item.examineResult || ''
        return item
      })
      /* let targetList = [
        {
          qualityTargetDecomposeId: '123',
          engineeringName: '测试1',
          acceptanceNum: 200,
          examineResult: ''
        }
      ]*/
      this.form = { ...this.form, ...res.data, targetList: targetList }
    },
    validForm() {
      let valid = true
      let examineResultNullLength = this.form.targetList.filter(item => item.examineResult === '').length
      if (examineResultNullLength > 0) {
        this.$utils.showToast('请选择是否通过')
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
