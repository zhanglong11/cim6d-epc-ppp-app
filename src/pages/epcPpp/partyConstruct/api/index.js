import http from '@/utils/http'
// 通用
export default {
  // 获取首页数据
  getData: data => {
    return http.epcPPP.post('/partyBuilding/home/query', data, { isLoading: true })
  },
  //获取活动预告列表
  getActivityPreviewList: data => {
    return http.epcPPP.post('/partyBuilding/queryActivityPreviewPage', data, { isLoading: true })
  },
  //获取活动回顾列表
  getActivityList: data => {
    return http.epcPPP.post('/partyBuilding/queryActivityReviewPage', data, { isLoading: true })
  },
  //获取活动列表
  getActivity: data => {
    return http.epcPPP.post('/partyBuilding/activity/pageList', data, { isLoading: true })
  },
  //获取活动详情
  getActivityDetail: id => {
    return http.epcPPP.get(`/partyBuilding/activity/detail/${id}`, {}, { isLoading: true })
  },
  //获取党建要闻列表
  getNewsList: data => {
    return http.epcPPP.post('/partyBuilding/queryNewsPage', data, { isLoading: true })
  },
  //获取要闻详情
  getNewsDetail: id => {
    return http.epcPPP.get(`/partyBuildingNews/get/${id}`, {}, { isLoading: true })
  },
  //获取党建资料列表
  getDataList: data => {
    return http.epcPPP.post('/partyBuildingDocument/list', data, { isLoading: true })
  },
  //删除党建资料
  deleteData: id => {
    return http.epcPPP.get(`/partyBuildingDocument/delete/${id}`, {}, { isLoading: true })
  }
}
