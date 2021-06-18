<template>
  <div class="main">
    <uni-card>
      <uni-form-item label="通知公告标题">{{ form.title }}</uni-form-item>
      <uni-form-item label="内容"> {{ form.content }}</uni-form-item>
      <uni-form-item class="file-item" label="附件">
        <uni-attachment v-model="form.fileIds"></uni-attachment>
      </uni-form-item>
      <uni-form-item :border="false" label="发送人"> {{ form.creatorName }}</uni-form-item>
      <uni-form-item :border="false" label="发送时间"> {{ form.createTime }}</uni-form-item>
    </uni-card>
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
      api.getDetailsNotice(this.id).then(res => {
        this.form = res.data
      })
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
