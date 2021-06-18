<template>
  <div class="main">
    <uni-form-custom ref="form" :rules="rules" :model="form">
      <uni-card>
        <uni-form-item label="任务编号" disabled>
          <view align="left">{{ task.wbsCode }}</view>
        </uni-form-item>
        <uni-form-item label="任务名称" disabled>
          <view align="left">{{ task.name }}</view>
        </uni-form-item>
        <uni-form-item label="任务类型" disabled>
          <view align="left">{{ ['一般任务', '里程碑任务'][task.type - 1] }}</view>
        </uni-form-item>
        <uni-form-item label="父级任务" disabled>
          <view align="left">{{ task.pidName }}</view>
        </uni-form-item>
        <uni-form-item label="前置任务" disabled>
          <view align="left">{{ task.preTaskName }}</view>
        </uni-form-item>
        <uni-form-item label="计划开始日期" disabled>
          <view align="left">{{ task.planStartTime | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="计划结束日期" disabled>
          <view align="left">{{ task.planEndTime | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="工期(天)" disabled>
          <view align="left">{{ task.planDuration }}</view>
        </uni-form-item>
        <uni-form-item label="实际开始日期" prop="actualStartTime" disabled>
          <view align="left">{{ task.actualStartTime | ymd }}</view>
        </uni-form-item>
      </uni-card>
      <uni-card>
        <uni-form-item label="实际结束日期" isLink prop="actualEndTime">
          <uni-date-picker v-model="form.actualEndTime" placeholder="请选择" fields="day"></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="实际工期(天)">
          <input v-model.number="form.actualDuration" placeholder="请输入" type="number" />
        </uni-form-item>
        <uni-form-item label="当前任务进度(%)" prop="actualProgress">
          <input v-model.number="form.actualProgress" type="number" placeholder="请输入" />
        </uni-form-item>
      </uni-card>

      <div class="affect-list">
        <div class="title">
          <span>施工影响</span>
          <span @click="handleAffectAdd">add</span>
        </div>
        <uni-card v-for="(e, index) in form.addEffectList" :key="e._id" class="item">
          <uni-form-item label="序号">
            <view>{{ index + 1 }}</view>
          </uni-form-item>
          <uni-form-item label="施工影响名称" required="true">
            <input v-model="e.effectName" type="text" />
          </uni-form-item>
          <uni-form-item label="施工影响范围">
            <input v-model="e.effectScope" type="text" />
          </uni-form-item>
          <uni-form-item label="施工影响值">
            <input v-model="e.effectValue" type="text" />
          </uni-form-item>
          <uni-form-item label="影响开始日期" isLink>
            <uni-date-picker v-model="e.beginDate" fields="day"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="影响结束日期" isLink>
            <uni-date-picker v-model="e.endDate" fields="day"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="影响工期(天)">
            <input v-model="e.effectDuration" type="number" />
          </uni-form-item>
          <span class="close" @click="form.addEffectList.splice(index, 1)">+</span>
        </uni-card>
      </div>
      <uni-card>
        <uni-form-item label="备注">
          <textarea v-model="form.remark" auto-height></textarea>
        </uni-form-item>
        <uni-form-item label="附件">
          <uni-attachment v-model="form.fileIds" edit></uni-attachment>
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button class="button" type="primary" :loading="isLoading" @click="submit">保存</button>
      </view>
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
      id: null
    }
  },
  onLoad(options) {
    this.id = options.id
    this.form.taskId = options.id
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.schedule.get('construct/task/get/' + this.id).then(res => {
        this.task = res.data
        this.form.actualProgress = res.data.actualProgress * 100
      })
    },
    async submit() {
      let form = _.cloneDeep(this.form)
      form.addEffectList.forEach(e => {
        if (e.beginDate) e.beginDate += ' 00:00:00'
        if (e.endDate) e.endDate += ' 23:59:59'
      })
      if (form.actualEndTime) {
        form.actualEndTime += ' 23:59:59'
      }
      await this.$refs.form.validate()
      await this.fly.schedule.post('construct/task/report', form)
      if (this.form.actualEndTime) {
        await this.fly.schedule.post('construct/task/finish', {
          actualEndTime: this.form.actualEndTime,
          taskId: this.id
        })
      }
      this.$utils.showToast('成功')
      setTimeout(() => this.$utils.goBack(), 500)
    },
    remove() {},
    handleAffectAdd() {
      this.form.addEffectList.push({ _id: _.uniqueId() })
    },
    log(v) {
      console.log(v)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
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
</style>
