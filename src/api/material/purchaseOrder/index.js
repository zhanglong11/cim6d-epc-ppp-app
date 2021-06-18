import http from '@/utils/http'
export const Api = {
  //采购单列表
  getPurchaseOrderList: data => {
    return http.material.post(`materialPurchase/list`, data, { isLoading: true })
  },
  //采购单添加
  getPurchaseOrderAdd: data => {
    return http.material.post(`materialPurchase/save`, data)
  },
  //采购单添加并提交
  getPurchaseOrderSubmit: data => {
    return http.material.post(`materialPurchase/saveAndSubmit`, data)
  },
  // 添加选择列表数据
  getPurchaseOrderAddList: data => {
    return http.material.post(`material/list`, data)
  },
  // 采购单详情
  getPurchaseOrderDetail: id => {
    return http.material.get(`materialPurchase/get/${id}`)
  },
  // 采购单详情
  getPurchaseOrderDelete: id => {
    return http.material.post(`materialPurchase/delete/${id}`)
  },
  //材料申请列表
  getMaterialApplyList: data => {
    return http.material.post(`/materialApply/list`, {
      projectId: localStorage.getItem('projectId'),
      ...data
    })
  },

  //材料申请添加-施工
  getMaterialApplyConstructionAdd: data => {
    return http.material.post(`materialApply/constructionSave`, {
      projectId: localStorage.getItem('projectId'),
      ...data
    })
  },
  // 材料使用申请详情
  getMaterialApplyDetail: id => {
    return http.material.get(`/materialApply/get/${id}`)
  },
  //材料使用申请删除
  getMaterialApplyDelete: id => {
    return http.material.get(`/materialApply/delete/${id}`)
  },
  //材料申请添加并提交-施工
  getMaterialApplyConstructionUpdate: data => {
    return http.material.post(`materialApply/constructionUpdate`, {
      projectId: localStorage.getItem('projectId'),
      ...data
    })
  }


}
