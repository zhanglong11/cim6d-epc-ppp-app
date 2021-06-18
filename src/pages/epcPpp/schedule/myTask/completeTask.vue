<template>
  <div class="main">
    <uni-form-custom>
      <uni-card>
        <uni-form-item label="进度任务名称" disabled>
          {{ taskName }}
        </uni-form-item>
        <uni-form-item label="计划开始时间" disabled>
          {{ form.planStartDate | ymd }}
        </uni-form-item>
        <uni-form-item label="计划结束时间" disabled>
          {{ form.planEndDate | ymd }}
        </uni-form-item>
        <uni-form-item label="实际开始时间" isRequired>
          <uni-date-picker v-model="form.actualStartDate" fields="day"></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="实际结束时间" isRequired>
          <uni-date-picker v-model="form.actualEndDate" fields="day"></uni-date-picker>
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button
          class="button"
          :disabled="isLoading || !form.actualEndDate || !form.actualStartDate"
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
  name: 'CompleteTask',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      taskId: null,
      form: {},
      isLoading: false,
      // 前面带有项目名的任务名称
      taskName: ''
    }
  },
  onLoad({ taskId, taskName }) {
    this.form.taskId = taskId
    this.taskName = taskName
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
      api.getScheduleTaskById(this.form.taskId).then(res => {
        res.data.actualStartDate = res.data.planStartDate
        res.data.actualEndDate = this.moment().format('YYYY-MM-DD HH:mm:ss')
        this.form = res.data
      })
    },
    // 提交
    async submit() {
      this.isLoading = true
      await api.confirmTask(this.form).finally(() => (this.isLoading = false))
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
