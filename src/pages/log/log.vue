<template>
<view class="main">
  <scroll-view class="scroll-roll" @scrolltolower="scrolltolower" scroll-y>
    <view class="main-body">
      <div class="calendar-wrap">
        <span class="calendar-view-mode-control" @click="weekSwitch = !weekSwitch">
          <image src="@/static/images/log/calendar.png" alt="" /> {{ weekSwitch ? '展开日历' : '收起日历' }}</span>
        <!-- #ifdef APP-PLUS -->
        <Calendar ref="calendar" :value="calendarValue" monFirst :weekSwitch="weekSwitch" :tileContent="tileContent"  @select="handleCalendarSelect" @selectMonth="handleMonthSelect" @prev="handlePrevBtnClick" @next="handleNextBtnClick"></Calendar>
        <!-- #endif -->
        <!-- #ifdef MP -->
        <uni-calendar :start-date="'1900-1-1'" :end-date="'2999-12-30'" :selected="tileContentWeixin" @monthSwitch="selectMonth" @change="selectDay"></uni-calendar>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <Calendar ref="calendar" :value="calendarValue" monFirst :weekSwitch="weekSwitch" :tileContent="tileContent" :arrowLeft="arrowLeft" :arrowRight="arrowRight" @select="handleCalendarSelect" @selectMonth="handleMonthSelect" @prev="handlePrevBtnClick" @next="handleNextBtnClick"></Calendar>
        <!-- #endif -->
      </div>
      <view class="cardWrapper">
        <view class="main-content">
          <uni-card v-for="item in list" :key="item.id" @click.native="handleListItemClick(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title titleName">{{ item.name }}</view>
                <view class="flex-wrapper">
                  <view class="flex-left">
                    <view class="flex-item">
                      <view class="flex-item-label">日志编号：</view>
                      <view class="flex-item-content">{{ item.code }}</view>
                    </view>

                    <view class=" flex-item">
                      <view class="flex-item-label">施工人员：</view>
                      <view class="flex-item-content">{{ item.constructionPersonNames }}</view>
                    </view>
                  </view>
                  <view>
                    <uni-status :options="readStatus" :value="item.status"></uni-status>
                  </view>
                </view>
              </view>

            </view>
            <view class="card-footer  border-top">

              <text>记录人:{{ item.recordUserName||item.creatorName }}</text>
              <text>编制时间：{{ item.diaryDate | formatData }}</text>

            </view>
          </uni-card>
        </view>
 <!-- 无数据空载页 start -->
      <EmptyTemplate v-if="list.length === 0" />
      <!-- 无数据空载页 end -->
      </view>
      <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
     
    </view>
  </scroll-view>
  <!-- 添加操作按钮开始 -->
  <m-addition @click.native="handleAddLogItem"></m-addition>
  <!-- 添加操作按钮结束 -->
</view>
</template>

<script>
// #ifdef APP-PLUS
import Calendar from 'mpvue-calendar'
// #endif
// #ifdef H5
import Calendar from 'mpvue-calendar'
// #endif
// #ifdef MP
import Calendar from '@/components/uni-calendar/uni-calendar.vue'
// #endif
import MAddition from '../../components/m-addition'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
import arrowLeft from '@/static/images/log/arrow-left-o.png'
import arrowRight from '@/static/images/log/arrow-right.png'
import readStatus from './lib/readStatus'
import _ from 'lodash'

