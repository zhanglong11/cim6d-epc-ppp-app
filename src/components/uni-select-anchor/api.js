import http from '@/utils/http'
// 通用
export const bimApi = {
  // 查询项目下的所有楼层结构
  queryFloorList: data => {
    return http.epcPPP.post(`/projectBim/project/floorList`, data)
  }
}
