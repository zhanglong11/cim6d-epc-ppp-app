import http from '@/utils/http'
// 通用
export default {
  //根据日期获取日志
  getList: data => {
    return http.epcPPP.post('/supervisorDailyReport/list', data, { isLoading: true })
  },
  //获取详情
  getDetail: id => {
    return http.epcPPP.get(`/supervisorDailyReport/get/${id}`, {}, { isLoading: true })
  },
  //添加
  add: data => {
    return http.epcPPP.post(`/supervisorDailyReport/add`, data, { isLoading: true })
  },
  submit: data => {
    return http.epcPPP.post(`/supervisorDailyReport/submitAndAudit`, data, { isLoading: true })
  }
}
