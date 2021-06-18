<template>
  <div class="main is-white">
    <div class="header-wrapper">
      <h3>{{ fileInfo.fileName }}</h3>
      <div class="info">
        <span>{{ fileInfo.fileNameSuffix }}</span>
        <span>{{ fileInfo.fileSize | formatFileSize }}</span>
      </div>
      <div class="baseView">
        <div class="img-wrapper">
          <div>
            <uni-preview hasDownload :fileId="fileInfo.id" />
          </div>
        </div>
      </div>
    </div>
    <div class="form-detail">
      <uni-form-item label="上传人员">
        <view>{{ fileInfo.creatorName }}</view>
      </uni-form-item>
      <uni-form-item label="上传时间">
        <view>{{ fileInfo.createTime }}</view>
      </uni-form-item>
    </div>
  </div>
</template>

<script>
import Api from './api'
export default {
  name: 'detail',
  // import引入的组件
  components: {},
  data() {
    return {
      fileId: '',
      fileInfo: {
        fileNameSuffix: ''
      }
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  onLoad(options) {
    this.fileId = options.fileId
  },
  // 方法集合
  methods: {
    //刷新
    async refresh() {
      // let res = await Api.getFileDetail(this.fileId)
      let res = await Api.getFileInfo(this.fileId)
      this.fileInfo = res.data
    }
  }
}
</script>

<style scoped lang="less">
@import url('./detail');
</style>
