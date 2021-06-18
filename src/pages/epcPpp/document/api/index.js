import http from '@/utils/http'

export default {
  folderList: data =>
    http.epcPPP.post(
      '/document/firstLevel/query',
      {
        projectId: wx.getStorageSync('projectId'),
        ...data
      },
      { isLoading: true }
    ),

  subList: data =>
    http.epcPPP.post('/document/subLevel/appQuery', {
      projectId: wx.getStorageSync('projectId'),
      ...data
    }),

  //添加
  add: data =>
    http.epcPPP.post('/document/add', {
      projectId: wx.getStorageSync('projectId'),
      ...data
    }),

  //编辑
  update: data =>
    http.epcPPP.post('/document/update', {
      projectId: wx.getStorageSync('projectId'),
      ...data
    }),
  //详情
  detail: id => http.epcPPP.get(`/document/detail/${id}`),

  //删除根目录
  removeRoot: id => http.epcPPP.get(`/document/firstLevel/delete/${id}`),

  //删除其他目录
  removeChild: id =>
    http.epcPPP.post(`/document/otherLevel/delete`, {
      projectId: wx.getStorageSync('projectId'),
      ...id
    }),

  //文件详情
  getFileDetail: id => {
    return http.construction.get(`/buildInfo/file/detail/${id}`, {})
  },

  getFileInfo: id => {
    return http.file.get(`/file/manage/get/${id}`, {})
  }
}
