<template>
  <view class="main is-white">
    <!-- <web-view
      v-if="downloadParams.num === downloadParams.total"
      ref="bimAppRef"
      :webview-styles="webviewStyles"
      :src="
        `/hybrid/html/plus-download/html/index.html?id=${id}&url=${url}&showBtn=${showBtn}&token=${token}&configId=${configId}&entityName=${entityName}&floorNum=${floorNum}&projectId=${projectId}`
      "
    ></web-view> -->
    <div class="bim-loading">
      <image src="@/static/bim/loading.png" class="loading" />
    </div>
    <div v-if="modalParams.show" class="modal-loading">
      <div class="modal-content">
        <image src="@/static/images/loading.png" class="loading" />
        <p class="title">{{ modalParams.title }}</p>
        <p class="content">{{ modalParams.content }}</p>
      </div>
    </div>
    <!-- #ifdef H5 -->
    <web-view
      v-if="bimList.length > 0"
      ref="bimAppRef"
      :webview-styles="webviewStyles"
      :src="`${webBimUrl}/web-view/${webViewUrl}.html?id=${id}&env=${env}&selectEntity=${selectEntity}&bimShowType=${bimShowType}&locationId=${locationId}&isAddAnchor=${isAddAnchor}&anchorType=${anchorType}&problemId=${problemId}&selectFloor=${selectFloor}&showBtn=${showBtn}&token=${token}&entityName=${entityName}&floorNum=${floorNum}&projectId=${projectId}&bimType=${bimType}&guidArray=${guidArray}&fitViewByGUID=${fitViewByGUID}&uUid=${uUid}&highlightGuid=${selectGuid}`"
    ></web-view>
    <!-- #endif -->
    <!-- #ifdef MP -->
    <web-view
      ref="bimAppRef"
      :webview-styles="webviewStyles"
      :src="`http://luoyang.gim6d.com:18905/app-bim/${webViewUrl}.html?id=${id}&url=${url}&showBtn=${showBtn}&token=${token}&configId=${configId}&entityName=${entityName}&floorNum=${floorNum}&projectId=${projectId}`"
    ></web-view>
    <!-- #endif -->
  </view>
</template>

