import { schedule } from '@/utils/http'
export default {
  getScheduleYearAnalyzeTable() {
    return Promise.resolve({
      data: [
        {
          name: 'hhh'
        }
      ]
    })
  },

  //导入进度文件
  importScheduleFile(formData) {
    return schedule.post('plan/import', formData)
  },
  //进度文件列表
  getSchedulePlanList(body) {
    return schedule.post('plan/list', { ...body, projectId: wx.getStorageSync('projectId') })
  },
  //删除进度文件
  removeSchedulePlanById(id) {
    return schedule.get('plan/delete/' + id)
  },
  // 进度管理-查询进度任务列表 @author yangjiaqi
  getScheduleTaskList(body) {
    return schedule.post('task/list', { ...body, projectId: wx.getStorageSync('projectId') })
  },
  // 进度管理-查询进度任务列表 @author yangjiaqi
  getScheduleTaskById(id) {
    return schedule.get('task/get/' + id)
  },

  // 进度管理-查询个人进度计划 @author yangjiaqi
  queryScheduleTaskOwnList: data => {
    return schedule.post('/task/own/list', data)
  },
  // 进度管理-领取任务 @author yangjiaqi
  getScheduleTaskReceive: taskId => {
    return schedule.get(`/task/receive/${taskId}`)
  },
  // 进度管理-分配任务 @author yangjiaqi
  distributionScheduleTask: data => {
    return schedule.post('/task/distribution', data)
  },
  // 进度管理-查看分配记录 @author yangjiaqi
  recordDistributionTask: taskId => {
    return schedule.get(`/task/distribution/record/${taskId}`)
  },
  // 进度管理-开始任务 @author yangjiaqi
  startScheduleTask: taskId => {
    return schedule.get(`/task/start/${taskId}`)
  },
  // 进度管理-结束任务 @author yangjiaqi
  finishScheduleTask: taskId => {
    return schedule.get(`/task/finish/${taskId}`)
  },
  // 进度管理-进度任务确认 @author yangjiaqi
  confirmTask: data => {
    return schedule.post('/task/confirm', data)
  },
  // 延期解决方案-提交 @author yangjiaqi
  delayProgram: data => {
    return schedule.post('/delayProgram/submit', data)
  },

  // 进度工期变更-提交 @author yangjiaqi
  changeDurationTask: data => {
    return schedule.post('/task/duration/change', data)
  },
  // 进度工期变更-关联任务列表 @author yangjiaqi
  queryTaskLink: taskId => {
    return schedule.get(`/task/link/${taskId}`)
  },

  //进度管理-提交进度文件 @author yangjiaqi
  submitSchedulePlan(data) {
    return schedule.post('plan/submit', { ...data, projectId: wx.getStorageSync('projectId') })
  },
  //进度分析列表
  getScheduleAnalyzeList(data) {
    return schedule.post('task/analysis/list', { ...data, projectId: wx.getStorageSync('projectId') })
  },
  // 进度周期分析查询
  getPeriodAnalyze(data) {
    return schedule.post('task/cycle/list', { ...data, projectId: wx.getStorageSync('projectId') })
  },
  //进度管理-进度周期分析查询(按单位分组) @author yangjiaqi
  getCompanyPeriodAnalyze(data) {
    return schedule.post('task/company/cycle/list', { ...data, projectId: wx.getStorageSync('projectId') })
  },
  //进度管理-进度年度分析查询 @author yangjiaqi
  getYearCompareAnalyze(data) {
    return schedule.post('task/year/list', { ...data, projectId: wx.getStorageSync('projectId') })
  },

  // 获取任务关联的构件
  getTaskBindBimById(id) {
    return schedule.get('bim/get/' + id)
  }, // 进度关联模型
  scheduleTaskBindBim(body) {
    return schedule.post('bim/bind', body)
  },
  // 进度取消关联模型
  scheduleTaskUnBindBim(taskId) {
    return schedule.get('bim/unBind/' + taskId)
  }
}
