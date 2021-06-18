<template>
  <div class="main is-white">
    <div class="header-wrapper">
      <h3>{{ fileInfo.fileName }}</h3>
      <div class="info">
        <span>{{ fileInfo.fileNameSuffix }}</span>
        <span>{{ fileInfo.fileSize | formatFileSize }}</span>
        <span class="ellipsis">{{ fileInfo.fileName }}</span>
      </div>
      <div class="baseView">
        <div class="img-wrapper">
          <div>
            <uni-preview :fileId="fileInfo.fileId"> </uni-preview>
          </div>
        </div>
      </div>
    </div>
    <div class="form-detail">
      <uni-form-item label="上传人员">
        <view>{{ fileInfo.creatorName }}</view>
      </uni-form-item>
      <uni-form-item label="文件描述">
        <view>{{ fileInfo.remark }}</view>
      </uni-form-item>
      <!-- <uni-form-item label="关联业务">
        <view>业务123</view>
      </uni-form-item>-->
      <uni-form-item label="上传时间">
        <view>{{ fileInfo.createTime }}</view>
      </uni-form-item>
      <!-- <uni-form-item label="更新时间">
        <view>{{ fileInfo.updateTime }}</view>
      </uni-form-item>-->
    </div>
    <uni-popup ref="popup" type="bottom">
      <div class="pop-wrapper">
        <div class="pop-header">
          <span class="name">{{ fileInfo.name }}</span>
          <span class="delete" @click="$refs.popup.close()">
            <uni-font-awesome type="fas fa-times" color="#999" size="30" style="margin-right: 5px"></uni-font-awesome>
          </span>
        </div>
        <div class="pop-button-list">
          <div class="item" @click="handleMove">
            <uni-font-awesome
              type="fas fa-folder-open"
              color="#999"
              size="30"
              style="margin-right: 5px"
            ></uni-font-awesome>
            <p>移动</p>
          </div>
          <div class="item" @click="handleRename">
            <uni-font-awesome type="fas fa-edit" color="#999" size="30" style="margin-right: 5px"></uni-font-awesome>
            <p>重命名</p>
          </div>
          <div class="item" @click="handleDelete">
            <uni-font-awesome
              type="fas fa-trash-alt"
              color="#999"
              size="30"
              style="margin-right: 5px"
            ></uni-font-awesome>
            <p>删除</p>
          </div>
        </div>
      </div>
    </uni-popup>
    <uni-popup ref="popupRename" type="dialog">
      <div class="dialog-wrapper">
        <uni-popup-dialog
          :value="fileInfo.fileName"
          type="input"
          mode="input"
          title="文件名称"
          message="成功消息"
          placeholder="请输入新的文件名称"
          :duration="0"
          :before-close="true"
          @close="renameClose"
          @confirm="renameConfirm"
        ></uni-popup-dialog>
      </div>
    </uni-popup>
  </div>
</template>

<script>
import Api from '@/api/document'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
export default {
  name: 'FileDetail',
  components: { uniPopupDialog },
  data() {
    return {
      fileId: '',
      fileInfo: {
        fileNameSuffix: ''
      }
    }
  },
  watch: {},
  onLoad(options) {
    this.fileId = options.fileId
  },
  onPullDownRefresh() {
    this.getFileDetail()
  },
  onNavigationBarButtonTap(obj) {
    this.showToast()
  },
  onBackPress() {},
  created() {
    this.getFileDetail()
  },
  methods: {
    async getFileDetail() {
      let res = await Api.getFileDetail(this.fileId)
      let res1 = await Api.getFileInfo(res.data.fileId)
      this.fileInfo = { ...res.data, ...res1.data }
    },
    showToast() {
      this.$refs.popup.open()
    },
    handleMove() {
      this.$refs.popup.close()
      this.$utils.toUrl(
        `/pages/document/select-document?allowLast=true&key=123&operateType=move&infoId=${this.fileId}&fileId=${this.fileInfo.fileId}&fileName=${this.fileInfo.fileName}&categoryId=${this.fileInfo.categoryId}`
      )
    },
    //重命名
    handleRename() {
      this.$refs['popupRename'].open()
    },
    renameClose() {
      this.$refs['popupRename'].close()
    },
    async renameConfirm(cb, val) {
      await Api.updateFile({ ...this.fileInfo, fileName: val })
      this.$refs['popupRename'].close()
      this.$refs.popup.close()
      await this.getFileDetail()
    },
    async handleDelete() {
      await Api.deleteFile(this.fileId)
      this.showToast('删除成功')
      uni.navigateBack()
    }
  }
}
</script>

<style scoped lang="less">
@import url('./file-detail.less');
</style>
