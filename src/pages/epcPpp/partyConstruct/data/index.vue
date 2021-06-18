<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <uni-swipe-action>
          <uni-swipe-action-item
            v-for="(item, index) of list"
            :key="item.id"
            class="dataItem"
            :class="{ isFirst: index === 0 }"
            :options="options"
            @click="onClick($event, item)"
          >
            <view class="imageContainer">
              <image :src="item.imgSrc"></image>
            </view>
            <view class="info">
              <view class="title">{{ item.name }}</view>
              <view class="bottom">
                <span>{{ item.creatorName }}</span>
                <span>{{ item.createTime }}</span>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <EmptyTemplate v-if="total === 0" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">文件类型</h6>
        <uni-checkbox-button-group v-model="drawerForm.fileType" hasAll :options="fileTypeList" />
        <h6 class="label">上传者所属单位</h6>
        <uni-checkbox-button-group v-model="drawerForm.partyMemberCompanyId" hasAll :options="participantCompanyList" />
        <!--    <h6 class="label">上传者所属部门</h6>
        <uni-checkbox-button-group
          v-model="drawerForm.partyMemberDepartmentId"
          hasAll
          :options="departmentList"
        ></uni-checkbox-button-group>-->
        <h6 class="label">上传日期</h6>
        <uni-date-picker v-model="drawerForm.date" mode="range"></uni-date-picker>
      </div>
    </uni-drawer-custom>
    <uni-popup ref="popup" type="center">
      <uni-popup-dialog
        type="warn"
        content="是否删除该资料?"
        :duration="2000"
        @confirm="handleDeleteItem"
      ></uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="downloadPopup" type="center">
      <uni-popup-dialog
        type="warn"
        content="是否下载该资料?"
        :duration="2000"
        @confirm="handleDownloadItem"
      ></uni-popup-dialog>
    </uni-popup>
    <!-- <web-view
      :src="
        `${$utils.webBimUrl}/web-view/html/schedule.html` +
        '?baseUrl=' +
        $utils.bimBaseUrl +
        '&projectId=' +
        projectId +
        '&token=' +
        token +
        '&urlSuffix=' +
        urlSuffix
      "
    ></web-view>-->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from '@/pages/epcPpp/partyConstruct/api'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import fileImage from '@/lib/fileImage'
import { urlSuffix } from '@/utils/http'
const imgReg = /(.*)\.(jpg|png|jepg|gif|webp)$/i
const videoReg = /(.*)\.(mp4|mkv|ogg|webm)$/i
export default {
  name: 'EpcPartyConstructData',
  components: {
    uniPopupDialog
  },
  data() {
    return {
      token: wx.getStorageSync('token'),
      baseUrl: this.$utils.bimBaseUrl,
      webViewUrl: 'epcPpp',
      webBimUrl: this.$utils.webBimUrl, // /hybrid/html
      bimBaseUrl: this.$utils.bimBaseUrl,
      fileImage,
      filterForm: {
        name: '',
        page: 1,
        rows: 15,
        fileType: '',
        partyMemberCompanyId: '',
        projectId: wx.getStorageSync('projectId')
      },
      drawerForm: {},
      options: [
        {
          text: '下载',
          style: {
            backgroundColor: '#007aff'
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ],
      loading: false,
      total: 10,
      list: [],
      clickItem: null //点击删除或下载的列数据
    }
  },
  computed: {
    ...mapGetters(['projectId', 'participantCompanyList']),
    //工程类型
    fileTypeList() {
      return (
        this.$getArgList('fileType') || [
          { value: 1, label: '图片 ' },
          { value: 2, label: '视频' },
          { value: 3, label: '文档' },
          { value: 4, label: '压缩包' },
          { value: 0, label: '其他' }
        ]
      )
    },
    //问题类型
    departmentList() {
      return (
        this.$store.getters.departmentList.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }) || []
      )
    }
  },
  watch: {},
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.init()
  },
  onShow() {
    //this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  methods: {
    //获取党建资料列表
    getData: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let exportStartTime = (data.date && data.date[0] && this.moment(data.date[0]).format('YYYY-MM-DD 00:00:00')) || ''
      let exportEndTime = (data.date && data.date[1] && this.moment(data.date[1]).format('YYYY-MM-DD 23:59:59')) || ''
      delete data.date
      let res = await Api.getDataList({ ...data, exportStartTime, exportEndTime }).finally(() => {
        this.loading = false
      })
      let records = (res.data && res.data.records) || []
      let initRecord = []
      for (let i = 0; i < records.length; i++) {
        let obj = { ...records[i] }
        let res = await this.fly.file.post('file/manage/list', [obj.fileId])
        obj.name = obj.name + '.' + obj.fileType
        if (obj.fileTrueType === '图片') {
          obj.imgSrc = res.data[0]?.fileUrl
          obj.fileUrl = res.data[0]?.fileUrl
        } else {
          obj.fileUrl = res.data[0]?.fileUrl
          obj.imgSrc = this.fileImage[obj.fileType] || '/static/images/fileImage/other.png'
        }
        initRecord.push(obj)
      }
      this.list = [...this.list, ...initRecord]
      this.total = res.data ? res.data.total : 0
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.getData()
    },
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.name = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.name = ''
      this.init()
    },
    handleItemClick(row) {
      console.log(row)
    },
    //点击删除或下载
    onClick(e, item) {
      this.clickItem = item
      //删除
      if (e.index === 1) {
        this.$refs.popup.open()
      } else {
        this.$refs.downloadPopup.open()
      }
    },
    //确定删除操作
    async handleDeleteItem() {
      await Api.deleteData(this.clickItem.id)
      this.$refs.popup.close()
      this.$utils.showToast('删除成功')
      await this.init()
    },
    //确定下载操作
    async handleDownloadItem() {
      this.$refs.downloadPopup.close()
      await this.handleDownload()
    },
    //下载文件
    /*handleDownload() {
      let that = this
      uni.downloadFile({
        url: this.clickItem.fileUrl, //仅为示例，并非真实的资源
        success: res => {
          if (res.statusCode === 200) {
            let tempFilePaths = res.tempFilePath
            uni.saveFile({
              tempFilePath: tempFilePaths,
              success: function (res) {
               uni.openDocument({
						filePath:res.savedFilePath,
						success:(res)=>console.log('成功打开文档')
					})
                that.$utils.showToast('下载成功')
              }
            })
          }
        }
      })
    },*/
    handleDownload() {
      // #ifdef APP-PLUS
      let aa = plus.downloader.createDownload(
        this.clickItem.fileUrl,
        {
          filename: `_downloads/${this.clickItem.name}` //'/storage/emulated/0/Android'
        },
        (d, status) => {
          if (status === 200) {
            if (imgReg.test(this.clickItem.name) || videoReg.test(this.clickItem.name)) {
              plus.gallery.save(
                d.filename,
                () => {
                  this.$utils.showToast('下载成功')
                },
                () => {}
              )
              return
            }
            plus.io.resolveLocalFileSystemURL('/storage/emulated/0/Download', dirEntry => {
              plus.io.resolveLocalFileSystemURL(d.filename, entry => {
                entry.copyTo(dirEntry, d.filename, () => {
                  this.$utils.showToast('下载成功')
                })
              })
            })
          } else {
            plus.downloader.clear()
          }
        }
      )
      aa.start()
      // #endif
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
/deep/.uni-popup__wrapper-box {
  .uni-popup-dialog {
    width: 400rpx;
  }
  .uni-dialog-title {
    border-bottom: 1rpx #ececec solid;
  }
  .uni-dialog-content {
    height: 150rpx;
  }
}
</style>
