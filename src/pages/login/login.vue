<template>
  <view class="main login-bg">
    <image src="../../static/images/login/login-bg.png" class="login-bg-img" mode="widthFix" />
    <div class="login">
      <input v-model="queryForm.loginName" class="login-input" type="text" placeholder="请输入账号" />
      <input v-model="queryForm.password" class="login-input" type="password" placeholder="请输入密码" />
      <view class="btn-row">
        <button type="primary" class="primary" @click="bindLogin">登录</button>
      </view>
    </div>
  </view>
</template>

<script>
import { loginApi } from '@/api/login'
import { projectAPI } from '@/api/project'
export default {
  components: {},
  data() {
    return {
      providerList: [],
      hasProvider: false,
      positionTop: 0,
      isDevtools: false,
      queryForm: {
        loginName: '',
        password: '123456'
      }
    }
  },
  methods: {
    // 登录
    bindLogin() {
      if (!this.queryForm.loginName) {
        uni.showToast({
          icon: 'none',
          title: '请输入账号'
        })
        return
      }
      if (!this.queryForm.password) {
        uni.showToast({
          icon: 'none',
          title: '请输入密码'
        })
        return
      }
      this.login()
    },
    // 登录
    async login() {
      // 登录加密
      let params = this.$utils.userEncryption(this.queryForm)
      const result = await loginApi.login(params)
      let token = result.data || ''
      this.$store.commit('user/saveLoginInfo', params)
      this.$store.commit('user/setToken', token)
      this.queryProjectListInfo()
    },
    // 获取项目数据
    async queryProjectListInfo() {
      let listinfo = await projectAPI.queryProjectListInfo()
      let list = listinfo.data.records || []
      if (list.length === 0) {
        this.$utils.showToast('无项目权限，请联系管理员添加')
        setTimeout(() => {
          this.$store.commit('user/logOut', false)
        }, 1500)
      } else {
        this.$store.dispatch('user/getUserInfo')
        this.$utils.toUrl('/pages/select-project/select-project', 1)
        this.$store.dispatch('getCompanyDepartmentList')
        this.$store.dispatch('getUserList')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./login.less');
</style>
