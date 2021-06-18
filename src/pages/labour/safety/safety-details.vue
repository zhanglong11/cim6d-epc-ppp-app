<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body-details">
        <uni-card>
          <uni-form-item align="left" disabled label="培训主题 ">
            {{ form.trainingTheme }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="培训机构">
            {{ form.trainingOrgan }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="培训讲师">
            {{ form.lecturer }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="培训地址">
            {{ form.address }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="培训开始时间">
            {{ form.trainingTime }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="培训课时">
            {{ form.trainingHour }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="培训内容">
            {{ form.trainingContent }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="参与培训人员">
            <uni-select-labour v-model="form.totalEmployee" multiple></uni-select-labour>
          </uni-form-item>
          <uni-form-item align="left" disabled label="合格人员">
            <uni-select-labour v-model="form.qualifiedEmployee" multiple></uni-select-labour>
          </uni-form-item>
          <uni-form-item align="left" disabled label="不合格人员">
            <uni-select-labour v-model="form.unqualifiedEmployee" multiple></uni-select-labour>
          </uni-form-item>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'SafetyDetails',
  data() {
    //这里存放数据
    return {
      id: '',
      form: {}
    }
  },
  onLoad(option) {
    this.id = option.id
  },
  onShow() {
    this.refresh()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'edit') {
      this.$utils.toUrl(`/pages/labour/safety/safety-add?id=${this.id}`)
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    refresh() {
      this.fly.labourSafety.get('training/get/' + this.id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./safety.less');
</style>
