import http from '@/utils/http'
// 通用
export default {
  //根据日期获取周报
  getList: data => {
    return http.epcPPP.post('/constructionWeeklyReport/list', data, { isLoading: true })
  },
  //获取详情
  getDetail: id => {
    return http.epcPPP.get(`/constructionWeeklyReport/get/${id}`, {}, { isLoading: true })
  },
  //添加
  add: data => {
    return http.epcPPP.post(`/constructionWeeklyReport/add`, data, { isLoading: true })
  },
  submit: data => {
    return http.epcPPP.post(`/constructionWeeklyReport/submitAndAudit`, data, { isLoading: true })
  }
}
