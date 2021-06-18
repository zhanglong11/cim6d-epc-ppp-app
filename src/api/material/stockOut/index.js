import http from '@/utils/http'
export const Api = {
  //出库单列表
  getStackOutList: data => {
    return http.material.post(`materialOutput/page`, data, { isLoading: true })
  },
  //出库单添加
  getStackOutAdd: data => {
    return http.material.post(`materialOutput/add`, data)
  },
  //出库单详情
  getStackOutDetail: id => {
    return http.material.get(`materialOutput/get/${id}`)
  }
}
