<template>
  <view class="main">
    <div class="tabs-wrap">
      <uni-tabs v-model="form.type">
        <uni-tab-pane :name="-1" label="全部"></uni-tab-pane>
        <uni-tab-pane :name="1" label="合格"></uni-tab-pane>
        <uni-tab-pane :name="0" label="不合格"></uni-tab-pane>
      </uni-tabs>
    </div>
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirmed"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <ul class="safe-list">
        <li v-for="item in list" class="card " @click="handleSafeCivilizationDetailView(item.id, item.safetyCivilizationId)">
          <section class="cardList">
            <view class="list">
              <h2>
                <span
                  :style="{
                    backgroundColor: safeCivilizationCheckList[item.checkNature ? item.checkNature - 1 : 4].color
                  }"
                ></span
                >{{ item.civilizationCheckNumber + (item.placeName ? item.placeName : '') }}
              </h2>
              <p>
                计划类型：{{ ['安全文明临检', '一般检查', '阶段性检查', '专项检查'][Number(item.checkNature) - 1] }}
              </p>
              <p class="title">
                <span>检查项目：</span> <span>{{ item.civilizationCheckNumber }}</span>
              </p>
            </view>
            <view>
              <p v-if="item.checkResult == 1" class="isQualified"><span class="circle"></span> 合格</p>
              <p v-if="item.checkResult == 0" class="isQualified"><span class="circle red"></span> 不合格</p>
            </view>
          </section>
          <footer>
            <span>检查人:{{ item.checkPersonName }}</span>
            <span>检查日期：{{ item.checkDate | formatData }}</span>
          </footer>
        </li>
      </ul>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <!-- 添加操作按钮开始 -->
    <m-addition @click.native="handleAddSafeItem"></m-addition>
    <!-- 添加操作按钮结束 -->

    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="total == 0" />
    <!-- 无数据空载页 end -->

    <!-- 筛选组件 start -->
    <uni-drawer-filter
      ref="filterRef"
      type="qualitySecurity"
      :entityId="form.entityId"
      :floorId="form.floorIdList"
      @submit="screenCallback"
    ></uni-drawer-filter>
    <!-- 筛选组件 end -->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../../api/safeCivilizationCheck'
import MAddition from '../../components/m-addition'

export default {
  name: 'Index',
  components: {
    MAddition
  },
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      safeCivilizationCheckList: [
        {
          name: '安全文明临检',
          value: '1',
          color: '#0f0'
        },
        {
          name: '一般检查',
          value: '2',
          color: '#00f'
        },
        {
          name: '阶段性检查',
          value: '3',
          color: '#f00'
        },
        {
          name: '专项检查',
          value: '4',
          color: '#ff0'
        }
        // {
        //   name: '默认',
        //   value: 'default',
        //   color: '#f0f'
        // }
      ],
      form: {
        assessEvaluate: 0,
        checkDateEnd: '',
        checkDateStart: '',
        companyId: '',
        createTimeEnd: '',
        createTimeStart: '',
        keyWords: '',
        ndicatorAchievingStatus: 0,
        page: 1,
        projectId: '',
        rows: 5,
        sortField: '',
        sortValue: '',
        //status: 2,
        type: -1
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    'form.type'() {
      this.init()
    }
  },
  onLoad(options) {
    this.form.projectId = this.projectId
    this.getEntityId(options)
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.screen()
    }
  },
  methods: {
    // 初始化
    init() {
      this.list = []
      this.form.page = 1
      this.getSafeCivilizationCheckCheckList()
    },
    // 获取地址栏传入单体id与楼层id
    getEntityId(options) {
      this.form.entityId = options.entityId || ''
      this.form.floorIdList = options.floorId ? options.floorId.split(',') : []
    },
    // 筛选
    screen() {
      this.$refs.filterRef.open()
    },
    // 筛选回调
    screenCallback(obj) {
      this.form = Object.assign({}, this.form, obj)
      this.init()
    },
    changeTab(val) {
      // this.tabIndex = val
      this.form.type = val
      this.form.page = 1
      this.getSafeCivilizationCheckCheckList()
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.list = []
      this.form.keyWords = e.value
      this.getSafeCivilizationCheckCheckList()
    },

    // 新建安全检查项
    handleAddSafeItem() {
      var that = this
      let itemList = that.safeCivilizationCheckList.map(item => item.name)
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = that.safeCivilizationCheckList[res.tapIndex] || {}
          let id = selectItem.value
          if (!id) return
          if (id === '1') {
            that.$utils.toUrl('/pages/safeCivilizationCheck/add')
          } else {
            that.$utils.toUrl(`/pages/safeCivilizationCheck/plan-list?checkNature=${id}`)
          }
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    /*安全文明列表详情*/
    async handleSafeCivilizationDetailView(id, planId) {
      this.loading = true
      let res = await Api.queryRecordItemInfo(id)
      this.loading = false
      this.statusList = res.data

      // this.queryRecheckInfo(res.data.recordId)
      console.log(res.data.recordStatus)
      console.log(res.data.recordType)
      this.initStepsInfoList(res.data.recordStatus, res.data.recordType, id, res.data.recordId, planId)
      // this.$utils.toUrl(`/pages/safe/detail?id=${id}`)
    },
    initStepsInfoList(status, type, id, recordId, planId) {
      let obj = {
        status: status,
        type: type,
        id: id,
        recordId: recordId,
        planId: planId
      }
      if (type === 1) {
        /*检查详情*/
        this.$utils.toUrl(`/pages/safeCivilization/check/detail?obj=${JSON.stringify(obj)}`)
        // this.$utils.toUrl(`/pages/safe/check/detail?id=${id}&type=${type}&recordId=${recordId}&status=${status}&planId=${planId}`)
      } else if (type === 2) {
        /*整改详情*/
        this.$utils.toUrl(
          `/pages/safeCivilization/rectification/detail?obj=${JSON.stringify(obj)}`
          // `/pages/safe/rectification/detail?id=${id}&type=${type}&recordId=${recordId}&status=${status}&planId=${planId}`
        )
      } else if (type === 3) {
        /*复检详情*/
        this.$utils.toUrl(`/pages/safeCivilization/recheck/detail?obj=${JSON.stringify(obj)}`)
        // this.$utils.toUrl(`/pages/safe/recheck/detail?id=${id}&type=${type}&recordId=${recordId}&status=${status}&planId=${planId}`)
      }
    },

    // 请求安全项列表信息
    async getSafeCivilizationCheckCheckList() {
      let result = await Api.getSafeCivilizationCheckCheckList(this.form)
      if (result.code === 200) {
        let records = (result.data && result.data.records) || []
        this.list = [...this.list, ...records]
        this.total = result.data ? result.data.total : 0
      }
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.form.page++
      this.getSafeCivilizationCheckCheckList()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
