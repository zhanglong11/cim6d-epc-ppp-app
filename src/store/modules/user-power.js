import { roleApi } from '@/api/role'
import { workFlowApi } from '@/api/work-flow'
import { approvalApi } from '@/api/approval'
// 用户权限
const state = {
  power: uni.getStorageSync('power') || [], // 我的权限
  taskTodo: uni.getStorageSync('taskTodo') ? uni.getStorageSync('taskTodo').split(',') : [], // 我的待办
  decorationUser: [
    'be8b92183eea4ab795de3c40abdefbd8', // laotan
    '24954606100409521', // zhuangxiu
    '24955312622527406' // beichen
  ], // 精装修用户id集合
  // 待办跳转定义
  taskTodoPower: {
    material_supply_plan: '/pages/material/planList/detail', // 甲供材计划单
    material_supply_confirm_bill: '/pages/material/confirmation/detail' // 材料确认单
  },
  approvalRouter: uni.getStorageSync('approvalRouter') || {} // 审批路由
}

const mutations = {
  // 设置审批跳转缓存
  async setApprovalRouter(state, obj) {
    let params = {
      page: 1,
      rows: 200,
      type: 1,
      serviceCode: 'qianjiang-ppp' || this.state.project.projectType
    }
    const result = await approvalApi.queryDefinitionList(params)
    let datas = result.data.records || []
    let approvalRouter = {}
    datas.map(item => {
      approvalRouter[item.processDefinitionKey] = {
        pcRouteUrl: item.pcRouteUrl,
        appRouteUrl: item.appRouteUrl,
        processDefinitionName: item.processDefinitionName
      }
    })
    uni.setStorageSync('approvalRouter', approvalRouter)
    state.approvalRouter = approvalRouter
    console.log('设置审批缓存', datas, approvalRouter)
  },
  // 获取用户授权
  getPower(state, callBack = () => {}) {
    let projectId = this.state.project.projectId
    if (!projectId) {
      return
    }
    return new Promise((resolve, reject) => {
      roleApi
        .getAvailablePower(projectId)
        .then(response => {
          const { data } = response
          const power = []
          const findArray = array => {
            if (!array) {
              return
            }
            array.map(e => {
              power.push(e.powerKey)
              if (e.children) {
                findArray(e.children)
              }
            })
          }
          data.map(item => {
            findArray(item.children)
          })
          uni.setStorageSync('power', power)
          state.power = power
          callBack()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 清除用户权限
  clearPower(state) {
    state.power = []
    state.taskTodo = []
  },
  // 我的待办
  getTaskTodo(state, callBack = () => {}) {
    let params = {
      sortField: 'createTime',
      sortValue: 'desc',
      taskStatus: 0,
      projectId: this.state.project.projectId || '',
      page: 1,
      rows: 1000
    }
    return new Promise((resolve, reject) => {
      workFlowApi
        .queryTaskList(params)
        .then(response => {
          const { data } = response
          let records = data.records || []
          const taskTodo = []
          records.map(item => {
            taskTodo.push(item.targetId)
          })
          uni.setStorageSync('taskTodo', taskTodo.join(','))
          state.taskTodo = taskTodo
          callBack()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
const actions = {}

export default {
  state,
  mutations,
  actions
}
