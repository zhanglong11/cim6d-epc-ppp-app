import http from '@/utils/http'
export default {
  //投资确认列表
  getConfirmList: data => {
    return http.epcPPP.post('/invest/confirm/list', data, { isLoading: true })
  },
  //投资确认添加
  getConfirmAdd: data => {
    return http.epcPPP.post('/invest/confirm/save', data, { isLoading: true })
  },
  //投资确认保存并提交
  getConfirmAddAndSubmit: data => {
    return http.epcPPP.post('/invest/confirm/saveAndSubmit', data, { isLoading: true })
  },
  //投资确认详情
  getConfirmDetails: id => {
    return http.epcPPP.get(`/invest/confirm/get/${id}`, { isLoading: true })
  },
  //投资确认列表删除
  geConfirmDelete: id => {
    return http.epcPPP.get(`/invest/confirm/delete/${id}`, {})
  },
  //获取上期累计
  getPreviousPeriodTotal: data => {
    return http.epcPPP.post('/invest/confirm/getPreviousPeriodTotal', data)
  }
}
