<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body-details">
        <div v-if="saveTime" class="save-time no-padding">实时保存{{ saveTime }}</div>

        <uni-card>
          <uni-form-custom ref="form" :rules="rules" :model="form">
            <uni-form-item label="培训主题" prop="trainingTheme">
              <input v-model="form.trainingTheme" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="培训机构">
              <input v-model="form.trainingOrgan" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="培训讲师">
              <input v-model="form.lecturer" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="培训地址">
              <input v-model="form.address" />
            </uni-form-item>
            <uni-form-item label="培训开始时间">
              <uni-date-picker v-model="form.trainingTime" fields="minute"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="培训课时">
              <input v-model="form.trainingHour" placeholder="请输入" type="number" />
            </uni-form-item>
            <uni-form-item label="培训内容" type="textarea" align="left">
              <textarea v-model="form.trainingContent" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
            <uni-form-item label="参与培训的人员" isLink type="textarea" align="left">
              <uni-select-labour v-model="form.totalEmployee" multiple show-check-all />
            </uni-form-item>
            <uni-form-item label="合格人员" isLink type="textarea" align="left">
              <uni-select-labour
                v-model="form.qualifiedEmployee"
                multiple
                :canChooseUserIds="form.totalEmployee"
                show-check-all
              />
            </uni-form-item>
            <uni-form-item label="不合格人员" isLink type="textarea" align="left">
              <uni-select-labour
                v-model="form.unqualifiedEmployee"
                multiple
                :canChooseUserIds="form.totalEmployee"
                show-check-all
              />
            </uni-form-item>
          </uni-form-custom>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="submit()">保存</button>
        </view>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'SafetyAdd',
  data() {
    return {
      id: '',
      form: {
        projectId: uni.getStorageSync('projectId')
      },
      isLoading: false,
      rules: {
        trainingTheme: { required: true }
      }
    }
  },
  computed: {
    // 表单缓存
    formDataTemp() {
      return this.$store.state.addCache.addEducationCache
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.addCache.saveTime
    }
  },
  onLoad(option) {
    this.id = option.id
    if (this.id) {
      this.$utils.setTitle('编辑培训')
      this.refresh()
    } else {
      this.autoSave()
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.labourSafety.get('training/get/' + this.id).then(res => {
        this.form = res.data
      })
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('setAddEducationCache', this.form)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('clearCompanyTemp', 'addEducationCache')
    },
    async submit() {
      await this.$refs.form.validate()
      await this.fly.labourSafety.post('training/' + (this.id ? 'update' : 'add'), this.form).then()
      this.$utils.showToast('保存成功')
      this.clearCache()
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./safety.less');
</style>
