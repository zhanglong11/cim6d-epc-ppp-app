<template>
  <div class="main is-white">
    <div class="file-type">
      <div class="item" @click="uploadImage('album')">
        <image src="../../static/images/email.png" alt="" />
        <p>相册</p>
      </div>
      <div class="item" @click="uploadImage('camera')">
        <image src="../../static/images/email.png" alt="" />
        <p>拍照</p>
      </div>
      <div class="item" @click="uploadOther">
        <image src="../../static/images/email.png" alt="" />
        <p>本地文件</p>
      </div>
    </div>
    <div class="upload-list-title">
      上传记录
      <!-- <span @click="handleClear">
        <uni-font-awesome type="fas fa-trash-alt" color="#1c83d0" size="25" style="margin-right: 5px"></uni-font-awesome
        >清除</span
      > -->
    </div>
    <lFile ref="lFile" @up-success="uploadSuccess" />
    <scroll-view class="scroll-roll" scroll-y>
      <div style="position: relative;height: 100%">
        <FileList :list="list" @clickDoc="handleClickFile">
          <div class="form-link"></div>
        </FileList>
        <EmptyTemplate v-if="total === 0" />
      </div>
    </scroll-view>
  </div>
</template>

<script>
import Api from '@/api/document'
import FileList from '@/pages/document/components/FileList'
import { fileUrl } from '@/utils/http'
import lFile from '@/components/l-file/l-file.vue'
export default {
  name: 'UploadFile',
  components: { FileList, lFile },
  data() {
    return {
      list: [],
      type: 0,
      folderId: '',
      total: 0
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {},
  onLoad(options) {
    this.folderId = options.id
  },
  onPullDownRefresh() {
    this.getFileList()
  },
  onNavigationBarButtonTap(obj) {},
  onShow() {
    this.getFileList()
  },
  methods: {
    uploadImage(type) {
      uni.chooseImage({
        sourceType: [type],
        success: async chooseImageRes => {
          uni.showLoading({ title: '正在上传' })
          const { tempFilePaths, tempFiles } = chooseImageRes
          for (let i = 0; i < tempFilePaths.length; i++) {
            await uni
              .uploadFile({
                header: {
                  'x-access-token': this.token
                },
                name: 'file',
                url: fileUrl + '/file/commonFile/upload',
                filePath: tempFilePaths[i]
              })
              .then(([err, uploadFileRes]) => {
                let arr = tempFiles[i].path.split('/')
                let name = tempFiles[i].name || arr[arr.length - 1]
                const res = JSON.parse(uploadFileRes.data)
                this.addFile(name, res.data)
              })
              .catch(e => console.log(e))
              .finally(() => {
                uni.hideLoading()
              })
          }
          /* for (let filePath of tempFilePaths) {
            await uni
              .uploadFile({
                header: {
                  'x-access-token': this.token
                },
                name: 'file',
                url: fileUrl + '/file/commonFile/upload',
                filePath: filePath
              })
              .then(([err, uploadFileRes]) => {
                const res = JSON.parse(uploadFileRes.data)
                this.addFile(res.data)
              })
              .finally(() => {
                uni.hideLoading()
              })
          }*/
          uni.hideLoading()
        }
      })
    },
    //上传其他文件
    uploadOther() {
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: '/cim6d-file-storage-dev/file/commonFile/upload',
        name: 'file',
        header: {
          'x-access-token': this.token
        }
      })
    },
    uploadSuccess(res) {
      this.addFile(res.fileName, res.data.id)
    },
    //添加文件
    async addFile(fileName, fileId) {
      await Api.addFile({ categoryId: this.folderId, fileId: fileId, fileName: fileName })
      await this.getFileList()
    },
    //获取文件列表
    async getFileList() {
      let res = await Api.getFileList(this.folderId)
      this.list =
        res.data &&
        res.data.fileList &&
        res.data.fileList.map(item => {
          return {
            detailId: item.id,
            id: item.fileId,
            name: item.fileName,
            createTime: item.createTime,
            creatorName: item.creatorName
          }
        })
      this.total = this.list ? this.list.length : 0
    },
    //点击清除按钮
    async handleClear() {
      let ids = _.map(this.list, 'id')
      let result = await this.fly.file.post(`/file/manage/deleteBatch`, { ids }, { isLoading: true })
      if (result.code === 200) {
        this.$utils.showToast('删除成功')
        this.list = []
      }
    },
    handleClickFile(data) {
      this.$utils.toUrl(`/pages/document/file-detail?fileId=${data.detailId}`)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./upload-file.less');
</style>
