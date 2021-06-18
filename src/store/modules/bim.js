// bim缓存处理
import { bimAPI } from '@/api/bim.js'
export default {
  state: {
    selectGuidNum: 0, // 选择的guid数量
    selectGuid: [], // 缓存选择的guid
    uUid: ''
  },
  mutations: {
    // 缓存guid
    setGuid(state, obj) {
      let num = 0
      obj.data.map(e => {
        num += e.componentIdList ? e.componentIdList.length : 0
      })
      state.selectGuidNum = num
      state.selectGuid = obj.data
      state.uUid = obj.uUid
    },
    // 清除guid
    clearGuid(state) {
      state.selectGuidNum = 0
      state.selectGuid = []
      state.uUid = ''
    }
  },
  actions: {
    // 清除guid -- 异步
    clearGuidCache({ commit }, uUid) {
      bimAPI.deleteCache([uUid]).then(res => {
        commit('clearGuid')
      })
    }
  }
}
