<template>
  <div>
    <ul v-if="edit" class="upload-button-list">
      <template v-if="isExcel">
        <li @click="uploadExcel">
          <p>+</p>
          <p>表格</p>
        </li>
      </template>
      <template v-else>
        <li v-if="uploadType.includes('image')" @click="uploadImage">
          <p>+</p>
          <p>图片</p>
        </li>
        <li v-if="uploadType.includes('video') || hasVideo" @click="uploadVideo">
          <p>+</p>
          <p>视频</p>
        </li>
        <li v-if="uploadType.includes('other')" @click="uploadOther">
          <p>+</p>
          <p>其它</p>
        </li>
      </template>
    </ul>
    <ul v-if="imageList.length" class="file-list">
      <li v-for="file in imageList" :key="file.id">
        <image :src="file.fileUrl + '?x-oss-process=style/w140_h140'" @click="previewImage(file)" />
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <ul v-if="videoList.length" class="video-list file-list">
      <li v-for="file in videoList" :key="file.id">
        <video :src="file.fileUrl" />
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <ul v-if="documentList.length" class="document-list file-list">
      <li v-for="file in documentList" :key="file.id">
        <image v-if="file.fileNameSuffix === 'pdf'" src="./assets/pdf.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'xls'" src="./assets/xls.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'xlsx'" src="./assets/xlsx.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'doc'" src="./assets/doc.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'docx'" src="./assets/doc.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'ppt'" src="./assets/ppt.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'psd'" src="./assets/psd.png" />
        <image v-else-if="file.fileNameSuffix === 'zip'" src="./assets/zip.png" />
        <image v-else-if="file.fileNameSuffix === 'rar'" src="./assets/zip.png" />
        <image v-else src="./assets/other.png" />
        <p class="name">{{ file.fileName }}</p>
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <lFile ref="lFile" :isExcel="isExcel" @up-success="uploadSuccess" />
  </div>
</template>
<script>
const imgReg = /(.*)\.(jpg|png|jepg|gif|webp)$/i
const videoReg = /(.*)\.(mp4|mkv|ogg|webm)$/i
const officeReg = /(.*)\.(doc|xls|xlsx|docx|ppt|pptx)$/i
const pdfTxtReg = /(.*)\.(pdf|txt)$/i
const documentReg = /(.*)\.(doc|xls|xlsx|docx|ppt|pptx|pdf|txt|rar|zip)$/i
const imgTypeReg = /(png|jpg|gif)/i
const videoTypeReg = /(mp4|mkv|ogg|mov|avi|webm)/i
import lFile from '@/components/l-file/l-file.vue'
import { fileUrl } from '@/utils/http'
import { without } from 'lodash'
export default {
  components: {
    lFile
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    // 是否可编辑
    edit: {
      type: Boolean,
      default: false
    },
    isExcel: {
      type: Boolean,
      default: false
    },
    hasVideo: {
      type: Boolean,
      default: false
    },
    // 上传类型
    uploadType: {
      type: String,
      default: 'image,video,other'
    },
    // 返回所有数据 [{name: 11, fileKey: 22}]
    isAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      listTemp: []
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    imageList() {
      return this.fileList.filter(e => e.fileType === 'image' || e.contentType.includes('image'))
    },
    videoList() {
      return this.fileList.filter(e => e.fileType === 'video' || e.contentType.includes('video'))
    },
    documentList() {
      return this.fileList.filter(e => e.fileType === 'document')
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.refresh()
      }
    }
  },
  methods: {
    async refresh() {
      if (!this.value) {
        this.fileList = []
      } else {
        let fileList = await this.fly.file.post('file/manage/list', this.value.split(',')).then(res => res.data)
        fileList.forEach(e => {
          e.fileNameSuffix = e.fileNameSuffix.toLowerCase()
          if (imgReg.test(e.fileUrl)) {
            e.fileType = 'image'
          } else if (videoReg.test(e.fileUrl)) {
            e.fileType = 'video'
          } else {
            e.fileType = 'document'
          }
        })
        this.fileList = fileList
      }
    },
    // 删除文件
    async remove(file) {
      let fileIds = this.value.split(',')
      let ids = _.map(this.listTemp, '')
      this.listTemp.splice(fileIds.indexOf(file.id), 1)
      if (this.isAll) {
        this.$emit('change', this.listTemp)
      }
      this.$emit('input', without(fileIds, file.id).join(','))
    },
    openDocument(file) {
      uni.showLoading({
        title: '正在加载文件'
      })
      uni.downloadFile({
        url: file.fileUrl,
        success: function(res) {
          uni.hideLoading()
          var filePath = res.tempFilePath
          uni.openDocument({
            filePath: filePath,
            success: function(res) {
              // console.log('打开文档成功')
            }
          })
        }
      })
    },
    // 预览
    previewImage(file) {
      uni.previewImage({
        current: file.fileUrl,
        urls: this.fileList.filter(e => imgTypeReg.test(e.fileNameSuffix)).map(e => e.fileUrl)
      })
    },
    // 上传文件
    async uploadFile(name, filePath) {
      await uni
        .uploadFile({
          header: {
            'x-access-token': this.token
          },
          name: 'file',
          url: fileUrl + '/file/commonFile/upload',
          filePath
        })
        .then(([err, uploadFileRes]) => {
          const res = JSON.parse(uploadFileRes.data)
          this.listTemp.push({
            name,
            fileKey: res.data
          })
          if (this.isAll) {
            this.$emit('change', this.listTemp)
          }
          this.$emit('input', this.value ? this.value + ',' + res.data : res.data)
        })
        .finally(() => {
          uni.hideLoading()
        })
    },
    // 图片上传
    uploadImage() {
      uni.chooseImage({
        success: async chooseImageRes => {
          uni.showLoading({ title: '正在上传' })
          const tempFilePaths = chooseImageRes.tempFilePaths
          for (let filePath of tempFilePaths) {
            let list = filePath.split('/')
            let name = list[list.length - 1]
            // console.log(2233, chooseImageRes, name)
            this.uploadFile(name, filePath)
          }
          uni.hideLoading()
        }
      })
    },
    // 上传视频
    uploadVideo() {
      uni.chooseVideo({
        success: chooseVideoRes => {
          uni.showLoading({ title: '正在上传' })
          const tempFilePath = chooseVideoRes.tempFilePath
          let list = tempFilePath.split('/')
          let name = chooseVideoRes.tempFile ? chooseVideoRes.tempFile.name : list[list.length - 1]
          // console.log(1111, chooseVideoRes, name)
          this.uploadFile(name, tempFilePath)
        }
      })
    },
    // 上传其他文件
    uploadOther() {
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: fileUrl + '/file/commonFile/upload',
        name: 'file',
        header: {
          'x-access-token': this.token
        }
      })
    },
    uploadExcel() {
      if (this.fileList.length >= 1) {
        this.$utils.showToast('只能选一个')
        return false
      }
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: fileUrl + '/file/commonFile/upload',
        name: 'file',
        header: {
          'x-access-token': this.token,
          type: '.xls,.xlsx'
        }
      })
    },
    // 上传其他文件成功
    uploadSuccess(res) {
      // console.log('上传其他文件成功', res)
      this.listTemp.push({
        name: res.fileName,
        fileKey: res.data.id
      })
      if (this.isAll) {
        this.$emit('change', this.listTemp)
      }
      this.$emit('input', this.value ? this.value + ',' + res.data.id : res.data.id)
      this.$emit('uploadListSuccess', res.data.id)
    }
  }
}
</script>
<style lang="less" scoped>
@import './uni-attachment.less';
</style>
