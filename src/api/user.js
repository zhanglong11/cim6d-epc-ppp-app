import http from '../utils/http'

export default {
  /**
   * 获取项目下的人员列表
   * @param projectId
   * @returns {Array}
   */
  getUserList(projectId) {
    return http.system.post('/cim6d/system/project/organ/query', { projectId }).then(res => res.data)
  },
  /**
   * 获取用户详情
   * @param userId
   * @returns {Object}
   */
  getUser(userId) {
    return http.system.get('/cim6d/system/user/get/' + userId).then(res => res.data)
  },
  /**
   * 获取项目下的部门列表
   * @param body
   * @returns {*}
   */
  getDepartmentList(body = {}) {
    body = { projectId: uni.getStorageSync('projectId'), ...body, typeList: [1] }
    return http.system.post('/projectOrgan/treeList', body).then(res => res.data || [])
  },
  getCompanyDepartmentList(body = {}) {
    return http.system.post('/cim6d/system/department/list', []).then(res => res.data || [])
  },
  getParticipantCompanyList(projectId) {
    return http.system.get(`/project/participant/company/list/${projectId}`)
  }
}
