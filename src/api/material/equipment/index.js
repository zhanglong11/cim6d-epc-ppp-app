import http from '@/utils/http'

export default {
  //列表
  list: param => http.material.post(`/equipment/list`, param),

  //添加
  add: param => http.material.post(`/equipment/list`, param),

  //添加
  detail: id => http.material.get(`/equipment/get/${id}`)
}
