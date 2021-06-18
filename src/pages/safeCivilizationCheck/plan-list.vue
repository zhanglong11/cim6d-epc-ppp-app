<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="computedList.length" class="scroll-roll" scroll-y>
      <view class="main-body">
        <ul class="list card">
          <li v-for="item in computedList" :key="item.id" class="item" @click="handlePlanClick(item.id)">
            <p>{{ item.civilizationName }}</p>
            <p>{{ item.creatorName }}</p>
          </li>
        </ul>
      </view>
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="computedList.length === 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import Api from '../../api/safeCivilizationCheck'
var graceChecker = require('../../utils/graceChecker.js')
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      planList: [],
      form: {
        assessEvaluate: 0,
        checkNature: null,
        companyId: '',
        createTimeEnd: '',
        createTimeStart: '',
        keyWords: '',
        ndicatorAchievingStatus: null,
        page: 1,
        planEndDate: '',
        planStartDate: '',
        projectId: '',
        rows: 999,
        sortField: '',
        sortValue: '',
        status: null
      },
      keyWords: ''
    }
  },

  onLoad(options) {
    this.init(options)
  },
  onShow() {
    this.getSafeCivilizationPlanInfo()
  },
  computed: {
    ...mapGetters(['projectId']),
    computedList() {
      if (this.keyWords) {
        return this.planList.filter(item => {
          return (
            item.planName.toLowerCase().includes(this.keyWords.toLowerCase()) ||
            item.creatorName.toLowerCase().includes(this.keyWords.toLowerCase())
          )
        })
      } else {
        return [...this.planList]
      }
    }
  },
  methods: {
    init(options) {
      this.form.checkNature = options.checkNature
      this.form.projectId = this.projectId
      this.form.status = 2
    },
    //关键词搜索
    handleSearchBarInput(e) {
      this.keyWords = e.value.trim()
    },
    // 计划列表页
    async getSafeCivilizationPlanInfo() {
      let res = await Api.getSafeCivilizationPlanList(this.form)
      this.planList = (res.data && res.data.records) || []
    },
    handlePlanClick(id) {
      this.$utils.toUrl(`/pages/safeCivilizationCheck/plan-add?id=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./plan-list.less');
</style>
