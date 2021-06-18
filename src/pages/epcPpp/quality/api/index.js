import http from '@/utils/http'
// 通用
const projectId = wx.getStorageSync('projectId')
export default {
  // 获取质量问题列表
  getList: data => {
    return http.epcPPP.post('/quality/issue/list', { ...data, projectId }, { isLoading: true })
  },
  //获取详情
  getDetail: id => {
    return http.epcPPP.get(`/quality/issue/get/${id}`, {}, { isLoading: true })
  },
  //添加
  add: data => {
    return http.epcPPP.post(`/quality/issue/add`, { ...data, projectId }, { isLoading: true })
  },
  //获取年度对比分析
  getYearDiff: data => {
    return http.epcPPP.post(`/quality/issue/getByYearContrast`, { ...data, projectId }, {})
  },
  //获取年份
  getYear: data => {
    return http.epcPPP.post(`/quality/issue/getYear`, { ...data, projectId })
  },
  //获取月份
  getMonth: data => {
    return http.epcPPP.post(`/quality/issue/getMonth`, { ...data, projectId })
  },
  //获取年度分析
  getYearAnalysis: data => {
    return http.epcPPP.post(`/quality/issue/getByYearAnalys`, { ...data, projectId })
  },
  //根据选择年度获取不同类型的质量问题
  getIssueTypeByYear: data => {
    return http.epcPPP.post(`/quality/issue/getQualityCount`, { ...data, projectId })
  },
  //获取月度分析
  getMonthAnalysis: data => {
    return http.epcPPP.post(`/quality/issue/getByMonthAnalys`, { ...data, projectId })
  }
}
