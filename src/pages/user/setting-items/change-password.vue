<template>
  <div class="main is-white">
    <div class="tab">
      <div :class="['item', activeName === 'step1' ? 'active' : '']">1.验证原密码</div>
      <div :class="['item', activeName === 'step2' ? 'active' : '']">2.设置新密码</div>
    </div>
    <div v-if="activeName === 'step1'" class="content-container">
      <div class="line">
        <div class="tooltip-info has-margin-top">
          为保障您的账号安全，修改密码前请填写原密码
        </div>
      </div>
      <div class="line bg-white">
        <uni-input-icon
          v-model="form.currentPassword"
          :height="50"
          :iconSize="20"
          inputType="password"
          placeholder="请输入原登录密码"
          icon="fas fa-unlock-alt"
        ></uni-input-icon>
      </div>
      <div class="block-btn" @click="handleNext">
        下一步
      </div>
     <!-- <div class="line">
        <div class="forgetPwd" @click="handleForgetPwdClick">忘记原密码</div>
      </div>-->
    </div>
    <div v-if="activeName === 'step2'" class="content-container">
      <div class="line bg-white input-group">
        <uni-input-icon
          v-model="form.newPassword"
          :height="50"
          :iconSize="20"
          inputType="password"
          placeholder="请设置6~20位新的登录密码"
          icon="fas fa-unlock-alt"
        ></uni-input-icon>
        <uni-input-icon
          v-model="form.newPassword2"
          :height="50"
          :iconSize="20"
          inputType="password"
          placeholder="请再次输入新的登录密码"
          icon="fas fa-unlock-alt"
        ></uni-input-icon>
      </div>
      <div class="block-btn" @click="handleSubmit">
        提交
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/pages/user/api'

export default {
  name: 'ChangePassword',
  components: {},
  data() {
    return {
      activeName: 'step1',
      form: {
        currentPassword: '',
        newPassword: '',
        newPassword2: ''
      }
    }
  },
  computed: {},
  onShow() {},
  onBackPress() {
    if (this.activeName === 'step2') {
      this.activeName = 'step1'
      return true
    }
  },
  // 下拉刷新
  onPullDownRefresh() {},
  methods: {
    async handleNext() {
      if (!this.form.currentPassword) {
        this.$utils.showToast('请输入原密码')
        return false
      }
      this.activeName = 'step2'
    },
    async handleSubmit() {
      if (this.form.newPassword !== this.form.newPassword2) {
        this.$utils.showToast('两次新密码输入不一致')
        return false
      }
      await Api.changePassword(this.form)
      this.$utils.showToast('修改成功')
      setTimeout(() => {
        this.$utils.toUrl('/pages/user/setting')
      }, 2000)
    },
    async handleForgetPwdClick() {
      this.$utils.toUrl('/pages/user/setting-items/reset-password')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./change-password.less');
</style>
