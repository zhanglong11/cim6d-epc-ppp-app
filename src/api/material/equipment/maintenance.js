import http from '@/utils/http'

export default {
  //列表
  list: param => http.material.post(`/equipmentMaintenance/list`, param),

  //添加
  add: param => http.material.post(`/equipmentMaintenance/list`, param),

  //添加
  detail: id => http.material.get(`/equipmentMaintenance/get/${id}`),

  //计划详情
  planDetail: id => http.material.get(`/equipmentMaintenancePlan/get/${id}`),

  //更新状态
  updateStatus: param => http.material.post(`/equipmentMaintenance/updateStatus`, param)
}
