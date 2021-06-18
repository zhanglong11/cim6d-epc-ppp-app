import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginApi } from '@/api/login'
// import utils from '@/utils/utils' // 通用函数封装
const state = {
  token: getToken() || '',
  userId: uni.getStorageSync('userId') || '',
  userName: uni.getStorageSync('userName') || '',
  consecutiveLoginDay: uni.getStorageSync('consecutiveLoginDay') || '', // 连续登陆天数
  telephone: uni.getStorageSync('telephone') || '',
  roleTexts: uni.getStorageSync('roleTexts') || '', //用户的角色文本
  headImage: uni.getStorageSync('headImage') || '/static/images/default-user.png',
  mobile: uni.getStorageSync('mobile') || '',
  loginInfo: uni.getStorageSync('loginInfo') || '' // 登录信息,用于自动登录
}

const mutations = {
  // 保存登录信息,用于自动登录
  saveLoginInfo(state, info) {
    uni.setStorageSync('loginInfo', info)
    state.loginInfo = info
  },
  setToken(state, token) {
    setToken(token)
    state.token = token
  },
  // 登录成功后将用户信息存储到storge和vuex中
  setUserInfo(state, data) {
    Object.keys(data).forEach(key => {
      let value = data[key] ? data[key] : ''
      state[key] = value
      uni.setStorageSync(key, value)
    })
  },
  // 登录
  login(state, callBack = () => {}) {
    if (!state.loginInfo.loginName || !state.loginInfo.password) {
      this.commit('user/logOut')
      return
    }
    return new Promise((resolve, reject) => {
      loginApi
        .login(state.loginInfo)
        .then(response => {
          this.commit('user/setToken', response.data)
          callBack()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 退出时清空用户信息包含storge和vuex
  logOut(state, type = true) {
    const result = uni.getStorageInfoSync()
    let storageKey = result.keys
    storageKey.map(e => {
      // 不清理引导页标记缓存
      if (e !== 'guide') {
        uni.removeStorageSync(e)
      }
    })
    uni.removeStorageSync('power')
    uni.removeStorageSync('token')
    this.commit('clearProject')
    this.commit('clearPower')
    Object.keys(state).forEach(key => {
      state[key] = ''
    })
    // if (type) {
    //   utils.toUrl('/pages/login/login', 1)
    // }
  }
}
const actions = {
  async getUserInfo({ commit }) {
    //获取用户信息
    //成功后设置到storge和vuex中
    let result = await loginApi.getUserInfo()
    let datas = result.data
    if (result.code === 200 && datas) {
      let roleTexts = datas.roleTexts.length > 0 ? datas.roleTexts.join(' ') : '暂无'
      let model = {
        userId: datas.id,
        userName: datas.realName,
        telephone: datas.telephone,
        roleTexts,
        headImage: datas.headImage,
        mobile: datas.mobile,
        companyId: datas.companyId,
        consecutiveLoginDay: datas.consecutiveLoginDay || 1
      }
      commit('setUserInfo', model)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
