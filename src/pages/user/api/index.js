import http from '@/utils/http'
export default {
  // 采购单删除
  getUserInfo: id => {
    return http.system.get(`/cim6d/system/user/get/${id}`)
    //return http.system.get(`/cim6d/system/user/current/get`)
  },
  updateUser: data => {
    return http.system.post('/cim6d/system/user/update', data, { isLoading: true })
  },
  changePassword: data => {
    return http.system.post('/cim6d/system/user/password/change', data, { isLoading: true })
  },
  // 我发起的-类型列表
  queryInstanceActivitiTypeList: () => {
    return http.epcPPP.get('/process/applied/' + uni.getStorageSync('projectId'))
  },
  // 我发起的
  queryInstanceActivitiList: data => {
    return http.process.post('/activiti/process/instance/started', {
      page: 1,
      rows: 200,
      projectId: uni.getStorageSync('projectId'),
      ...data
    })
  },
  // 待审核-类型列表
  queryTaskTypeList: () => {
    return http.epcPPP.get('/process/toAudit/' + uni.getStorageSync('projectId'))
  },
  // 待审核
  queryTaskList: data => {
    return http.process.post('/task/list', {
      page: 1,
      rows: 200,
      taskStatus: 0,
      projectId: uni.getStorageSync('projectId'),
      ...data
    })
  }
}
