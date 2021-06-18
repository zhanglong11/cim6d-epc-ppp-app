// 审批跳转API

import http from '../utils/http'
export const approvalApi = {
  // 查询审批跳转列表
  queryDefinitionList: data => {
    return http.admin.post('/route/definition/list', data)
  }
}
