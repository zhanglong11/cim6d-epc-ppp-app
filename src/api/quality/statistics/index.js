import http from '@/utils/http'
//let projectId = uni.getStorageSync('projectId')
//let projectId = '42c9a278642540d085108c5c19ae7ff8'

export default {
  getData: data =>
    http.safety.post(
      `/inspect/statistical`,
      { ...data, projectId: uni.getStorageSync('projectId') },
      { isLoading: true }
    ),
  getList: data =>
    http.safety.post(
      `/inspect/problemList`,
      { ...data, projectId: uni.getStorageSync('projectId') },
      { isLoading: true }
    )
}
