import http from '../utils/http'
// 通用
export const inspectApi = {
  // 添加质量临检项--http.inspect
  addQualityCheckItem: data => {
    return http.safety.post('inspect/interim/add', data, { isLoading: true })
  },
  // 获取质量检查列表
  queryCheckList: data => {
    return http.safety.post('inspect/list', data, { isLoading: true })
  },
  // 获取安全检查项详情
  queryCheckItemInfo: id => {
    return http.safety.get(`/quality/qualityCheck/get/${id}`, {}, { isLoading: true })
  },
  // 获取安全检查计划详情
  queryPlanItemInfo: id => {
    return http.safety.get(`/quality/checkPlan/get/${id}`, {}, { isLoading: true })
  },
  // 首次检查不合格，提交整改信息
  submitRectificationInfo: data => {
    return http.safety.post(`/quality/problem/rectification`, data, { isLoading: true })
  },
  // 提交复检信息
  submitReviewInfo: data => {
    return http.safety.post(`/quality/problem/review`, data, { isLoading: true })
  },
  // 获取不同的检查计划列表
  queryPlanList: data => {
    return http.safety.post(`/quality/checkPlan/list`, data, { isLoading: true })
  },
  //一般检查-阶段检查-专项检查检查合格
  submitCheckInfo: data => {
    return http.safety.post(`/quality/otherCheck/add`, data, { isLoading: true })
  }
}
