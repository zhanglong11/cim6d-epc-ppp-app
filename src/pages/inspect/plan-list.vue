<template>
  <view class="main is-white">
    <div class="search-wrap">
      <uni-search-bar placeholder="搜索" @input="handleInput"></uni-search-bar>
    </div>
    <view class="main-body">
      <view v-if="computedList.length > 0" class="project-list-wrap">
        <scroll-view class="project-list card">
          <view
            v-for="(item, index) in computedList"
            :key="item.id"
            class="list-item "
            :class="{ 'border-top': index > 0 }"
            @click="handleItemClick(item)"
          >
            <view class="checked" :class="{ active: item.id == activeId }"></view>
            <view class="title">{{ item.checkPlanName }}</view>
            <view class="owner">{{ item.creatorName }}</view>
          </view>
        </scroll-view>
      </view>
      <!-- 无数据空载页 start -->
      <EmptyTemplate v-if="computedList.length === 0" />
      <!-- 无数据空载页 end -->
      <!-- #ifdef MP -->
      <div class="footer-btn">
        <button type="primary" @click="setSelectedProjectInfo()">确定</button>
      </div>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { inspectApi } from '@/api/inspect'
export default {
  data() {
    return {
      form: {
        checkNature: 0,
        projectId: '',
        search: ''
      },
      activeId: '', //选中项的Id
      // activeInfo: {}, //选中项的具体信息
      keyWords: '', //搜索关键字
      list: [] //全部项目数组
    }
  },
  // 选中计划项，点击确定时
  onNavigationBarButtonTap(obj) {
    if (obj.text === '确定') {
      if (!this.activeId.trim()) {
        this.$utils.showToast('您还没有选择检查计划项')
        return
      }
      this.$utils.toUrl(`/pages/inspect/plan?id=${this.activeId}`)
      // this.$utils.toUrl(`/pages/inspect/plan?info=${encodeURIComponent(JSON.stringify(this.activeInfo))}`)
    }
  },

  computed: {
    computedList() {
      if (this.keyWords.trim()) {
        return this.list.filter(item => {
          // 匹配创建人名称和检查计划名称
          let searchText = this.keyWords.trim().toLowerCase()
          return (
            item.checkPlanName.toLowerCase().includes(searchText) || item.creatorName.toLowerCase().includes(searchText)
          )
        })
      } else {
        return this.list
      }
    },
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.init(options)
  },
  onShow() {
    this.queryPlanList()
  },
  methods: {
    //初始化参数
    init(options) {
      this.form.projectId = this.projectId
      this.form.checkNature = options.checkNature
    },
    //获取检查计划列表
    async queryPlanList() {
      let result = await inspectApi.queryPlanList(this.form)
      if (result.code == 200) {
        this.list = result.data || []
      }
    },
    // 根据关键词筛选计划项
    handleInput(e) {
      this.keyWords = e.value
      this.form.search = e.value
    },
    handleItemClick(data) {
      this.activeId = data.id
      // this.activeInfo = data
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./plan-list.less');
</style>