export default {
  components: {
    Calendar,
    MAddition
  },
  data() {
    return {
      // 日历参数
      calendarValue: [],
      weekSwitch: true,
      tileContent: [],
      tileContentWeixin: [],
      dateList: [], //有日志项的日期字符串组成的数组
      list: [],
      arrowLeft,
      arrowRight,
      logQuery: {
        page: 1,
        projectId: '',
        rows: 10,
      },
      readStatus,
      total: 0,
      loading: false,
      isRealse: false, //标记日志列表是否为首次请求，用来避免全部数据加载完成后加载更多仍不停触发
      dateQuery: {
        //查询月中含有日至项的时间段
        diaryDateStr: null,
        projectId: '',
      }
    }
  },
  computed: {
    ...mapGetters(['projectId']),

  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  //上拉加载更多
  onReachBottom() {
    this.scrolltolower()
  },
  onLoad() {
    this.logQuery.projectId = this.projectId
    this.dateQuery.projectId = this.projectId
    
  },
  onShow() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      // console.log("init")
      this.logQuery.page = 1
      this.setDefaultDateInfo()
      this.handleQueryLogList()
      this.handleQueryDateList()
    },
    // 设置请求日志的请求参数的默认日期
    //设置请求含日志项请求的默认日期
    setDefaultDateInfo() {
      if (!this.logQuery.diaryDatebeginTime) {
        this.logQuery.diaryDatebeginTime = moment().format('YYYY-MM-DD')
        this.logQuery.diaryDateEndTime = moment().format('YYYY-MM-DD')
      }
      if (!this.dateQuery.diaryDateStr) {
        
        this.dateQuery.diaryDateStr = moment().format('YYYY-MM')
      }
    },
	
    // 加载更多
    scrolltolower() {
      if (this.total === this.list.length) return
      this.logQuery.page++
      this.handleQueryLogList(true)
    },
    // 请求日志项列表信息
    async handleQueryLogList(loadMore) {
      this.isRealse = false
      this.loading = true
      // console.log(this.logQuery)
      let result = await this.fly.log.post("/dailydiary/list", this.logQuery, {
        isLoading: true
      })
      this.total = result.data.total || 0
      let tempList = (result.data && result.data.records) || []
      if(loadMore){
      this.list = [...this.list, ...tempList]
      }else{
        this.list= [ ...tempList]
      }
      this.isRealse = true
      this.loading = false

    },

    // 请求指定月内含有日志项的时间
    async handleQueryDateList() {
      let result = await this.fly.log.post('dailydiary/selectMonthDaily',this.dateQuery)
      let datas = result.data || []
      if (datas.length === 0) return
      let currentData = _.map(datas, item => moment(item,['YYYYMMDD']).format('YYYY-MM-DD')) //此次请求返回的含有日志项信息的日期
      this.dateList = _.uniq([...this.dateList, ...currentData])
      this.tileContent = []
      this.tileContentWeixin = []
      _.forEach(this.dateList, item => {
        let newItem = item.split('-')
        this.tileContent.push({
          date: `${parseInt(newItem[0])}-${parseInt(newItem[1])}-${parseInt(newItem[2])}`, // 修复日历bug
          className: 'pin',
          content: '●'
        })
        this.tileContentWeixin.push({
          date: item
        })
      })
    },
    handleCalendarSelect(value1, value2) {
      // this.$utils.showToast(`${value1}`)
      // 选中日期后，查询当天下的日志项

      this.logQuery.diaryDatebeginTime =moment(value2.date,['YYYYMMDD']).format('YYYY-MM-DD')
      this.logQuery.diaryDateEndTime = moment(value2.date,['YYYYMMDD']).format('YYYY-MM-DD')
      this.handleInitCurrentLogInfo()
      this.handleQueryLogList()
    },
    handleMonthSelect(month, year) {
      //月发生改变时，请求选中月的含有日志项的时间段及默认显示当月1号的日志项
      this.dateQuery.diaryDateStr = moment(`${year}-${month}`,['YYYYMMDD']).format('YYYY-MM-DD')
      this.handleQueryDateList()
      
    },
    // 选择月份
    selectMonth(e) {
      this.handleMonthSelect(e.month, e.year)
    },
    // 选择天
    selectDay(e) {
      let date = e.fulldate
      this.handleCalendarSelect('', {
        date
      })
    },
    // 通过箭头图片选择上个月/上一周时
    handlePrevBtnClick(year, month) {
      this.handleMonthSelect(month, year)
    },
    // 通过箭头图片选择下个月/下一周时
    handleNextBtnClick(year, month) {
      this.handleMonthSelect(month, year)
    },
    // 查看日志详情
    handleListItemClick({
      id
    }) {
      this.$utils.toUrl(`/pages/log/detail?id=${id}`)
    },
    // 新建日志项
    handleAddLogItem() {
      this.$utils.toUrl(`/pages/log/log-add`)
    },
    //切换日期时清空当前页的日志数据
    handleInitCurrentLogInfo() {
      this.list = []
      this.total = 0
      this.logQuery.page = 1
      this.isRealse = false
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./log.less');
</style>
