import http from '../utils/http'
export default {
  //获取采购列表
  getPurchaseList: data => {
    return http.material.post('/equipmentPurchase/list', data, { isLoading: true })
  },
  //获取设备库存数
  queryStoreList: data => {
    return http.material.post(`/equipment/purchaseLeaseList`, data)
  },
  //添加采购申请
  addEquipmentPurchaseOrder: data => {
    return http.material.post(`/equipmentPurchase/add`, data)
  },
  //更新
  updateEquipmentPurchaseOrder: data => {
    return http.material.post(`/equipmentPurchase/submit`, data)
  },
  getEquipmentPurchaseOrderDetail: id => {
    return http.material.get(`/equipmentPurchase/get/${id}`)
  },
  // 采购单删除
  getPurchaseOrderDelete: id => {
    return http.material.get(`/equipmentPurchase/delete/${id}`)
  }
}
