/*
公告管理的api
 */
import http from '@/utils/http'
export default {
  // 查询消息列表
  queryListNotice: data => {
    return http.epcPPP.post('announcement/list', data)
  },
  // 获取消息详情
  getDetailsNotice: id => {
    return http.epcPPP.get(`announcement/get/${id}`)
  },
  // 添加消息
  addNotice: data => {
    return http.epcPPP.post('announcement/add', data)
  },
  // 编辑消息
  updateNotice: data => {
    return http.epcPPP.post('announcement/update', data)
  },
  // 删除消息
  deleteNotice: id => {
    return http.epcPPP.get(`announcement/delete/${id}`)
  },
  // 查询用户详情
  getUserInfo: id => {
    return http.epcPPP.get(`cim6d/system/user/get/${id}`)
  }
}
