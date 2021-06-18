import http from '@/utils/http'
export const homeApi = {
  // 进度管理-项目进度面板 @author yangjiaqi
  getScheduleTaskPanel: projectId => {
    return http.epcPPP.get(`/qianjiang/ppp/schedule/task/panel/${projectId}`)
  },
  // 进度管理-查询未完成进度计划 @author yangjiaqi
  queryScheduleUnfinishedTaskList: data => {
    return http.schedule.post(`/task/unfinished/list`, data)
  },
  // 进度管理-领取任务 @author yangjiaqi
  getScheduleTaskReceive: taskId => {
    return http.schedule.get(`/task/receive/${taskId}`)
  }
}
