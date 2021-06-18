import api from '@/api/schedule'
import treeForEach from '@/utils/treeForEach'
import _ from 'lodash'
import moment from 'moment'
export default {
  namespaced: true,
  state: {
    list: [],
    yearList: [],
    detail: {}
  },
  mutations: {
    changeDetail(state, data) {
      state.detail = data
    },
    changeList(state, list) {
      state.list = list
    },
    changeYearList(state, list) {
      state.yearList = list
    }
  },
  actions: {
    async getList({ commit }) {
      api.getList().then(res => {
        calculateStatusText(_.get(res, 'data.taskList', []))
        commit('changeDetail', _.get(res, 'data', {}))
        commit('changeList', _.get(res, 'data.taskList', []))
        commit('changeYearList', generateYearList(_.get(res, 'data.taskList', [])))
      })
    }
  }
}

/**
 * 计算状态文字  e.g 提前开始、提前结束
 * @param list 任务列表
 */
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

/**
 * 计算年月集合和完成任务数
 * @param list 任务列表
 * @returns {[]}
 */
function generateYearList(list) {
  let yearList = []
  function c(start, end, item) {
    const startYear = moment(start).year()
    const startMonth = moment(start).month()
    const endYear = moment(end).year()
    const endMonth = moment(end).month()
    let currentYear = startYear
    let currentMonth = startMonth
    while (!(currentYear > endYear || (currentYear === endYear && currentMonth > endMonth))) {
      let targetYear = _.find(yearList, { year: currentYear })
      if (!targetYear) {
        targetYear = {
          year: currentYear,
          count: 0,
          doneCount: 0,
          planDuration: 0,
          actualDuration: 0,
          children: []
        }
        yearList.push(targetYear)
      }
      targetYear.count += 1
      targetYear.planDuration += item.planDuration || 0
      targetYear.actualDuration += item.actualDuration || 0
      let targetMonth = _.find(targetYear.children, { month: currentMonth })
      if (!targetMonth) {
        targetMonth = {
          month: currentMonth,
          count: 0,
          planDuration: 0,
          actualDuration: 0,
          doneCount: 0
        }
        targetYear.children.push(targetMonth)
      }
      targetMonth.count += 1
      if (item.status === 2) {
        targetYear.doneCount += 1
        targetMonth.doneCount += 1
      }
      targetMonth.planDuration += item.planDuration || 0
      targetMonth.actualDuration += item.actualDuration || 0

      if (currentMonth + 1 === 12) {
        currentYear += 1
        currentMonth = 0
      } else {
        currentMonth += 1
      }
    }
  }

  _.sortBy(list, 'planStartTime').forEach(e => {
    c(e.planStartTime, e.planEndTime, e)
  })
  yearList.forEach(e => {
    e.label = e.year + '年进度计划'
    e.children = e.children.map(({ month, count, doneCount, planDuration, actualDuration }) => ({
      label: e.year + '年' + (month + 1) + '月计划',
      year: e.year,
      count,
      doneCount,
      month,
      planDuration,
      actualDuration
    }))
  })
  return yearList
}
