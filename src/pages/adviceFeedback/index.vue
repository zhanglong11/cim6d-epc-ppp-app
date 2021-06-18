<template>
  <view class="main-body">
    <view class="richText">
      <textarea v-model="form.remark" :maxlength="50" rows="10" placeholder="请输入您反馈的内容"></textarea>
    </view>
    <view>
      <view class="card-title">上传图片</view>
      <uni-attachment v-model="form.files" edit></uni-attachment>
    </view>
    <uni-form-item label="联系方式">
      <input v-model="form.mobile" :maxlength="20" type="number" placeholder="点击填写" />
    </uni-form-item>
    <view class="title-tip">
      请留下您的联系方式(微信号/QQ/邮箱)，反馈的相关问题我们会第一时间为您解答。
    </view>
    <view class="btn-wrapper">
      <button class="button" type="primary" @click="save()">提交</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      nodes: '',
      form: {
        files: '',
        mobile: '',
        remark: ''
      }
    }
  },
  methods: {
    // 保存
    save() {
      if (!this.form.remark) {
        this.$utils.showToast('请输入您反馈的内容')
        return
      }
      if (!this.form.mobile) {
        this.$utils.showToast('请填写联系方式')
        return
      }
      this.$utils.showToast('提交成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
.richText {
  border: 1px solid #eee;
  border-radius: 5px;
  textarea {
    width: 700px;
    padding: 10px;
  }
}
.main-body {
  padding: 10px 20px;
  .card-title {
    margin: 30px 0 15px;
  }
}
.title-tip {
  padding: 20px;
  color: #999;
  font-size: 14px;
  background: #f5f5f5;
}
.form-item {
  /*border: 1px solid #e5e5e5;*/
  margin-top: 20px;

  border-top: 1px solid #e5e5e5;
  /*border-bottom:1px solid #e5e5e5;*/
}
/deep/ .upload-button-list {
  li {
    width: 200px;
    height: 200px;
  }
}
</style>
