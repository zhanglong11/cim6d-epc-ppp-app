/*
 * @Author: 耿为刚 创建
 * @Date: 2020-05-25
 * @Last Modified by: gengweigang
 */

import http from '../utils/http'
export const roleApi = {
  // 获取用户可用权限
  getAvailablePower: projectId => {
    return http.system.get(`/cim6d/system/project/power/available/${projectId}`)
  }
}
