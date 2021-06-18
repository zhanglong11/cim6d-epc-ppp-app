<template>
  <div class="main">
    <div class="tabs-wrap">
      <uni-tabs v-model="filterForm.type" style="justify-content: space-around">
        <uni-tab-pane :name="2" label="待验收"></uni-tab-pane>
        <uni-tab-pane :name="1" label="合格"></uni-tab-pane>
        <uni-tab-pane :name="0" label="不合格"></uni-tab-pane>
      </uni-tabs>
    </div>
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirmed"></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll list" @refresherrefresh="init" @scrolltolower="loadMore">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <section>
          <h2>
            <span :style="{ backgroundColor: typeList[item.acceptanceType - 1].color }"></span>{{ item.acceptanceName }}
          </h2>
          <p>验收类型：{{ typeList.filter(i => i.value === item.acceptanceType)[0].name }}</p>
          <p v-if="item.acceptanceType === 1">分项名称：{{ item.engineeringName }}</p>
          <p v-if="item.acceptanceType === 2">隐蔽部位：{{ item.hidePart }}</p>
          <p v-if="item.acceptanceType === 3">单位名称：{{ item.engineeringName }}</p>
          <p v-if="item.acceptanceType === 4">单位名称：{{ item.engineeringName }}</p>
          <p v-if="item.acceptanceType === 5">分部名称：{{ item.engineeringName }}</p>
          <aside>
            <uni-status
              :value="item.status"
              :options="[
                { label: '草稿', value: 0, color: '#7b7b7b' },
                { label: '待审核', value: 1, color: '#7b7b7b' },
                { label: '待验收', value: 2, color: '#7b7b7b' },
                { label: '已驳回', value: 3, color: '#7b7b7b' },
                { label: '验收合格', value: 5, color: '#0079FE' },
                { label: '验收不合格', value: 6, color: '#FF0000' }
              ]"
            ></uni-status>
          </aside>
        </section>
        <footer>
          <template v-if="item.status === 2">
            <span>申请人:{{ item.acceptanceManName }}</span>
            <span>申请日期：{{ item.acceptanceDate | ymd }}</span>
          </template>
          <template v-else-if="item.status === 4">
            <span>验收人:{{ item.acceptanceManName }}</span>
            <span>验收日期：{{ item.acceptanceDate | ymd }}</span>
          </template>
          <template v-else>
            <span>审核人:{{ item.acceptanceManName }}</span>
            <span>审核日期：{{ item.acceptanceDate | ymd }}</span>
          </template>
        </footer>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <!-- <uni-add @click.native="handlerAdd"></uni-add> -->
    <!-- 筛选组件 start -->
    <uni-drawer-filter
      ref="filterRef"
      type="qualityAcceptance"
      userKey="acceptanceManIds"
      @submit="screenCallback"
    ></uni-drawer-filter>
    <!-- 筛选组件 end -->
  </div>
</template>

<script>
import UniDrawerFilter from '@/components/uni-drawer-filter/uni-drawer-filter'
import Api from '@/api/quality/accept'
export default {
  name: 'List',
  components: { UniDrawerFilter },
  data() {
    return {
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        type: 3,
        acceptanceType: null
      },
      total: 0,
      loading: false,
      list: [],
      typeList: [
        { url: 'jianyanpi', value: 1, name: '检验批验收', color: '#f00' },
        { url: 'yinbi', value: 2, name: '隐蔽工程验收', color: '#0f0' },
        { url: 'danwei', value: 3, name: '单位工程验收', color: '#0066ff' },
        { url: 'fenbu', value: 4, name: '分部工程验收', color: '#d000ff' },
        { url: 'fenxiang', value: 5, name: '分项工程验收', color: '#4400ff' }
      ]
    }
  },
  watch: {
    'filterForm.type'() {
      this.init()
    },
    'filterForm.search'() {
      this.init()
    }
  },
  onShow() {
    this.init()
  },
  mounted() {},
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
    // 筛选
    screen() {
      this.$refs.filterRef.open()
    },
    // 筛选回调
    screenCallback(data) {
      this.filterForm = { ...this.filterForm, ...data }
      this.init()
    },
    async refresh() {
      this.loading = true
      const res = await Api.list(this.filterForm)
      this.loading = false
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    },
    loadMore() {
      if (this.total === this.list.length || this.loading) return false
      this.filterForm.page++
      this.refresh()
    },
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh(true)
    },
    // handlerAdd() {
    //   uni.showActionSheet({
    //     itemList: this.typeList.map(e => e.name),
    //     success: res => {
    //       this.$utils.toUrl(
    //         `/pages/quality/statistics/acceptance/select-accept/select-accept?type=${this.typeList[res.tapIndex].value}`
    //       )
    //     }
    //   })
    // },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.search = e.value
    },
    closeDrawer() {
      this.$refs.showRight.close()
    },
    handleDrawerSubmit(data) {
      this.filterForm.acceptanceType = data.acceptIds
    },
    remove() {},
    toDetail(row) {
      if (row.status === 2) {
        let tourl = this.typeList[row.acceptanceType - 1].url
        this.$utils.toUrl(`/pages/quality/statistics/acceptance/${tourl}/edit?acceptId=${row.id}`)
      } else {
        this.$utils.toUrl(`${this.typeList[row.acceptanceType - 1].url}/detail?id=${row.id}`)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url('./list.less');
.uni-tabs {
  /deep/ .item {
    width: 25%;
  }
}
</style>
