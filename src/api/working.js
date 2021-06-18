import http from '../utils/http'
// 通用
export const workingAPI = {
  // 获取bim版本号
  queryBimVersion: (data, isLoading = true) => {
    return http.system.post('/project/bim/version/list', data, {
      isLoading
    })
  }
}
