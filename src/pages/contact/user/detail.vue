<template>
  <div class="main">
    <div class="card summary">
      <uni-avatar :user="form" :size="160"></uni-avatar>
      <h1>{{ form.realName }}</h1>
      <p>{{ form.roleTextStr }}</p>
      <ul>
        <image src="/static/images/phone.png" @click="makePhoneCall"></image>
        <image src="/static/images/message.png" @click="sendMessage"></image>
        <image src="/static/images/email.png" @click="sendEmail"></image>
      </ul>
    </div>
    <div class="card">
      <uni-form-item label="性别" isCell align="left">{{ ['男', '女'][form.sex - 1] }}</uni-form-item>
      <uni-form-item label="生日" isCell align="left">{{ form.birthday }}</uni-form-item>
      <uni-form-item label="邮箱" isCell align="left">{{ form.email }}</uni-form-item>
      <uni-form-item label="手机" isCell align="left">{{ form.mobile }}</uni-form-item>
      <uni-form-item label="QQ" isCell align="left">{{ form.qqNumber }}</uni-form-item>
      <uni-form-item label="微信" isCell align="left">{{ form.wechatNumber }}</uni-form-item>
      <uni-form-item label="座机/分机" isCell align="left">{{ form.telephone }}</uni-form-item>
    </div>
    <div class="card">
      <uni-form-item label="入职时间" isCell align="left">{{ form.entryDate | formatData }}</uni-form-item>
      <uni-form-item label="就业时间" isCell align="left">{{ form.jobDate | formatData }}</uni-form-item>
      <uni-form-item label="备注" isCell align="left">{{ form.remark }}</uni-form-item>
      <!-- <uni-form-item label="工号" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="籍贯" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="毕业院校" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="毕业时间" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="学历" align="left">{{ form.aaa }}</uni-form-item>
      <uni-form-item label="所学专业" align="left">{{ form.aaa }}</uni-form-item> -->
    </div>
  </div>
</template>

<script>
import userApi from '@/api/user'
import { find } from 'lodash'
export default {
  name: 'Detail',
  data() {
    return {
      id: null,
      form: {
        realName: ''
      }
    }
  },
  created() {
    this.getUser()
    // this.form = await userApi.getUser(this.id)
  },
  mounted() {},
  onLoad(options) {
    this.id = options.id
  },
  methods: {
    // 获取用户信息
    async getUser() {
      let result = await userApi.getUser(this.id)
      result.roleTextStr = result.roleTexts.join(' | ')
      this.form = Object.assign({}, result)
      console.log(111, result)
    },
    refresh() {},
    submit() {},
    remove() {},
    makePhoneCall() {
      if (!this.form.mobile) {
        this.$utils.showToast('用户未填写手机号')
        return false
      }
      uni.makePhoneCall({
        phoneNumber: this.form.mobile
      })
    },
    sendMessage() {
      if (!this.form.mobile) {
        this.$utils.showToast('用户未填写手机号')
        return
      }
      // #ifdef APP-PLUS
      let msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS)
      msg.to = [this.form.mobile]
      msg.body = '你好'
      plus.messaging.sendMessage(msg)
      // #endif
    },
    sendEmail() {
      if (!this.form.email) {
        this.$utils.showToast('用户未填写邮箱')
        return
      }
      // #ifdef APP-PLUS
      let msg = plus.messaging.createMessage(plus.messaging.TYPE_EMAIL)
      msg.to = [this.form.email]
      msg.subject = '你好'
      msg.body = '你好'
      plus.messaging.sendMessage(
        msg,
        function() {
          console.log('Send success!')
        },
        function() {
          console.log('Send failed!')
        }
      )
      // #endif
    }
  }
}
</script>

<style scoped lang="less">
@import url('./detail.less');
</style>
