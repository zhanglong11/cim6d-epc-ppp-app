<template>
  <div class="main">
    <uni-form-custom>
      <uni-card>
        <uni-form-item label="提前时长(天)" isRequired>
          <input
            v-model.trim="form.changeDays"
            type="number"
            height="200"
            :maxlength="-1"
            placeholder="点击输入内容"
            auto-height
          />
        </uni-form-item>
        <uni-form-item label="提前原因" isRequired>
          <textarea v-model.trim="form.changeReason" :maxlength="-1" placeholder="点击输入内容" auto-height />
        </uni-form-item>
      </uni-card>
      <uni-card title="关联进度">
        <view slot="title" style="font-size: 14px"
          >共计<span style="color: red">{{ linkList.length }}</span
          >个关联进度</view
        >
        <uni-form-item v-for="e in linkList" :key="e.taskUniqueId" :label="e.taskName"></uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button
          class="button"
          :disabled="isLoading || !form.changeDays || !form.changeReason"
          type="primary"
          @click="submit"
        >
          提交
        </button>
      </view>
    </uni-form-custom>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'AdvanceAllLinkTask',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      taskId: null,
      form: {
        type: 1
      },
      isLoading: false,
      linkList: []
    }
  },
  onLoad({ taskId }) {
    this.form.taskId = taskId
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      api.queryTaskLink(this.form.taskId).then(res => {
        this.linkList = res.data
        this.form.relatedTaskUniqueIdList = _.map(res.data, 'taskUniqueId')
      })
    },
    // 提交
    async submit() {
      this.isLoading = true
      await api.changeDurationTask(this.form).finally(() => (this.isLoading = false))
      this.$utils.showToast('提交成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
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
