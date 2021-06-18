<template>
  <div class="main">
    <uni-search-bar
      placeholder="测量项/创建人"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll list" @refresherrefresh="init" @scrolltolower="loadMore">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <section>
          <h2>
            {{ item.measureLocation }}
          </h2>
          <p>测量分项：{{ item.measureStandardName }}</p>
          <p>测量指标：{{ item.metricNames }}</p>
          <aside>
            <uni-status
              :value="item.status"
              :options="[
                { label: '不合格', value: 0, color: '#F95E5A' },
                { label: '合格', value: 1, color: '#25CC70' }
              ]"
            ></uni-status>
          </aside>
        </section>
        <footer>
          <span>测量人:{{ item.creatorName }}</span>
          <span>测量时间：{{ item.createTime | ymd }}</span>
        </footer>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add v-if="type !== 'reMeasure'" @click="handlerAdd"></uni-add>
    <!-- 筛选组件 start -->
    <uni-drawer-filter
      ref="filterRef"
      :is-re-measure="type === 'reMeasure'"
      type="measure"
      @submit="screenCallback"
    ></uni-drawer-filter>
    <!-- 筛选组件 end -->
  </div>
</template>

<script>
import UniDrawerFilter from '@/components/uni-drawer-filter/uni-drawer-filter'
export default {
  name: 'List',
  components: { UniDrawerFilter },
  data() {
    return {
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        projectId: this.$store.state.project.projectId
      },
      total: 0,
      loading: false,
      list: [],
      typeList: [
        { url: 'measure', value: 1, name: '实测实量', color: '#f00' },
        { url: 'retest', value: 2, name: '复测', color: '#0f0' }
      ],
      type: '' // reMeasure 复测
    }
  },
  onLoad(options) {
    this.type = options.type
    if (options.type === 'reMeasure') {
      this.$utils.showToast('选择一项进行复测')
      this.filterForm.status = 0
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
      if (this.type === 'reMeasure') {
        this.filterForm.status = 0
      }
      this.init()
    },
    async refresh() {
      this.loading = true
      const res = await this.fly.safety.post('measureRecord/page', this.filterForm)
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

    handlerAdd() {
      uni.showActionSheet({
        itemList: this.typeList.map(e => e.name),
        success: res => {
          if (res.tapIndex === 0) {
            this.$utils.toUrl(`/pages/quality/measure/add`)
          } else if (res.tapIndex === 1) {
            this.$utils.toUrl('/pages/quality/measure/list?type=reMeasure')
          }
        }
      })
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.search = e.value
      this.init()
    },
    //当用户清空关键词触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.search = ''
      this.refresh()
    },
    closeDrawer() {
      this.$refs.showRight.close()
    },
    handleDrawerSubmit(data) {
      this.filterForm.acceptanceType = data.acceptIds
    },
    remove() {},
    toDetail(row) {
      if (this.type === 'reMeasure') {
        this.$utils.toUrl(`/pages/quality/measure/reMeasure?id=${row.id}`)
      } else {
        this.$utils.toUrl(`/pages/quality/measure/detail?id=${row.id}`)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url('./list.less');
.main {
  padding-top: 5px;
}
</style>
