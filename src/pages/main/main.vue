<template>
  <view class="content main">
    <div class="bg">
      <div class="blue">
        <div class="projectWrap">
          <div
            v-if="token"
            class="select-project"
            @click="$utils.toUrl(`/pages/select-project/select-project?projectId=${projectId}`)"
          >
            <b>{{ projectName }}</b
            ><i></i>
          </div>
          <div v-else style="flex: 1; overflow: hidden;"></div>
        </div>
      </div>
      <div class="gray"></div>
    </div>
    <div class="weather-con">
      <div class="weather card">
        <image src="@/static/images/main/weather.png" alt="" />
        <div>
          <header>
            <div class="value">{{ weatherInfo.temperature | formatStr }}°C</div>
            <div class="date">{{ weatherInfo.temperatureTime | formatData }}</div>
          </header>
          <footer>
            <div class="info">
              {{ weatherInfo.weather | formatStr }} {{ weatherInfo.windDirection | formatStr }}
              {{ weatherInfo.windPower | formatStr }}
            </div>
            <div class="location">
              <uni-icons type="location" size="16" color="#666"></uni-icons>{{ weatherInfo.city | formatStr }}
            </div>
          </footer>
        </div>
      </div>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <div
        class="main-body"
        :class="{
          'empty-wrapper': list.length === 0
        }"
      >
        <ul class="module-list card">
          <!-- 未登录占位 start -->
          <template v-if="!token">
            <li @click="$utils.toUrl('')">
              <image src="@/static/images/application/NoticeEpcPpp.png" />
              <p>通知公告</p>
            </li>
            <li @click="$utils.toUrl('')">
              <image src="@/static/images/application/EpcPppSchedule.png" />
              <p>项目进度</p>
            </li>
            <li @click="$utils.toUrl('')">
              <image src="@/static/images/application/EpcPppScheduleView.png" />
              <p>未完成进度计划</p>
            </li>
            <li @click="$utils.toUrl('')">
              <image src="@/static/images/application/ModelEpcPpp.png" />
              <p>BIM模型</p>
            </li>
          </template>
          <!-- 未登录占位 end -->

          <!-- 施工 start -->
          <li v-if="$hasPower('ModelEpcPpp')" @click="$utils.toUrl('/pages/epcPpp/notice/index')">
            <image src="@/static/images/application/NoticeEpcPpp.png" />
            <p>通知公告</p>
          </li>
          <li v-if="$hasPower('EpcPppSchedule')" @click="$utils.toUrl('/pages/epcPpp/home/progress/index')">
            <image src="@/static/images/application/EpcPppSchedule.png" />
            <p>项目进度</p>
          </li>
          <li v-if="$hasPower('EpcPppScheduleView')" @click="$utils.toUrl('/pages/epcPpp/home/unfinishedPlan/list')">
            <image src="@/static/images/application/EpcPppScheduleView.png" />
            <p>未完成进度计划</p>
          </li>
          <li v-if="$hasPower('ModelEpcPpp')" @click="toBim()">
            <image src="@/static/images/application/ModelEpcPpp.png" />
            <p>BIM模型</p>
          </li>
          <!-- 施工 end -->
        </ul>
        <uni-title v-if="list.length > 0" title="消息通知">
          <div slot="extra" class="extra" @click="markAllRead()">
            一键已读 <image src="@/static/images/read.png" class="read" />
          </div>
        </uni-title>
        <ul v-if="list.length > 0" class="log-list">
          <li v-for="(e, i) in list" :key="i" class="card" :class="{ unread: e.readFlag === 2 }" @click="toDetails(e)">
            <p>
              <span>{{ e.title }}</span>
            </p>
            <p>
              <span class="time">{{ e.createTime | date }}</span>
            </p>
          </li>
        </ul>
        <!-- 无数据空载页 start -->
        <EmptyTemplate v-if="list.length === 0" />
        <!-- 无数据空载页 end -->
      </div>
    </scroll-view>
  </view>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { workFlowApi } from '@/api/work-flow'
