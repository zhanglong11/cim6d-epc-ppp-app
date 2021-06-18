<template>
  <view class="main is-white">
    <view class="main-header" @click="toLogin()">
      <div class="user-bg"></div>
      <div v-if="token" class="login-num">连续登陆<b v-text="consecutiveLoginDay"></b>天</div>
      <view class="avatar">
        <image :src="headImage" class="user-avatar" />
      </view>
      <view class="base-info">
        <view class="name">
          <view class="nickName">{{ token ? userName : '游客' }}</view>
        </view>
        <div class="desc">
          <view class="roleName">
            <image class="user-icon" src="~@/static/images/user/role-icon.png"></image>
            {{ token ? roleTexts : '去登录' }}
          </view>
          <view class="phone">
            <image class="user-icon" src="~@/static/images/user/tel-icon.png"></image>
            {{ mobile || '暂无' }}
          </view>
        </div>
      </view>
      <div class="header-line"></div>
    </view>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item
            label="我的待审核"
            icon="../../static/images/icon/@2x/icon-opinion.png"
            isLink
            @click="$utils.toUrl('/pages/user/approval-todo-type-list')"
          ></uni-form-item>
          <uni-form-item
            label="我的申请"
            icon="../../static/images/icon/@2x/icon-application.png"
            isLink
            @click="$utils.toUrl('/pages/user/my-task-type-list')"
          ></uni-form-item>
          <uni-form-item
            label="我领取的进度计划"
            icon="../../static/images/icon/@2x/icon-company.png"
            isLink
            @click="$utils.toUrl('/pages/epcPpp/schedule/myTask/index')"
          ></uni-form-item>
        </uni-card>

        <uni-card v-if="!token">
          <!-- 未登录占位 start -->
          <template v-if="!token">
            <uni-form-item
              label="质量管理"
              icon="../../static/images/icon/@2x/icon-quality.png"
              isLink
              @click="$utils.toUrl()"
            ></uni-form-item>
            <uni-form-item
              label="安全管理"
              icon="../../static/images/icon/@2x/icon-safe.png"
              isLink
              @click="$utils.toUrl()"
            ></uni-form-item>
          </template>
          <!-- 未登录占位 end -->
        </uni-card>

        <uni-card>
          <uni-form-item
            label="企业信息"
            icon="../../static/images/icon/@2x/icon-company.png"
            isLink
            @click="$utils.toUrl('/pages/enterpriseInfo/index')"
          ></uni-form-item>
          <uni-form-item
            label="意见反馈"
            icon="../../static/images/icon/@2x/icon-opinion.png"
            isLink
            @click="$utils.toUrl('/pages/adviceFeedback/index')"
          ></uni-form-item>
          <uni-form-item
            label="关于应用"
            icon="../../static/images/icon/@2x/icon-application.png"
            isLink
            @click="$utils.toUrl('/pages/about/index')"
          ></uni-form-item>
        </uni-card>
        <view v-if="token" class="btn-wrapper">
          <button class="button" type="primary" @click="handleLogOut">退出登录</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['projectId', 'userName', 'roleTexts', 'telephone', 'mobile']),
    token() {
      return this.$store.state.user.token
    },
    projectId() {
      return this.$store.state.project.projectId
    },
    userId() {
      return this.$store.state.user.userId
    },
    headImage() {
      return this.$store.state.user.headImage || '/static/images/default-user.png'
    },
    // 连续登陆天数
    consecutiveLoginDay() {
      return this.$store.state.user.consecutiveLoginDay
    }
  },
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(`/pages/user/setting`)
  },
  methods: {
    //退出操作
    handleLogOut() {
      this.$utils.showToast('安全退出')
      // 调用接口成功后
      setTimeout(() => {
        this.$store.commit('user/logOut')
      }, 1500)
    },
    // 跳转登录
    toLogin() {
      if (this.token) {
        return
      }
      this.$utils.toUrl('/pages/login/login')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
