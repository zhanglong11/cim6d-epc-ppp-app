<template>
  <div class="main">
    <uni-form-custom>
      <uni-card>
        <uni-form-item label="任务名称" disabled>
          {{ form.taskName }}
        </uni-form-item>
        <uni-form-item label="计划时间" disabled>
          {{ moment(form.planStartDate).format('YYYYMMDD') }}
          -
          {{ moment(form.planEndDate).format('YYYYMMDD') }}
        </uni-form-item>
        <uni-form-item label="分配人" isRequired>
          <uni-select-user
            v-model="form.beDistributionPersonId"
            isLink
            :name.sync="form.beDistributionPersonName"
            :companyId.sync="form.beDistributionPersonCompanyId"
            :multiple="false"
          ></uni-select-user>
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button class="button" :disabled="isLoading || !form.beDistributionPersonId" type="primary" @click="submit">
          提交
        </button>
      </view>
    </uni-form-custom>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'Assign',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      taskId: null,
      form: {},
      isLoading: false
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
      api.getScheduleTaskById(this.form.taskId).then(res => {
        this.form = res.data
      })
    },
    // 提交
    async submit() {
      this.isLoading = true
      this.isLoading = true
      await api.distributionScheduleTask(this.form).finally(() => (this.isLoading = false))
      this.$utils.showToast('分配成功')
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
