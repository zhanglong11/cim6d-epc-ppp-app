import http from '../utils/http'
// 通用
export const msgApi = {
  // 获取消息种类列表
  queryMsgCategoryList: projectId => {
    return http.system.get(`message/category/queryList/${projectId}`, {}, { isLoading: true })
  },
  // 获取指定类型的消息列表
  queryMsgList: data => {
    return http.system.post(`common/message/list`, data, { isLoading: true })
  },
  // 获取消息分类列表 @author zhangshilong
  getCommonMessageList: () => {
    return http.system.get(`/message/category/getCommonMessageList`)
  },
  // 获取首页未读消息列表
  queryAnnouncement: data => {
    return http.epcPPP.post(`/announcement/index/list`, data)
  },
  // 消息详情
  getAnnouncement: id => {
    return http.epcPPP.get(`/announcement/get/${id}`)
  },
  // 标记全部已读 @author huanghaoqi
  markAllRead: data => {
    return http.epcPPP.post('/announcement/markAllRead', data, { isLoading: true })
  }
}
