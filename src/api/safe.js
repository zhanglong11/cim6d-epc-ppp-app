import http from '../utils/http'
// 通用
export const safeApi = {
  // 获取安全检查列表
  queryCheckList: data => {
    return http.safety.post('/check/list', data, { isLoading: true })
  },
  /*添加安全文明临时检查*/
  getSafeCheckAdd: data => {
    return http.safety.post(`/safety/casualCheck/add`, data, { isLoading: true })
  },

  /*安全计划列表页*/
  getSafePlanList: data => {
    return http.safety.post(`/plan/list`, data, { isLoading: true })
  },
  // 获取安全检查项详情
  queryCheckItemInfo: id => {
    return http.safety.get(`/check/get/${id}`, {}, { isLoading: true })
  },
  // 添加一般检查/专项检查等
  handleSubmitCheckedInfo: data => {
    return http.safety.post(`/check/saveSubmit`, data, { isLoading: true })
  },
  // 获取安全检查-检查记录
  queryRecordItemInfo: id => {
    return http.safety.get(`/check/record/${id}`, {}, { isLoading: true })
  },
  // 整改人详情
  getRectificationInfo: id => {
    return http.safety.get(`/rectification/get/${id}`, {}, { isLoading: true })
  },

  // 安全计划详情
  queryPlanItemInfo: id => {
    return http.safety.get(`/plan/get/${id}`, {}, { isLoading: true })
  },
  // 安全复检详情
  queryRecheckItemInfo: id => {
    return http.safety.get(`/recheck/get/${id}`, {}, { isLoading: true })
  },
  //复检提交
  recheckFormSubmit: data => {
    return http.safety.post(`/recheck/submit`, data, { isLoading: true })
  },
  //整改提交
  rectificationFormSubmit: data => {
    return http.safety.post(`/rectification/submit`, data, { isLoading: true })
  }
}
