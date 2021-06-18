import http from '@/utils/http'
//let projectId = uni.getStorageSync('projectId')
//let projectId = '42c9a278642540d085108c5c19ae7ff8'

export default {
  list: params =>
    http.safety.post(`/quality/acceptanceApply/page`, {
      ...params,
      projectId: uni.getStorageSync('projectId')
    }),
  getAcceptanceApplyList: params =>
    http.safety.post(`/quality/acceptanceApply/list`, {
      ...params,
      projectId: uni.getStorageSync('projectId')
    }),
  getAcceptanceDetail: id => http.safety.get(`/quality/acceptanceApply/get/${id}`),
  saveAcceptance: params =>
    http.safety.post(`/quality/acceptanceApply/logSave`, {
      ...params,
      status: 1,
      projectId: uni.getStorageSync('projectId')
    })
}
