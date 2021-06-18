import http from '../utils/http'
// 通用
export default {
  // 获取安全检查列表
  getSafeCivilizationCheckCheckList: data => {
    return http.safety.post('/civilization/check/list', data, { isLoading: true })
  },
  /*添加安全文明临时检查*/
  addSafeCivilizationCheck: data => {
    return http.safety.post(`/civilization/casualCheck/add`, data, { isLoading: true })
  },

  /*安全计划列表页*/
  getSafeCivilizationPlanList: data => {
    return http.safety.post(`/civilizationTarget/list`, data, { isLoading: true })
  },
  // 获取安全检查项详情
  queryCheckItemInfo: id => {
    return http.safety.get(`/check/get/${id}`, {}, { isLoading: true })
  },
  // 添加一般检查/专项检查等
  handleSubmitCheckedInfo: data => {
    return http.safety.post(`/civilization/check/update`, data, { isLoading: true })
  },
  // 获取安全文明检查-检查记录
  queryRecordItemInfo: id => {
    return http.safety.get(`/civilization/check/get/${id}`, {}, { isLoading: true })
  },
  // 整改人详情
  getRectificationInfo: id => {
    return http.safety.get(`/rectification/get/${id}`, {}, { isLoading: true })
  },

  // 安全文明计划详情
  queryPlanItemInfo: id => {
    return http.safety.get(`/civilizationTarget/get/${id}`, {}, { isLoading: true })
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
