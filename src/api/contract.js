import http from '../utils/http'
const baseURL = '/cim6d-construction'
export default {
  //添加合同
  addContract: data => {
    return http.construction.post('/contractBaseinfo/add', data)
  },
  getContractList: data => {
    return http.construction.post('/contractBaseinfo/list', data, { isLoading: true })
  },
  deleteContractById: id => {
    return http.construction.post(`/contractBaseinfo/delete/${id}`)
  },
  getContractById: id => {
    return http.construction.get(`/contractBaseinfo/get/${id}`)
  },
  updateContractById: data => {
    return http.construction.post(`/contractBaseinfo/update`, data)
  },
  /*  //添加合同清单信息
  addOrderFile: data => {
    return http.construction.post(`/contractBaseinfo/upload/inventory`, data, {
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  },*/
  //添加合同清单信息
  addOrderFile: data => {
    return http.construction.post(`/contractBaseinfo/app/upload/inventory`, data)
  },
  // 获取合同清单
  getContractInventoryPurchase: data => {
    return http.construction.post('/contractInventoryPurchase/list', data)
  },
  //导出租赁采购清单
  exportContractInventoryPurchase: data => {
    return http.construction.post('/contractBaseinfo/export/inventory', data, {
      responseType: 'blob'
    })
  }
}
