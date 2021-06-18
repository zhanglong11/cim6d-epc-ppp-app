<template>
  <div class="main">
    <uni-form-custom ref="form" :rules="rules" :model="form">
      <uni-card>
        <uni-form-item label="期号" prop="issue">
          <input v-model="form.issue" placeholder="点击输入内容" type="text" />
        </uni-form-item>
        <uni-form-item label="确认单月份" prop="confirmMonth">
          <uni-date-picker
            v-model="form.confirmMonth"
            fields="month"
            mode="date"
            valueFormat="YYYY-MM"
          ></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="确认期" prop="confirmStartDate">
          <uni-date-range
            class="drawer-custom"
            :start-date.sync="form.confirmStartDate"
            :end-date.sync="form.confirmEndDate"
          ></uni-date-range>
        </uni-form-item>
      </uni-card>
      <uni-card title="工程建设费用">
        <uni-form-item label="工程建设费用(元)" prop="constructionCostSaveDTO.constructionCost">
          <input
            v-model.number="form.constructionCostSaveDTO.constructionCost"
            type="number"
            placeholder="点击输入内容"
          />
        </uni-form-item>
        <uni-form-item label="附件">
          <uni-attachment v-model="form.constructionCostSaveDTO.fileIds" edit></uni-attachment>
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSave()">保存草稿</button>
        <button class="button" type="primary" @click="handleSubmit()">保存并提交</button>
      </view>
    </uni-form-custom>
  </div>
</template>

<script>
import { getConfirmDetail, saveConfirm, submitConfirm } from '../api/confirmation'
export default {
  name: 'BuildAdd',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {
        confirmType: 1,
        projectId: uni.getStorageSync('projectId'),
        constructionCostSaveDTO: {
          projectId: uni.getStorageSync('projectId')
        }
      },
      rules: {
        issue: { required: true },
        confirmMonth: { required: true },
        confirmStartDate: { required: true },
        'constructionCostSaveDTO.constructionCost': { required: true }
      },
      id: ''
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  onShow() {
    this.refresh()
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      if (this.id) {
        getConfirmDetail(this.id).then(res => {
          this.form = res.data
        })
      }
    },
    // 保存草稿
    async handleSave() {
      await this.$refs.form.validate()
      await saveConfirm(this.form)
      await this.$utils.showToast('成功')
      this.$utils.goBack()
    },
    // 保存并提交
    async handleSubmit() {
      await this.$refs.form.validate()
      await submitConfirm(this.form)
      await this.$utils.showToast('成功')
      this.$utils.goBack()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.btn-wrapper {
  display: flex;
  justify-content: center;
  > * {
    width: 40%;
  }
}
</style>
