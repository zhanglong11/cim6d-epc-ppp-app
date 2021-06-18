import userApi from '@/api/user'
import toTree from '@/utils/toTree'
import treeForEach from '@/utils/treeForEach'
export default {
  state: {
    projectId: uni.getStorageSync('projectId') || '', // 项目id
    projectName: uni.getStorageSync('projectName') || '', // 项目名字
    projectType: uni.getStorageSync('projectType') || '', // 项目类型
    weatherInfo: uni.getStorageSync('weatherInfo') || {},
    userList: uni.getStorageSync('userList') || [],
    departmentList: uni.getStorageSync('departmentList') || [], //项目下的部门
    departmentTreeList: uni.getStorageSync('departmentTreeList') || [], //项目下的部门树形结构
    departmentUserList: uni.getStorageSync('departmentUserList') || [], //项目下的部门、人员树
    companyDepartmentList: uni.getStorageSync('companyDepartmentList') || [], //公司下的部门
    messageTypes: uni.getStorageSync('messageTypes') || {}, // 消息类型缓存
    projectDetail: uni.getStorageSync('projectDetail') || {} ,// 项目详情
    participantCompanyList: uni.getStorageSync('participantCompanyList') || []
  },
  mutations: {
    // 缓存项目信息
    setSelectedProjectInfo(state, data) {
      uni.setStorageSync('projectId', data.id)
      uni.setStorageSync('projectName', data.name)
      uni.setStorageSync('projectType', data.type)
      state.projectId = data.id
      state.projectName = data.name
      state.projectType = data.type
    },
    setSelectedProjectDetail(state, data) {
      // console.log('projectDetail',data)
      uni.setStorageSync('projectDetail', data)
      state.projectDetail = data
    },
    // 缓存天气信息
    setWeatherInfo(state, data) {
      uni.setStorageSync('weatherInfo', data)
      state.weatherInfo = data
    },
    // 清除项目信息
    clearProject(state) {
      state.projectId = ''
      state.projectName = ''
      state.projectType = ''
      state.weatherInfo = {}
    },
    changeUserList(state, list) {
      uni.setStorageSync('userList', list)
      state.userList = list
    },
    changeDepartmentList(state, list) {
      uni.setStorageSync('departmentList', list)
      let TreeData = toTree(list, 'parentId')
      uni.setStorageSync('departmentTreeList', TreeData)
      state.departmentList = list
      state.departmentTreeList = TreeData
    },
    changeDepartmentUserList(state, list) {
      uni.setStorageSync('departmentUserList', list)
      state.departmentUserList = list
    },
    changeCompanyDepartmentList(state, list) {
      uni.setStorageSync('companyDepartmentList', list)
      state.companyDepartmentList = list
    },
    // 设置消息类型缓存
    setMessageType(state, types) {
      uni.setStorageSync('messageTypes', types)
      state.messageTypes = types
    },

    //修改参项单位列表
    changeParticipantCompanyList(state, list) {
      uni.setStorageSync('participantCompanyList', list)
      state.participantCompanyList = list
    }
  },
  actions: {
    getUserList({ commit }, projectId) {
      userApi.getUserList(projectId).then(res => {
        let list = res || []
        let userList = []
        // console.log(111, list)
        treeForEach(list, (e, parent) => {
          e.label = e.name
          if (e.type === 2) {
            e.organId = parent.id
            e.organName = parent.name
          }
          if (e.type === 3) {
            e.organId = parent && parent.organId
            e.organName = parent && parent.organName
            e.roleId = parent.id
            e.roleName = parent.name
            userList.push(e)
          }
        })
        commit('changeUserList', userList)
        commit('changeDepartmentUserList', list[0]?.children ?? [])
      })
    },
    getDepartmentList({ commit }) {
      userApi.getDepartmentList().then(departmentList => {
        departmentList.map(e => {
          if (e.level === 2) {
            e.parentId = null
          }
        })
        commit('changeDepartmentList', departmentList)
      })
    },
    getCompanyDepartmentList({ commit }) {
      userApi.getCompanyDepartmentList([]).then(departmentList => {
        commit('changeCompanyDepartmentList', departmentList)
      })
    },
    //获取项目参与方单位
    async getParticipantCompanyList({ commit }, projectId) {
      let res = await userApi.getParticipantCompanyList(projectId)
      let Arr = []
      res.data &&
        res.data.map(item => {
          Arr = [...Arr, ...item.participantCompanyList]
        })
      Arr.forEach(item => {
        item.value = item.id
        item.label = item.name
      })
      commit('changeParticipantCompanyList', Arr)
    }
  }
}
