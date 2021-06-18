<template>
  <div class="main">
    <uni-form-custom ref="form" :border="false" :rules="rules" :model="form">
      <uni-card style="position: relative">
        <uni-load-line
          class="progress"
          loadType="circle"
          :circleInfo="circleInfo"
          :loadPercent="task.actualProgress"
        ></uni-load-line>
        <uni-form-item label="任务编号">
          <view align="left">{{ task.wbsCode }}</view>
        </uni-form-item>
        <uni-form-item label="任务名称">
          <view align="left">{{ task.name }}</view>
        </uni-form-item>
        <uni-form-item label="任务类型">
          <view align="left">{{ ['一般任务', '里程碑任务'][task.type - 1] }}</view>
        </uni-form-item>
        <uni-form-item label="父级任务">
          <view align="left">{{ task.pidName }}</view>
        </uni-form-item>
        <uni-form-item label="前置任务">
          <view align="left">{{ task.preTaskName }}</view>
        </uni-form-item>
        <uni-form-item label="计划开始日期">
          <view align="left">{{ task.planStartTime | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="计划结束日期">
          <view align="left">{{ task.planEndTime | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="工期(天)">
          <view align="left">{{ task.planDuration }}</view>
        </uni-form-item>
        <uni-form-item label="实际开始日期">
          <view align="left">{{ task.actualStartTime | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="实际结束日期">
          <view align="left">{{ task.actualEndTime | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="实际工期(天)">
          <view align="left">
            {{ task.actualDuration }}
          </view>
        </uni-form-item>
        <uni-form-item label="当前任务进度(%)">
          <view align="left">
            {{ task.actualProgress }}
          </view>
        </uni-form-item>
      </uni-card>

      <div v-if="task.taskEffectList" class="affect-list">
        <div class="title">
          <span>施工影响</span>
        </div>
        <uni-card v-for="(e, index) in task.taskEffectList" :key="e._id" class="item">
          <uni-form-item label="序号">
            <view>{{ index + 1 }}</view>
          </uni-form-item>
          <uni-form-item label="施工影响名称" required="true">
            <view>{{ e.effectName }}</view>
          </uni-form-item>
          <uni-form-item label="施工影响范围">
            <view>{{ e.effectScope }}</view>
          </uni-form-item>
          <uni-form-item label="施工影响值">
            <view>{{ e.effectValue }}</view>
          </uni-form-item>
          <uni-form-item label="影响开始日期" isLink>
            <view>{{ e.beginDate | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="影响结束日期" isLink>
            <view>{{ e.endDate | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="影响工期(天)">
            <view>{{ e.effectDuration }}</view>
          </uni-form-item>
        </uni-card>
      </div>
      <uni-card>
        <uni-form-item label="备注">
          <textarea v-model="task.remark" auto-height></textarea>
        </uni-form-item>
        <uni-form-item label="附件">
          <uni-attachment v-model="task.fileIds"></uni-attachment>
        </uni-form-item>
      </uni-card>
    </uni-form-custom>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Detail',
  data() {
    return {
      task: {},
      form: {
        addEffectList: [],
        actualEndTime: null
      },
      rules: {
        actualProgress: { required: true }
      },
      isLoading: false,
      id: null,
      circleInfo: { foreground: '#717376', background: '#6ED4BF', circleColor: '#fff' }
    }
  },
  computed: {
    list() {
      return this.$store.state.schedule.list
    }
  },
  onLoad(options) {
    this.id = options.id
    this.task.taskId = options.id
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.schedule.get('construct/task/get/' + this.id).then(res => {
        res.data.actualProgress = res.data.actualProgress * 100
        this.task = res.data
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  padding-bottom: 30px;
}
.uni-card {
  width: 700px;
}
.affect-list {
  .title {
    width: 700px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999;
    font-size: 14px;
    padding: 20px 25px 0;
    border-bottom: 1px solid #eee9;
  }
  .item {
    position: relative;
  }
  > div {
  }
  .close {
    background-color: #000;
    color: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    line-height: 30px;
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
    transform: rotate(45deg);
  }
}
.progress {
  position: absolute;
  top: 0;
  right: 150px;
  transform: scale(0.4);
}
</style>
