<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <div class="calendar-wrap">
          <span class="calendar-view-mode-control" @click="weekSwitch = !weekSwitch">
            <image src="@/static/images/log/calendar.png" alt="" /> {{ weekSwitch ? '展开日历' : '收起日历' }}</span
          >
      <!-- #ifdef APP-PLUS -->
      <Calendar
          ref="calendar"
          :value="calendarValue"
          monFirst
          :weekSwitch="weekSwitch"
          :tileContent="tileContent"
          @select="handleCalendarSelect"
          @selectMonth="handleMonthSelect"
          @prev="handlePrevBtnClick"
          @next="handleNextBtnClick"
      ></Calendar>
      <!-- #endif -->
      <!-- #ifdef MP -->
      <uni-calendar
          :start-date="'1900-1-1'"
          :end-date="'2999-12-30'"
          :selected="tileContentWeixin"
          @monthSwitch="selectMonth"
          @change="selectDay"
      ></uni-calendar>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <Calendar
          ref="calendar"
          :value="calendarValue"
          monFirst
          :weekSwitch="weekSwitch"
          :tileContent="tileContent"
          :arrowLeft="arrowLeft"
          :arrowRight="arrowRight"
          @select="handleCalendarSelect"
          @selectMonth="handleMonthSelect"
          @prev="handlePrevBtnClick"
          @next="handleNextBtnClick"
      ></Calendar>
      <!-- #endif -->
    </div>
    <div style="position: relative">
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleItemClick(item)">
            <view class="card-body">
              <view
                class="card-info"
                :class="{
                  special: item.status === 0,
                  commonly: item.status === 1
                }"
              >
                <view class="title">监理周报{{ item.periodName}}</view>
              </view>

              <block>
                <uni-status :options="statusList" :value="item.status"></uni-status>
              </block>
            </view>
            <view class="card-footer border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | ymd }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <EmptyTemplate v-if="total === 0" />
    </div>
    <uni-add @click.native="handleAdd" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import statusList from '@/pages/epcPpp/informationManage/lib/statusList'
import _ from 'lodash'
import Api from '@/pages/epcPpp/informationManage/api/supervisionWeekLog'
import arrowLeft from '@/static/images/log/arrow-left-o.png'
import arrowRight from '@/static/images/log/arrow-right.png'
import moment from 'moment'
// #ifdef APP-PLUS
import Calendar from 'mpvue-calendar'
// #endif
// #ifdef H5
import Calendar from 'mpvue-calendar'
// #endif
// #ifdef MP
import Calendar from '@/components/uni-calendar/uni-calendar.vue'
import MAddition from '@/components/m-addition'
// #endif
export default {
  name: 'EpcPPPSupervisionWeekLog',
  components: {
    Calendar
  },
  data() {
    return {
      filterForm: {
        name: '',
        page: 1,
        rows: 10,
        date:moment(),
      },
      // 日历参数
      calendarValue: [],
      weekSwitch: true,
      tileContent: [],
      tileContentWeixin: [],
      dateList: [], //有日志项的日期字符串组成的数组
      arrowLeft,
      arrowRight,
      statusList,
      loading: false,
      list: [],
      total: 0,
      queryMonth:{
        date:moment(),
        page:1,
        rows:99999
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {

  },
  onLoad() {
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.getThisMonthLogList()
    this.init()
  },
  onShow() {
    //获取本月的日志
    this.getThisMonthLogList()
    this.init()
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
    //获取本月哪天有日志
    async getThisMonthLogList(){
      this.loading = true
      const data = _.cloneDeep(this.queryMonth)
      data.startTime=moment(data.date).startOf('months').format('YYYY-MM-DD 00:00:00')
      data.endTime=moment(data.date).endOf('months').format('YYYY-MM-DD 23:59:59')
      data.projectId=this.projectId
      delete data.date
      let result=await Api.getList(data).finally(() => {
        this.loading = false
      })
      let datas = result.data.records || []
      if (datas.length === 0) return
      let currentData = _.map(datas, item => moment(item.startDate,['YYYYMMDD']).format('YYYY-MM-DD')) //此次请求返回的含有日志项信息的日期
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
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      data.startTime=moment(data.date).format('YYYY-MM-DD 00:00:00')
      data.endTime=moment(data.date).format('YYYY-MM-DD 23:59:59')
      data.projectId=this.projectId
      delete data.date
      let res = await Api.getList(data).finally(() => {
        this.loading = false
      })
      let records = (res.data && res.data.records) || []
      this.list = [...this.list, ...records]
      this.total = res.data ? res.data.total : 0
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
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
    //添加日志
    handleAdd() {
      this.$utils.toUrl('/pages/epcPpp/informationManage/supervisionWeekLog/add')
    },
    handleItemClick(row) {
        //未取消
        this.$utils.toUrl(`/pages/epcPpp/informationManage/supervisionWeekLog/detail?id=${row.id}`)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    handleCalendarSelect(value1, value2) {
      // this.filterForm.date = moment(value2.date).format('YYYY-mm-DD')
      let arr=value2.date.split('-')
      this.filterForm.date = moment(`${arr[0]}-${arr[1]<10?0+arr[1]:arr[1]}-${arr[2]}`).format('YYYY-MM-DD')
      this.init()
    },
    handleMonthSelect(month, year) {
      //月发生改变时，请求选中月的含有日志项的时间段及默认显示当月1号的日志项
      this.queryMonth.date = moment(`${year}-${month}`).format('YYYY-MM-DD')
      this.getThisMonthLogList()
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
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