import { loginApi } from '@/api/login'
import { msgApi } from '@/api/message'
import qualityType from '@/pages/user/setting-items/lib/qualityType'
export default {
  filters: {
    date(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      list: [],
      date: moment().format('YYYY-MM-DD')
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    projectName() {
      return this.$store.state.project.projectName
    },
    project() {
      return uni.getStorageSync('project')
    },
    token() {
      return this.$store.state.user.token
    },
    weatherInfo() {
      return this.$store.state.project.weatherInfo
    },
    userId() {
      return this.$store.state.user.userId
    },
    // 待办跳转定义
    taskTodoPower() {
      return this.$store.state.userPower.taskTodoPower
    },
    // 消息类型缓存
    messageTypes() {
      return this.$store.state.project.messageTypes
    }
  },
  onLoad() {
    // 设置审批跳转缓存
    this.$store.commit('setApprovalRouter')
    this.getCommonMessageList()
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      if (!uni.getStorageSync('guide')) {
        this.$utils.toUrl('/pages/guide/index', 1)
        uni.setStorageSync('guide', 1)
        return
      }
      // #ifdef H5
      let routePath = this.$route.path
      // #endif
      if (this.$store.state.user.token && this.$store.state.project.projectId) {
        this.$store.commit('user/login', () => {
          this.$store.commit('getPower') // 获取用户授权
          this.getUserList()
          this.getWeather()
          this.getMessage()
        })
      } else {
        this.$store.commit('user/logOut')
      }
      // #ifdef APP-PLUS
      this.checkUpdate()
      // #endif
    },
    // 检查APP是否有更新
    async checkUpdate() {
      let self = this
      let result = await loginApi.appCheckUpdate({
        appTypeCode: 'qianjiang-ppp'
      })
      let datas = result.data
      // 获取本地应用资源版本号
      plus.runtime.getProperty(plus.runtime.appid, function (inf) {
        let wgtVer = ''
        wgtVer = inf.version
        if (wgtVer !== datas.versionCode) {
          uni.showModal({
            title: '温馨提示',
            content: '检测到新版本，是否更新？',
            success: e => {
              if (e.cancel) {
                return
              }
              self.hotDown(datas.fileUrl)
            }
          })
        }
      })
    },
    // 热更新APP
    hotDown(wgtUrl) {
      if (!wgtUrl) {
        return
      }
      const installWgt = path => {
        plus.nativeUI.showWaiting('自动更新中...')
        plus.runtime.install(
          path,
          {},
          function () {
            plus.nativeUI.closeWaiting()
            // console.log('安装wgt文件成功！')
            plus.nativeUI.alert('应用资源更新完成！', function () {
              plus.runtime.restart()
            })
          },
          function (e) {
            plus.nativeUI.closeWaiting()
            // console.log('安装wgt文件失败[' + e.code + ']：' + e.message)
            plus.nativeUI.alert('安装wgt文件失败[' + e.code + ']：' + e.message)
          }
        )
      }
      plus.nativeUI.showWaiting('下载wgt文件...')
      plus.downloader
        .createDownload(wgtUrl, { filename: '_doc/update/' }, function (d, status) {
          if (status === 200) {
            // console.log('下载wgt成功：' + d.filename)
            installWgt(d.filename) // 安装wgt包
          } else {
            // '下载wgt失败！'
            plus.nativeUI.alert('下载wgt失败！')
          }
          plus.nativeUI.closeWaiting()
        })
        .start()
    },
    // 获取项目用户数据
    getUserList() {
      if (!this.token || !this.projectId) {
        return
      }
      this.$store.dispatch('getUserList', this.projectId)
      this.$store.dispatch('getDepartmentList')
    },
    // 获取天气
    getWeather() {
      if (!this.token) {
        return
      }
      this.fly.system
        .post('weather/info', { lng: this.project.longitude, lat: this.project.latitude, projectId: this.projectId })
        .then(res => {
          let datas = res.data || {}
          this.$store.commit('setWeatherInfo', datas)
        })
    },
    // 获取日志
    getMessage() {
      if (!this.token) {
        this.list = []
        uni.stopPullDownRefresh()
        return
      }
      this.queryAnnouncement()
    },
    // 获取首页未读消息列表
    async queryAnnouncement() {
      let params = {
        isRead: 0,
        projectId: this.projectId,
        page: 1,
        rows: 200
      }
      let result = await msgApi.queryAnnouncement(params)
      let datas = result.data
      let list = datas || []
      this.list = list
    },
    // 获取消息分类列表 @author zhangshilong
    async getCommonMessageList() {
      let result = await msgApi.getCommonMessageList()
      let datas = result.data
      let messageTypes = {}
      datas.map(item => {
        if (item.appRedirectUrl) {
          messageTypes[item.subModules] = item.appRedirectUrl
        }
      })
      this.$store.commit('setMessageType', messageTypes)
    },
    // 获取日志列表
    queryMessageList() {
      this.fly.system
        .post('common/message/list', { category: 'CONSTRCTION_MANAGE', projectId: this.projectId }, { isLoading: true })
        .then(res => {
          this.list = res.data.records || []
        })
        .catch(err => {
          this.list = []
        })
    },
    // 跳转详情
    toDetails(item) {
      uni.showModal({
        title: item.title,
        content: item.content,
        success: res => {
          if (res.confirm) {
            this.getAnnouncement(item.id)
          }
        }
      })
    },
    // 消息详情
    async getAnnouncement(id) {
      await msgApi.getAnnouncement(id)
      this.queryAnnouncement()
    },
    // 标记全部已读
    async markAllRead() {
      uni.showModal({
        title: '温馨提示',
        content: '全部标记为已读？',
        success: res => {
          if (res.confirm) {
            this.markAllReadSuccess()
          }
        }
      })
    },
    // 标记全部已读异步
    async markAllReadSuccess() {
      let idList = _.map(this.list, 'id')
      await msgApi.markAllRead(idList)
      this.queryAnnouncement()
    },
    // 采购通知
    procurementNotice() {
      let url = this.$hasPower('procurementPartyDetail')
        ? '/pages/material/procurementParty/index'
        : '/pages/material/procurementSupplier/index'
      this.$utils.toUrl(url)
    },
    // 跳转bim模型
    toBim() {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=1`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./main.less');
</style>
