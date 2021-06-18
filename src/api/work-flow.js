/*
 * @Author: 耿为刚 创建
 * @Date: 2020-05-25
 * @Last Modified by: gengweigang
 */

import http from '../utils/http'
export const workFlowApi = {
  // 获取工作流布局
  getProcessLayout: targetId => {
    return http.process.get(`/process-instance/${targetId}/diagram-layout`)
  },
  // 获取任务表单
  getTaskForm: taskId => {
    return http.process.get(`/activiti/process/definition/get/task/form/${taskId}`)
  },
  // 我的待办
  queryTaskList: data => {
    return http.process.post(`/task/list`, data)
  },
  // 审批
  completeTask: (taskId, data) => {
    return http.process.post(`/task/complete/${taskId}`, data)
  },
  // 获取所有审批意见
  getTaskList: taskId => {
    return http.process.get(`/task/list/${taskId}`)
  }
}
