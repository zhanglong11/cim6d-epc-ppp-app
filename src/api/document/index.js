import http from '@/utils/http'

export default {
  addFolder: data => {
    return http.construction.post('/buildInfo/save', data, { isLoading: true })
  },
  //上传文件
  addFile: data => {
    return http.construction.post('/buildInfo/file/save', data, { isLoading: true })
  },
  // 获取文件加列表
  getFolderList: data => {
    return http.construction.post('/buildInfo/queryList', data, { isLoading: true })
  },
  getFileList: data => {
    return http.construction.get(`/buildInfo/detail/${data}`, {}, { isLoading: true })
  },
  getFileDetail: id => {
    return http.construction.get(`/buildInfo/file/detail/${id}`, {})
  },
  getFileInfo: id => {
    return http.file.get(`/file/manage/get/${id}`, {})
  },
  // 删除文件
  deleteFile: id => {
    return http.construction.post(`/buildInfo/file/${id}/delete`, {}, { isLoading: true })
  },
  //更新文件
  updateFile: data => {
    return http.construction.post('/buildInfo/file/update', data, { isLoading: true })
  },
  //搜索文件
  searchFileList: data => {
    return http.construction.post('/buildInfo/queryList', data, { isLoading: true })
  }
}
