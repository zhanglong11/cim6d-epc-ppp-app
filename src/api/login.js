import http from '@/utils/http'
// 通用
export const loginApi = {
  // 登录
  login: data => {
    return http.system.post('/login', data)
  },
  // 获取用户信息
  getUserInfo: () => {
    return http.system.get('/cim6d/system/user/current/get')
  },
  // 更新记录
  appCheckUpdate: data => {
    return http.admin.post('app/appCheckUpdate', data)
  }
}
