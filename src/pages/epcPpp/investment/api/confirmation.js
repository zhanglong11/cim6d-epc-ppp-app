//投资确认列表
import http from '@/utils/http'
const epcPPP = http.epcPPP
// 投资确认单列表
export const getConfirmList = body => {
  return epcPPP.post('invest/confirm/list', body)
}
// 投资确认详情
export const getConfirmDetail = id => {
  return epcPPP.get('invest/confirm/get/' + id)
}
// 删除投资确认单
export const removeConfirm = idList => {
  return epcPPP.post('invest/confirm/delete', idList)
}
//投资确认保存草稿
export const saveConfirm = body => {
  return epcPPP.post('invest/confirm/save', body)
}
//投资确认保存并提交
export const submitConfirm = body => {
  return epcPPP.post('invest/confirm/saveAndSubmit', body)
}
// 填报完成
export const completeConfirm = body => {
  return epcPPP.post('invest/confirm/task/complete', body)
}