<script>
import { urlSuffix } from '@/utils/http'
import toTree from '@/utils/toTree'
import DownloadUtil from './downloadUtils'
import { workingAPI } from '@/api/working'
import { bimAPI } from '@/api/bim'
export default {
  components: {},
  data() {
    return {
      bimType: 1, // 1 bim模型模块 2 质量统计bim 3 安全统计bim 4 进度管理bim
      webviewStyles: {
        progress: {
          color: '#4778F3'
        }
      },
      id: 'd2d90db0dcae4b7fa569c4369b5b43e8_1',
      url: 'http://172.16.10.41:18080/jialidemo/3d.svf',
      configId: '',
      entityName: '', // 单体名字
      bimShowType: '3d', // 模型类型 3d / 2d
      locationId: '', // 2d模型viewId
      isAddAnchor: '', // 是否允许添加锚点
      anchorType: '', // 锚点类型
      problemId: '', // 问题id
      floorIds: '',
      showBtn: true, // 是否显示操作按钮
      webViewUrl: 'epcPpp',
      downloadParams: {
        showProgressbar: null,
        num: 0,
        total: 0,
        overrideList: [],
        entityIdList: []
      },
      modalParams: {
        show: false,
        title: '',
        content: ''
      },
      env: urlSuffix,
      confirmDownload: false, // 是否确定下载
      confirmDownloadModal: 0,
      entityTreeData: [], //单体树
      isConfirm: false,
      selectEntity: '', // 选择的单体
      selectFloor: '', // 选择的楼层
      bimList: [], // bim数据
      urgencyDegreeList: [
        { label: '一般', value: 1, color: '#91C1F3' },
        { label: '较大', value: 2, color: '#FFFF00' },
        { label: '严重', value: 3, color: '#FF9650' },
        { label: '重大', value: 4, color: '#FF3333' }
      ],
      guidArray: '', // 构件id
      selectGuidId: '',
      fitViewByGUID: false, // 定位到构件
      modalList: [], // 筛选列表数据
      baseUrl: '',
      webBimUrl: this.$utils.webBimUrl, // /hybrid/html
      bimBaseUrl: this.$utils.bimBaseUrl,
      downUrl: '',
      selectGuid: [], // 传入的guid
      uUid: '' // 接收选择的构件或其他服务使用
    }
  },
  onLoad(options) {
    this.init(options)
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  beforeDestroy() {
    // console.log(11111, this.bimType, this.uUid, this)
    this.getCache()
  },
  // 页面返回监听
  // onBackPress(event) {
  //   if (event.from === 'navigateBack' && this.bimType === '1') {
  //     return false
  //   }
  //   if (this.entityTreeData.length === 1 && this.bimType === '1') {
  //     this.$utils.goBack(2)
  //   }
  //   return this.bimType === '1'
  // },
  // 顶部按钮点击事件
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      // console.log(1111, obj.key)
      this.$refs.filterRef.open()
    }
  },
  mounted() {},
  methods: {
    // 初始化
    init(options) {
      // #ifdef APP-PLUS
      plus.screen.lockOrientation('portrait-primary')
      // #endif
      let entityId = options.entityId || ''
      let configId = options.configId
      let entityName = options.entityName || '模型展示'
      let floorNum = options.floorNum || ''
      this.bimType = options.bimType
      this.showBtn = options.showBtn
      this.floorNum = floorNum
      this.confirmDownload = false
      this.selectEntity = options.selectEntity || ''
      this.selectFloor = options.selectFloor || ''
      this.uUid = options.uUid || ''
      this.selectGuid = options.selectGuid || []
      this.bimShowType = options.bimShowType || '3d'
      this.locationId = options.locationId || ''
      this.isAddAnchor = options.isAddAnchor === 'true'
      this.anchorType = options.anchorType || ''
      this.problemId = options.problemId || ''
      // #ifdef MP-WEIXIN
      this.webViewUrl = 'wx-web-view'
      // #endif
      this.id = entityId
      this.configId = configId
      this.entityName = encodeURI(entityName).replace(/#/g, escape('#'))
      this.downUrl = `/cim6d-bim-light${this.env}/noToken/old/basic/commonFile/get/fdht`
      this.url = `${this.downUrl}/bim_${entityId}/3d.svf`
      this.baseUrl = `http://152.136.120.203:22222${this.downUrl}`
      this.$utils.setTitle(entityName)
      this.queryBimTree()
    },
    // 获取guid缓存
    async getCache() {
      if (this.bimType !== '6' && this.bimShowType === '3d') {
        return
      }
      let result = await bimAPI.selectCache([this.uUid])
      let datas = result.data
      // console.log('获取guid缓存', result.data)
      this.$store.commit('setGuid', {
        uUid: this.uUid,
        data: datas[0].value || []
      })
    },
    // 获取bim树
    async queryBimTree() {
      try {
        let result = ''
        if (this.id) {
          result = await bimAPI.queryBimTree(this.id)
        } else {
          result = await bimAPI.queryBimTreeByProject(this.projectId)
        }
        let datas = result.data || []
        let list = []
        let entityTreeData = []
        let newList = []
        const formatArray = array => {
          array.map(item => {
            if (item.type === 3) {
              list.push(item.bimResourceId)
              entityTreeData.push({
                id: item.bimResourceId,
                label: item.bimResourceName,
                parentId: item.parentId,
                parentName: item.parentName
              })
            }
            if (item.children && item.type !== 3) {
              item.children.map(e => {
                e.parentId = item.bimResourceId
                e.parentName = item.bimResourceName
              })
              formatArray(item.children)
            }
          })
        }
        formatArray(datas)
        entityTreeData.map(item => {
          let children = []
          newList.push({
            value: item.parentId,
            label: item.parentName,
            children: []
          })
          let ids = _.map(newList, 'value')
          let index = ids.indexOf(item.parentId)
          if (index >= 0) {
            newList[index].children.push({
              value: item.id,
              label: item.label
            })
          }
        })
        this.entityTreeData = newList
        this.bimList = list
        if (list.length === 0) {
          this.$utils.showToast('未关联模型')
          return
        }
        // console.log(111, list)
        // #ifdef H5
        // this.getBimModelList()
        // #endif
        // #ifdef APP-PLUS
        // 临时放弃缓存
        // this.initWebView()
        if (this.bimShowType === '2d') {
          this.initWebView()
        } else {
          this.getBimModelList()
        }

        // document.addEventListener('plusready', function() {
        // })
        // #endif
        if (this.bimType === '2') {
          this.queryQualityList(1)
        }
        if (this.bimType === '3') {
          this.queryQualityList(2)
        }
      } catch (e) {}
    },
    // 获取质量问题
    async queryQualityList(planType) {
      let params = {
        projectId: this.projectId,
        planType
      }
      let result = await bimAPI.queryQualityList(params)
      let datas = result.records || []
      this.modalList = datas
      if (datas.length === 0) {
        this.modalList = [
          {
            checkPoint: '土方工程',
            dealStatus: 0,
            id: '02f60bc06ba547ab99fd0b4618720fbd',
            problemDesc:
              '方开挖的顺序、方法必须与设计工况相不一致,没有遵循"开槽支撑，先撑后挖、分层开挖，严禁朝挖的原则',
            status: 4,
            urgencyDegree: 3
          },
          {
            checkPoint: '',
            dealStatus: 0,
            id: '24953341232541224',
            problemDesc: '超出允许偏差范围',
            status: 4,
            urgencyDegree: 2
          },
          {
            checkPoint: '砼基础',
            dealStatus: 1,
            id: '48988257aa8c477e84ce267b55adf29c',
            problemDesc: '钢筋混凝土基础的表面不平整',
            status: 5,
            urgencyDegree: 4
          },
          {
            checkPoint: '柱',
            dealStatus: 1,
            id: '563c4d6b72584cfe964d6d03f8466ed8',
            problemDesc: '钢筋连接方式错误',
            status: 5,
            urgencyDegree: 2
          },
          {
            checkPoint: '地下防水层',
            dealStatus: 1,
            id: '6b06e43c6f8142029f56cd9060b8d510',
            problemDesc: '外表面有大量出水点',
            status: 5,
            urgencyDegree: 4
          },
          {
            checkPoint: '地基处理',
            dealStatus: 0,
            id: '8a91e78371bd4c4293bb5d782f38cb6b',
            problemDesc: '材料（灰土、砂石等）的质量不符合设计要求',
            status: 4,
            urgencyDegree: 4
          },
          {
            checkPoint: '砌体基础',
            dealStatus: 1,
            id: 'bfc63ad4040f481bb7a7be813f05874f',
            problemDesc: '水平灰缝厚度没有达到平均8-12mm为准的要求',
            status: 5,
            urgencyDegree: 1
          }
        ]
      }
      console.log('获取质量问题', datas)
    },
    // 获取安全问题
    async querySafetyList() {
      let params = {
        projectId: this.projectId
      }
      let result = await bimAPI.querySafetyList(params)
      let datas = result.records || []
      // console.log(111, datas)
    },
    // 获取构件id
    async qualityProblemBimBind(item) {
      let params = {
        projectId: this.projectId,
        targetId: item.id
      }
      this.selectGuidId = item.id
      this.guidArray = '09e639d4-1019-4433-9d25-86900e28f57d-00104a88'
      this.fitViewByGUID = true
      this.$refs.filterRef.close()
      return
      const result = await bimAPI.qualityProblemBimBind(params)
      let datas = result.data.componentIdList
      if (datas.length) {
        this.guidArray = datas.join(',')
      }
    },
    // 获取网络环境
    getNetworkType() {
      let self = this
      // 防止多次弹出确认框
      if (self.confirmDownloadModal > 0) {
        return
      }
      uni.getNetworkType({
        success: function (res) {
          if (res.networkType === 'wifi') {
            self.confirmDownload = true
            self.getBimModelList()
          } else {
            self.confirmDownload = false
            uni.showModal({
              title: '提示',
              content: '当前非Wifi环境，确定要继续浏览吗？',
              success: function (res) {
                if (res.confirm) {
                  self.confirmDownload = true
                  self.getBimModelList()
                } else {
                  self.$utils.goBack()
                }
              }
            })
          }
        }
      })
    },
    // 获取多模型数据
    async getBimModelList() {
      let self = this
      this.downloadParams.overrideList = []
      this.downloadParams.entityIdList = []
      this.confirmDownloadModal = 0
      try {
        if (this.bimList.length === 0) {
          return
        }
        this.modalParams.title = '初始化...'
        this.modalParams.show = true
        // 设置下载文件夹
        DownloadUtil.setOptions({
          downloadStoragePath: `_doc/`,
          concurrentDownloadCount: 3,
          //获取相对路径的函数,如果不传,则用默认的路径处理方法
          getRelativePathFromLoadUrlCallback: function (loadUrl) {
            //获取图片名字
            var imgName = loadUrl.replace(self.baseUrl, '')
            // console.log(123456, loadUrl, imgName)
            var relativePath = `_doc${imgName}`
            return relativePath
          }
        })
        this.downloadParams.entityIdList = this.bimList
        this.getBimModel(this.bimList.join(','))
      } catch (e) {}
    },
    // 获取下载地址
    async getBimModel(entityId) {
      let self = this
      try {
        let result = await bimAPI.getBimModel(entityId)
        let datas = result.data
        let modelFileList = datas || []
        // console.log('获取下载地址', modelFileList.length, modelFileList)
        // console.log('获取下载地址', JSON.stringify(modelFileList))
        this.downloadParams.num = 0
        this.downloadParams.total = modelFileList.length
        modelFileList.map((item, i) => {
          let filePath = `_doc/${item.path}${item.fileName}`
          // console.log(333, i, filePath)
          this.downloadParams.overrideList.push({
            match: `${this.bimBaseUrl}${this.downUrl}/${item.path}${item.fileName}`,
            redirect: filePath // '_www/hybrid/html/none.js'
          })
          // console.log(444, JSON.stringify(modelFileList))
          // 监测缓存是否存在
          plus.io.resolveLocalFileSystemURL(
            filePath,
            function (entry) {
              entry.file(function (file) {
                // console.log(2222, JSON.stringify(file))
              })
              self.loadFile('读取中', filePath)
            },
            function (e) {
              // console.log(444, self.confirmDownload, JSON.stringify(e))
              if (!self.confirmDownload) {
                self.confirmDownloadModal = i
                self.getNetworkType()
                return
              }
              self.downloadFile(item.url, true)
            }
          )
        })
      } catch (e) {
        // console.log('获取下载地址', JSON.stringify(e))
      }
    },
    // 改变进度模态框文字
    changeProgressbar(type) {
      // console.log(this.downloadParams.num, this.downloadParams.total)
      if (this.downloadParams.num === this.downloadParams.total) {
        this.modalParams.show = false
        // this.downloadParams.showProgressbar.close()
        this.initWebView()
        return
      }
      let newNum = ((this.downloadParams.num / this.downloadParams.total) * 100).toFixed(0)

      this.modalParams.title = type
      this.modalParams.content = `${newNum}/100`
      // this.downloadParams.showProgressbar.setTitle(`${type}\n${newNum}/100`)
    },
    // 接收通讯
    postMessage(e) {
      // console.log('接收通讯', e)
    },
    // 初始化webView
    initWebView() {
      // console.log(1111, JSON.stringify(this.downloadParams.overrideList))
      let self = this
      let filePath = ''
      let overrideList = [] // /app-bim
      let loadUrl = `${this.webBimUrl}/web-view/${this.webViewUrl}.html?id=${this.id}&env=${this.env}&selectEntity=${this.selectEntity}&bimShowType=${this.bimShowType}&locationId=${this.locationId}&isAddAnchor=${this.isAddAnchor}&anchorType=${this.anchorType}&problemId=${this.problemId}&selectFloor=${this.selectFloor}&showBtn=${this.showBtn}&token=${this.token}&entityName=${this.entityName}&floorNum=${this.floorNum}&projectId=${this.projectId}&bimType=${this.bimType}&guidArray=${this.guidArray}&fitViewByGUID=${this.fitViewByGUID}&uUid=${this.uUid}&highlightGuid=${this.selectGuid}`
      // console.log(1111, loadUrl)
      //拦截Webview窗口的资源请求
      let newWeb = plus.webview.create('', 'custom-webview', {
        top: uni.getSystemInfoSync().statusBarHeight + 44,
        bottom: 0
      })
      newWeb.loadURL(loadUrl)
      //监控请求
      newWeb.listenResourceLoading(
        {
          match: '.*'
        },
        function (event) {
          // console.log('监控请求', JSON.stringify(event))
        }
      )
      newWeb.overrideResourceRequest(this.downloadParams.overrideList)
      let currentWebview = this.$scope.$getAppWebview()
      currentWebview.append(newWeb)
      // newWeb.overrideResourceRequest([
      //   {
      //     match: '.*',
      //     redirect: '_www/hybrid/html/none.js'
      //   }
      // ])
    },
    // 加载文件
    loadFile(type, filename) {
      // console.log(type + filename, this.downloadParams.num)
      this.downloadParams.num++
      this.changeProgressbar(type)
    },
    // 队列下载文件
    downloadFile(fileUrl, IsWithCache) {
      let self = this
      DownloadUtil.downloadFileWidthLocalCache(
        fileUrl,
        {
          beforeDownload: function () {},
          successDownload: function (relativePath) {},
          errorDownload: function (msg) {
            if (showProgressbar) {
              self.downloadParams.showProgressbar.close()
            }
          },
          downloading: function (progress, tips) {
            self.loadFile('下载中', '')
            //console.log('下载进度为:' + progress + '%,' + tips)
          }
        },
        IsWithCache
      )
    }
  }
}
</script>

<style lang="less" scope>
@import url('./index.less');
</style>
