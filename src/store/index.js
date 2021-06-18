import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import project from './modules/project'
import geolocation from './modules/geolocation'
import systemConfig from './modules/systemConfig'
import schedule from './modules/schedule'
import projectEpc from './modules/projectEpc'
import getters from './getters'
import userPower from './modules/user-power' // 用户权限
import bim from './modules/bim' // bim缓存
import addCache from './modules/addCache' // 所有新建页面临时缓存

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    project,
    geolocation,
    userPower,
    systemConfig,
    schedule,
    projectEpc,
    bim,
    addCache
  },
  getters
})

export default store
