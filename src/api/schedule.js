import http from '@/utils/http'
export default {
  getList() {
    return http.schedule.get('/construct/plan/taskList/' + uni.getStorageSync('projectId'))
  }
}
