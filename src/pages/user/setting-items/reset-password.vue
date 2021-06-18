<template>
  <div class="main is-white">
    <div class="tab">
      <div :class="['item', activeName === 'step1' ? 'active' : '']">1.验证手机号码</div>
      <div :class="['item', activeName === 'step2' ? 'active' : '']">2.设置新密码</div>
    </div>
    <div v-if="activeName === 'step1'" class="content-container">
      <div class="line bg-white">
        <uni-input-icon
          v-model="password"
          :height="50"
          :iconSize="20"
          inputType="password"
          placeholder="请输入手机号码"
          icon="fas fa-mobile-alt"
        ></uni-input-icon>
        <uni-input-icon
          v-model="password"
          :height="50"
          :iconSize="20"
          inputType="password"
          placeholder="请输入验证码"
          icon="fas fa-indent"
        >
          <div slot="btn">
            <button :disabled="btnDisabled" class="btn" @click="handleGetCode">{{ btnText }}</button>
          </div>
        </uni-input-icon>
      </div>
      <div class="block-btn" @click="handleNext">
        下一步
      </div>
    </div>
    <div v-if="activeName === 'step2'" class="content-container">
      <div class="line bg-white input-group">
        <uni-input-icon
          v-model="password"
          :height="50"
          :iconSize="20"
          inputType="password"
          placeholder="请设置6~20位新的登录密码"
          icon="fas fa-unlock-alt"
        ></uni-input-icon>
        <uni-input-icon
          v-model="password"
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
export default {
  name: 'ResetPassword',
  components: {},
  data() {
    return {
      activeName: 'step1',
      password: '',
      btnText: '获取验证码',
      second: 60,
      btnDisabled: false,
      timer: null
    }
  },
  computed: {},
  onShow() {},
  onBackPress() {
    if (this.activeName === 'step2') {
      this.activeName = 'step1'
      this.initTimer()
      return true
    }
  },
  // 下拉刷新
  onPullDownRefresh() {},
  methods: {
    initTimer() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.btnText = '获取验证码'
      this.second = 60
      this.btnDisabled = false
    },
    async handleNext() {
      console.log('下一步')
      this.activeName = 'step2'
    },
    async handleSubmit() {
      console.log('提交成功')
    },
    async handleGetCode() {
      if (this.btnDisabled) {
        return
      }
      this.btnDisabled = true
      console.log('获取验证码')
      this.timer = setInterval(() => {
        if (this.second >= 1) {
          this.second--
          this.btnText = this.second + 'S'
        } else {
          this.initTimer()
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./reset-password.less');
</style>
