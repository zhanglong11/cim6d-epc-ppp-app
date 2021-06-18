import http from '@/utils/http'
const projectId = wx.getStorageSync('projectId')
// 通用
export default {
  // 获取安全问题列表
  getList: data => {
    return http.epcPPP.post('/safetyIssue/list', { ...data, projectId }, { isLoading: true })
  },
  //获取详情
  getDetail: id => {
    return http.epcPPP.get(`/safetyIssue/get/${id}`, {}, { isLoading: true })
  },
  //添加
  add: data => {
    return http.epcPPP.post(`/safetyIssue/add`, { ...data, projectId }, { isLoading: true })
  },
  //获取年度对比分析
  getYearDiff: data => {
    return http.epcPPP.post(`/safetyIssue/getByYearContrast`, { ...data, projectId }, {})
  },
  //获取年份
  getYear: data => {
    return http.epcPPP.post(`/safetyIssue/getYear`, { ...data, projectId })
  },
  //获取月份
  getMonth: data => {
    return http.epcPPP.post(`/safetyIssue/getMonth`, { ...data, projectId })
  },
  //获取年度分析
  getYearAnalysis: data => {
    return http.epcPPP.post(`/safetyIssue/getByYearAnalys`, { ...data, projectId })
  },
  //根据选择年度获取不同类型的质量问题
  getIssueTypeByYear: data => {
    return http.epcPPP.post(`/safetyIssue/getSafetyCount`, { ...data, projectId })
  },
  //获取月度分析
  getMonthAnalysis: data => {
    return http.epcPPP.post(`/safetyIssue/getByMonthAnalys`, { ...data, projectId })
  }
}
