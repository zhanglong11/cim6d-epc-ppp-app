<template>
  <div class="main">
    <uni-form-custom ref="form" :model="form" :rules="rules">
      <uni-card>
        <uni-form-item label="通知公告标题" prop="title">
          <textarea v-model.trim="form.title" :maxlength="-1" placeholder="点击输入内容" auto-height />
        </uni-form-item>
        <uni-form-item label="内容" prop="content">
          <textarea v-model.trim="form.content" :maxlength="-1" placeholder="点击输入内容" auto-height />
        </uni-form-item>
        <uni-form-item :border="false" label="接收人" isLink prop="personList">
          <uni-select-user
            :id.sync="receiverIds"
            :value="receiverIds"
            :name.sync="receiverNames"
            value-format="object"
            multiple
          ></uni-select-user>
        </uni-form-item>
        <uni-form-item class="file-item" label="附件" prop="fileIds">
          <uni-attachment v-model="form.fileIds" edit></uni-attachment>
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button class="button" :disabled="isLoading" type="primary" @click="submit">提交</button>
      </view>
    </uni-form-custom>
  </div>
</template>

<script>
import api from './api'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      id: '',
      form: {
        projectId: uni.getStorageSync('projectId'),
        type: 2,
        fileIds: ''
      },
      receiverIds: '',
      receiverNames: '',
      isLoading: false,
      rules: {
        title: { required: true },
        content: { required: true },
        personList: { required: true },
        fileIds: { required: true }
      }
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.id && this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      api.getDetailsNotice(this.id).then(res => {
        this.form = res.data
        this.receiverIds = res.data.personList.map(({ personId }) => personId)
      })
    },
    async submit() {
      if (this.receiverIds) {
        this.form.personList = _.zip(this.receiverIds.split(','), this.receiverNames.split(',')).map(
          ([personId, personName]) => ({
            personId,
            personName
          })
        )
      }
      await this.$refs.form.validate()
      this.isLoading = true
      await api.addNotice(this.form).finally(() => (this.isLoading = false))
      this.$utils.showToast('创建成功')
      this.$utils.goBack()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.main {
  padding-top: 10px;
}
.uni-card {
  width: 700px;
}
</style>
