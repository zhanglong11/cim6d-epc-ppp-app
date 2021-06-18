import Fly from 'flyio/dist/npm/wx'
import { getToken } from './auth'
import utils from './utils'
import store from '../store'
import { isArray } from 'lodash'
const flyService = baseURL => {
  const fly = new Fly()
  // 接口地址配置
  fly.config.baseURL = baseURL
  fly.config.timeout = 10000
  const toLogin = function () {
    // store.commit('user/login')
  }
  // 添加拦截器
  fly.interceptors.request.use((request, promise) => {
    // 是否显示加载中
    if (request.isLoading) {
      request.clock = setTimeout(() => {
        request.isInLoading = true
        //utils.showLoading()
      }, 500)
    }
    request.headers = {
      'content-type': 'application/json'
    }
    const token = getToken()
    // 免登录临时token
    if (token) {
      // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      request.headers['x-access-token'] = token
    }
    const authParams = {
      // 公共参数
    }

    if (!isArray(request.body)) {
      request.body = {
        ...request.body,
        ...authParams
      }
    }
    return request
  })
  fly.interceptors.response.use(
    response => {
      if (response.request.clock) {
        clearTimeout(response.request.clock)
        if (response.request.isInLoading) {
          utils.hideLoading()
        }
      } else if (response.request.isLoading) {
        utils.hideLoading()
      }
      uni.stopPullDownRefresh()
      // token失效
      if (response.data.code === 1000) {
        toLogin()
        return Promise.reject(response)
      }
      if (response.data.code === 200) {
        return response.data
      } else {
        utils.showToast(response.data.message || '系统开小差了')
        return Promise.reject(response)
      }
    },
    err => {
      if (err.request.clock) {
        clearTimeout(err.request.clock)
        if (err.request.isInLoading) {
          utils.hideLoading()
        }
      } else if (err.request.isLoading) {
        utils.hideLoading()
      }
      utils.showToast('网络异常请稍后再试')
      uni.stopPullDownRefresh()
    }
  )
  return fly
}
let baseUrl = ''
let bimModelUrl = ''
let dataProcessingUrl = '/dataProcessing'
// 配置请求基地址
// #ifdef MP
baseUrl = 'http://152.136.120.203:22222' //http://172.16.10.26:22222
bimModelUrl = 'http://luoyang.gim6d.com:18905'
dataProcessingUrl = 'http://luoyang.gim6d.com:18911/dataProcessing'
// #endif
export let urlSuffix = process.env.VUE_APP_BASE_API
// urlSuffix = '-test'

// 配置请求基地址
// #ifdef APP-PLUS
baseUrl = 'http://152.136.120.203:22222' // http://172.16.10.123:22222 //http://152.136.120.203:22222
bimModelUrl = 'http://ly.gim6d.com:8911' // http://ly.gim6d.com:8911
dataProcessingUrl = 'http://ly.gim6d.com:8911' // http://ly.gim6d.com:8911
urlSuffix = '-dev'
// #endif
baseUrl = 'http://172.16.10.123:22222'
urlSuffix = '-dev'
export const dataProcess = `/cim6d-bim-light${urlSuffix}`
const http = flyService(`${baseUrl}/cim6d-construction${urlSuffix}`)
http.system = flyService(`${baseUrl}/cim6d-system${urlSuffix}`)
http.admin = flyService(`${baseUrl}/cim6d-admin${urlSuffix}`)
http.global = flyService(`${baseUrl}/cim6d-global${urlSuffix}`)
http.file = flyService(`${baseUrl}/cim6d-file-storage${urlSuffix}`)
http.inspect = flyService(`${baseUrl}/cim6d-construction${urlSuffix}`)
http.construction = flyService(`${baseUrl}/cim6d-construction${urlSuffix}`)
http.safety = flyService(`${baseUrl}/cim6d-quality-safety${urlSuffix}`)
http.labour = flyService(`${baseUrl}/cim6d-construction${urlSuffix}/labour`)
http.labourSafety = flyService(`${baseUrl}/cim6d-construction${urlSuffix}/safety`)
http.process = flyService(`${baseUrl}/cim6d-process${urlSuffix}`) // 工作流相关
http.dataProcess = flyService(`${baseUrl}${dataProcess}`) // bim相关 // /cim6d-data-processing
http.bimModel = flyService(`${bimModelUrl}/app-bim${urlSuffix}`) // bim相关
// http.material = flyService(`${baseUrl}/cim6d-sun-material-equipment${urlSuffix}`) // 材料管理=孙世豪
http.material = flyService(`${baseUrl}/cim6d-material-equipment${urlSuffix}`) // 材料管理
http.schedule = flyService(`${baseUrl}/cim6d-qianjiang-ppp${urlSuffix}/qianjiang/ppp/schedule`) // 进度管理
http.synergy = flyService(`${baseUrl}/cim6d-bim-synergy${urlSuffix}`) //任务数统计信息
http.log = flyService(`${baseUrl}/cim6d-construction${urlSuffix}`) //施工日志
http.epcPPP = flyService(`${baseUrl}/cim6d-qianjiang-ppp${urlSuffix}`) //潜江ppp

export default http
export const fileUrl = `${baseUrl}/cim6d-file-storage${urlSuffix}` // uni.upload 只能使用绝对路径
export const schedule = http.schedule
