import axios from '@/utils/http'
import treeForEach from '@/utils/treeForEach'
import _ from 'lodash'
import moment from 'moment'
import toTree from '@/utils/toTree'
import compareTaskList from '@/utils/compareTaskList'
import treeFind from '@/utils/treeFind'
import treeFilter from '@/utils/treeFilter'
export default {
  namespaced: true,
  state: {
    flatList: [],
    treeData: [],
    originList: []
  },
  mutations: {
    change(state, { flatList, treeData, originList }) {
      state.flatList = flatList
      state.treeData = treeData
      state.originList = originList
    }
  },
  actions: {
    async getList({ commit }) {
      let flatList, treeData, originList
      await axios.schedule.get('epc/plan/taskList/' + uni.getStorageSync('projectId')).then(res => {
        res.data = _.sortBy(res.data, 'planStartTime')
        originList = _.cloneDeep(res.data)
        flatList = res.data
        treeData = toTree(res.data, 'parentTaskUniqueId', 'planStartTime', 'taskUniqueId', true)
        calculateWbsCode(treeData)
      })
      commit('change', { flatList, treeData, originList })
    },
    async add({ commit, state, dispatch }, item) {
      item.taskUniqueId = _.max(state.flatList.map(e => e.taskUniqueId)) + 1 || 1
      let tempTreeData = _.cloneDeep(state.treeData)
      tempTreeData.push(_.omit(item, 'children'))
      let data = compareTaskList(tempTreeData, state.originList)
      await axios.schedule.post('epc/task/addOrUpdate', {
        ...data,
        projectId: uni.getStorageSync('projectId'),
        projectName: uni.getStorageSync('projectName')
      })
      dispatch('getList')
    },
    async remove({ commit, state, dispatch }, item) {
      let tempTreeData = _.cloneDeep(state.treeData)
      tempTreeData = treeFilter(tempTreeData, e => e.id !== item.id)
      let data = compareTaskList(tempTreeData, state.originList)
      await axios.schedule.post('epc/task/addOrUpdate', {
        ...data,
        projectId: uni.getStorageSync('projectId'),
        projectName: uni.getStorageSync('projectName')
      })
      dispatch('getList')
    },
    async edit({ commit, state, dispatch }, item) {
      let tempTreeData = _.cloneDeep(state.treeData)
      let target = treeFind(tempTreeData, e => e.taskUniqueId === item.taskUniqueId)
      Object.assign(target, item)
      calculateWbsCode(tempTreeData)
      let data = compareTaskList(tempTreeData, state.originList)
      await axios.schedule.post('epc/task/addOrUpdate', {
        ...data,
        projectId: uni.getStorageSync('projectId'),
        projectName: uni.getStorageSync('projectName')
      })
      dispatch('getList')
    },
    async calculateWbsCode({ state }, item) {
      let parent = treeFind(state.treeData, e => e.taskUniqueId === item.parentTaskUniqueId)
      let baseList = parent ? parent.children || [] : state.treeData
      let current = _.pick(item, ['planStartTime'])
      if (!current.planStartTime) current.planStartTime = '9999'
      const index =
        _.sortedIndexBy(
          baseList.filter(e => e.taskUniqueId !== item.taskUniqueId),
          current,
          e => e.planStartTime
        ) + 1
      if (parent) {
        return parent.wbsCode + '.' + index
      } else {
        return '' + index
      }
    }
  }
}
function calculateWbsCode(treeData) {
  treeForEach(treeData, (item, parent, index) => {
    if (!parent) {
      item.wbsCode = '' + (index + 1)
    } else {
      item.wbsCode = parent.wbsCode + '.' + (index + 1)
    }
  })
}
function calculateStatusText(list) {
  treeForEach(list, (item, parent, index) => {
    let PS = item.planStartTime.slice(0, 10)
    let PE = item.planEndTime.slice(0, 10)
    let today = moment().format('YYYY-MM-DD')
    if ([1, 2].includes(item.status)) {
      let AS = item.actualStartTime.slice(0, 10)
      if (item.status === 1) {
        if (AS > PS) {
          item.statusText = '延期开始'
        } else if (AS < PS) {
          item.statusText = '提前开始'
        } else {
          item.statusText = '正常开始'
        }
      } else if (item.status === 2) {
        let AE = item.actualEndTime.slice(0, 10)
        if (AE < PE) {
          item.statusText = '提前结束'
        } else if (AE > PE) {
          item.statusText = '延期结束'
        } else {
          item.statusText = '正常结束'
        }
      }
    } else {
      if (today > PS) {
        item.statusText = '已延期'
      } else {
        item.statusText = '未开始'
      }
    }
  })
}
