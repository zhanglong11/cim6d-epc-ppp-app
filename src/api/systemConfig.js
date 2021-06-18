import http from '@/utils/http'
export default {
  getArgTree(data) {
    return http.global.post('cim6d/arg/tree',data).then(res => res.data)
  }
}
