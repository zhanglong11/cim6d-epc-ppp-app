<template>
  <div class="main">
    <uni-form-custom disabled align="left">
      <uni-card>
        <uni-form-item label="进度任务名称">
          {{ form.taskName }}
        </uni-form-item>
        <uni-form-item label="进度计划时间">
          {{ moment(form.planStartDate).format('YYYYMMDD') }}
          -
          {{ moment(form.planEndDate).format('YYYYMMDD') }}
        </uni-form-item>
      </uni-card>
      <uni-card title="领取人记录">
        <uni-form-item label="领取人">
          {{ form.receivePersonCompanyName + '-' + form.receivePersonName }}
        </uni-form-item>
        <uni-form-item label="领取时间">
          {{ form.receiveTime }}
        </uni-form-item>
      </uni-card>
      <uni-card v-if="_.size(form.recordList)" title="分配人 记录">
        <div v-for="record in form.recordList" :key="record.createTime">
          <uni-form-item label="被分配人">
            {{ record.beDistributionPersonCompanyName + '-' + record.beDistributionPersonName }}
          </uni-form-item>
          <uni-form-item label="分配时间">
            {{ record.createTime }}
          </uni-form-item>
        </div>
      </uni-card>
    </uni-form-custom>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'AssignHistory',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      taskId: null,
      form: {}
    }
  },
  onLoad({ taskId }) {
    this.taskId = taskId
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
      api.recordDistributionTask(this.taskId).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.main {
  padding-top: 15px;
}
.uni-card {
  width: 700px;
}
</style>
