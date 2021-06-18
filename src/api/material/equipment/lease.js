import http from '@/utils/http'
export const Api = {
  //设备租赁列表
  getLeaseList: data => {
    return http.material.post(`equipmentLease/list`, data, { isLoading: true })
  },
  //设备租赁添加保存到草稿
  getLeaseAdd: data => {
    return http.material.post(`equipmentLease/submit`, data)
  },
  //设备租赁添加并提交
  getLeaseSubmit: data => {
    return http.material.post(`equipmentLease/add`, data)
  },
  // 设备租赁选择列表数据
  getLeaseAddList: data => {
    return http.material.post(`equipment/purchaseLeaseList`, data)
  },
  // 设备租赁详情
  getLeaseDetail: id => {
    return http.material.get(`equipmentLease/get/${id}`)
  },
  // 设备租赁删除
  getLeaseDelete: id => {
    return http.material.get(`equipmentLease/delete/${id}`)
  }

}
