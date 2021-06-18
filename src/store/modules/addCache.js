// 所有新建页面临时缓存
export default {
  state: {
    addLogCache: uni.getStorageSync('addLogCache') || '', // 新建施工日志缓存
    addInspectCache: uni.getStorageSync('addInspectCache') || '', // 新建质量检查缓存
    addSafeCache: uni.getStorageSync('addSafeCache') || '', // 新建安全检查缓存
    addLabourUserCache: uni.getStorageSync('addLabourUserCache') || '', // 劳务管理》新建人员缓存
    addEquipmentCache: uni.getStorageSync('addEquipmentCache') || '', // 设备管理》设备台账新建
    addEducationCache: uni.getStorageSync('addEducationCache') || '', // 安全培训
    addMaterialPurchaseOrderCache: uni.getStorageSync('addMaterialPurchaseOrderCache') || '', // 材料管理,新建采购单缓存
    cacheTimer: '', // 自动缓存定时器
    saveTime: uni.getStorageSync('AddTempSaveTime') || '' // 上次自动保存时间
  },
  mutations: {
    // 设置缓存
    setAddCache(state, { key, obj }) {
      state.cacheTimer = setInterval(() => {
        const time = new Date()
        const h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
        const m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
        const saveTime = `，保存时间 ${h}:${m}`
        uni.setStorageSync('AddTempSaveTime', saveTime)
        state.saveTime = saveTime
        uni.setStorageSync(key, obj)
        state[key] = obj
      }, 2000)
    },
    // 新建施工日志缓存
    setAddLogCache(state, obj) {
      this.commit('setAddCache', {
        key: 'addLogCache',
        obj
      })
    },
    // 新建质量检查缓存
    setAddInspectCache(state, obj) {
      this.commit('setAddCache', {
        key: 'addInspectCache',
        obj
      })
    },
    // 新建安全检查缓存
    setAddSafeCache(state, obj) {
      this.commit('setAddCache', {
        key: 'addSafeCache',
        obj
      })
    },
    // 劳务管理》新建人员缓存
    setAddLabourUserCache(state, obj) {
      this.commit('setAddCache', {
        key: 'addLabourUserCache',
        obj
      })
    },
    // 设备管理》设备台账新建
    setAddEquipmentCache(state, obj) {
      this.commit('setAddCache', {
        key: 'addEquipmentCache',
        obj
      })
    },
    //  安全培训
    setAddEducationCache(state, obj) {
      this.commit('setAddCache', {
        key: 'addEducationCache',
        obj
      })
    },
    //材料管理->新建采购单缓存
    setAddMaterialPurchaseOrderCache(state, obj) {
      this.commit('setAddCache', {
        key: 'addMaterialPurchaseOrderCache',
        obj
      })
    },
    // 关闭定时器
    closeCacheTimer(state) {
      clearInterval(state.cacheTimer)
    },
    // 关闭定时器并清除缓存数据
    clearCompanyTemp(state, key) {
      clearInterval(state.cacheTimer)
      uni.setStorageSync(key, '')
      state[key] = ''
    }
  }
}
