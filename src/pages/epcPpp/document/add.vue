<template>
  <div class="main">
    <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
      <uni-card isForm>
        <uni-form-item label="文件名称" prop="name">
          <input v-model.trim="form.name" placeholder="请输入" />
        </uni-form-item>
        <uni-form-item v-if="level !== 1" label="上传附件" prop="fileIds">
          <uni-attachment v-model="form.fileIds" edit />
        </uni-form-item>
      </uni-card>
    </uni-form-custom>
    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="submit">保存</button>
    </view>
  </div>
</template>

<script>
import Api from './api'
export default {
  name: 'add',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: { name: { required: true }, fileIds: { required: true } },
      isLoading: false,
      pid: 0,
      level: 1,
      type: 1,
      activeType: 1
    }
  },
  // 生命周期 - 挂载完成
  created() {
    if (this.isEdit) {
      this.refresh()
    }
  },
  onLoad(options) {
    const { level = 1, pid = 0, activeType = 1, isEdit, id, firstLevelId } = options
    this.level = level - 0
    this.pid = pid
    this.activeType = activeType - 0
    this.isEdit = isEdit
    this.id = id
    this.firstLevelId = firstLevelId
  },

  // 方法集合
  methods: {
    //刷新
    async refresh() {
      console.log(this.id)
      const res = await Api.detail(this.id)
      this.form = res.data
    },
    async submit() {
      await this.$refs.form.validate()
      this.isLoading = true
      const type = this.level === 1 ? 1 : 2
      if (this.isEdit) {
        await Api.update({ ...this.form, ...{ id: this.id } })
      } else {
        await Api.add({
          ...this.form,
          pid: this.pid,
          level: this.level,
          category: this.activeType,
          type,
          firstLevelId: this.firstLevelId
        })
      }
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.$utils.goBack()
        this.isLoading = false
      }, 500)
    }
  }
}
</script>

<style scoped></style>
