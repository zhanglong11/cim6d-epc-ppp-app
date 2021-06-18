import http from '../utils/http'
// 通用
export const bimAPI = {
  // // 获取下载地址
  // getBimModel: currentEntityId => {
  //   let entityIdArray = currentEntityId.split('_')
  //   return http.dataProcess.get(`/bim/bimModel/${entityIdArray[0]}/selectFileUrl/${entityIdArray[1]}`)
  // },
  // 获取下载地址
  getBimModel: currentEntityIds => {
    if (!currentEntityIds) {
      return
    }
    let list = currentEntityIds.split(',')
    let entityIdArray = []
    list.map(item => {
      let newItem = item.split('_')
      entityIdArray.push({
        modelId: newItem[0],
        modelVersion: newItem[1]
      })
    })
    return http.dataProcess.post(`/bim/bimModel/selectFileUrl`, entityIdArray)
  },
  // 获取多模型数据
  getBimModelList: () => {
    return http.bimModel.get('bimModel.json')
  },
  // 获取单体数据
  getBimFdhtSpace: entityId => {
    return http.dataProcess.get(`/noToken/old/basic/commonFile/get/fdht/bim_${entityId}/space.json`)
  },
  // 获取bim树
  queryBimTree: entityId => {
    return http.system.post(`/bim/version/entity/tree/${entityId}`, {})
  },
  // 通过项目获取单体数据
  queryBimTreeByProject: projectId => {
    return http.epcPPP.post(`/projectBim/${projectId}/bimTree`)
  },
  // 获取构件数据
  getBimFdhtSpecial: entityId => {
    return http.dataProcess.get(`/noToken/old/basic/commonFile/get/fdht/bim_${entityId}/special.json`)
  },
  // 获取质量问题
  queryQualityList: data => {
    return http.safety.post(`/synergy/quality/checkPage`, data)
  },
  // 获取安全问题
  querySafetyList: data => {
    return http.safety.post(`/safety/bim/check/view`, data)
  },
  // 获取构件id
  qualityProblemBimBind: data => {
    return http.safety.post(`/qualityProblemBimBind/selectByTargetId`, data)
  },
  // 获取BIM树
  getBimNewTree: projectId => {
    return http.system.get(`/project/bim/newTree/activite/${projectId}`)
  },
  // 获取guid缓存
  selectCache: data => {
    return http.synergy.post(`/bimRelation/select/cache`, data)
  },
  // 删除guid缓存
  deleteCache: data => {
    return http.synergy.post(`/bimRelation/delete/cache`, data)
  }
}
