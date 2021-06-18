<template>
  <div class="main">
    <uni-form-custom :border="false">
      <uni-card>
        <uni-form-item border label="任务名称">{{ form.taskName }}</uni-form-item>
        <uni-form-item border label="任务编号">{{ form.aaa }}</uni-form-item>
        <uni-form-item label="计划开始日期">{{ form.planStartDate | ymd }}</uni-form-item>
        <uni-form-item label="计划结束日期">{{ form.planEndDate | ymd }}</uni-form-item>
        <uni-form-item label="实际开始日期">{{ form.actualStartDate | ymd }}</uni-form-item>
        <uni-form-item label="实际结束日期">{{ form.actualEndDate | ymd }}</uni-form-item>
        <uni-form-item v-if="form.status === 5" label="滞后/延期 (天)">{{ form.advanceOrDelayDays }}</uni-form-item>
        <uni-form-item label="任务状态">{{ $getLabel(taskStatusList, form.status) }}</uni-form-item>
        <uni-form-item label="关联状态">{{ form.isBind ? '已关联' : '未关联' }}</uni-form-item>
        <uni-form-item label="领取人">{{ form.receivePersonName }}</uni-form-item>
        <uni-form-item label="领取时间">{{ form.receiveTime }}</uni-form-item>
      </uni-card>

      <ul class="record-list">
        <li v-for="record in form.recordList" :key="record.createTime">
          <uni-card :title="['延期解决方案', '延后所有关联进度', '提前所有关联进度'][record.type]">
            <div class="card-content">
              <p>
                <span>发布时间</span><span>{{ record.createTime }}</span>
              </p>

              <p v-if="record.type === 0">
                <span>详细内容</span><span>{{ record.changeReason }}</span>
              </p>
              <p v-if="record.type === 1">
                <span>延长时长</span><span>{{ record.changeDays }}</span>
              </p>
              <p>
                <span>延后原因</span><span>{{ record.changeReason }}</span>
              </p>
              <p v-if="record.type === 2">
                <span>提前时长</span><span>{{ record.changeDays }}</span>
              </p>
              <p>
                <span>提前原因</span><span>{{ record.changeReason }}</span>
              </p>
              <uni-check-detail :id="record.targetId"></uni-check-detail>
            </div>
          </uni-card>
        </li>
      </ul>
    </uni-form-custom>
  </div>
</template>

<script>
import api from '../api'
import taskStatusList from '../lib/taskStatusList'
export default {
  name: 'TaskDetail',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      id: '',
      taskStatusList,
      form: {}
    }
  },
  onLoad(options) {
    this.id = options.id
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
      api.getScheduleTaskById(this.id).then(res => {
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
.record-list {
  .card-content {
    font-size: 14px;
    padding: 25px;
    p {
      display: flex;
      margin-bottom: 15px;
      span:first-child {
        width: 140px;
      }
      span:last-child {
        color: #999;
      }
    }
  }
}
</style>
