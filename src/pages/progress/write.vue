<template>
  <div class="main">
    <uni-search-bar v-model="filterForm.q" placeholder="搜索"></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll list" @refresherrefresh="init" @scrolltolower="loadMore">
      <div v-for="item in list" :key="item.id" class="card item" @click="$utils.toUrl(item.url)">
        <section>
          <h2>{{ item.name }}</h2>
          <p>计划开始时间：{{ item.startTime }}</p>
          <p>计划结束时间：{{ item.endTime }}</p>
          <aside class="plan-number">
            4-6
          </aside>
        </section>
        <footer>
          <span>填报人:{{ item.username }}</span>
          <span>填报时间：{{ item.date }}</span>
        </footer>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add @click.native="handlerAdd"></uni-add>
    <uni-drawer-filter ref="filter"></uni-drawer-filter>
  </div>
</template>

<script>
import UniDrawerFilter from '@/components/uni-drawer-filter/uni-drawer-filter'
export default {
  name: 'Write',
  components: { UniDrawerFilter },
  data() {
    return {
      filterForm: {
        q: '',
        page: 1,
        rows: 5,
        type: 0
      },
      total: 0,
      loading: false,
      list: []
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  onNavigationBarButtonTap(obj) {
    if (obj.text === '筛选') {
      this.$refs.filter.open()
      console.log(this.$refs.filter)
    }
  },
  methods: {
    async refresh() {
      this.loading = true
      const { records, total } = {
        total: 10,
        records: new Array(5).fill('').map((e, index) => ({
          id: 'a' + Math.random(),
          name: '王城大道主体工程',
          type: index + 1,
          position: '桩底',
          date: '2016-05-06',
          startDate: '2016-05-06',
          endDate: '2018-05-06',
          username: '小明'
        }))
      }
      this.loading = false
      this.total = total
      this.list.push(...records)
    },
    loadMore() {
      if (this.total === this.list.length || this.loading) return false
      this.filterForm.page++
      this.refresh()
    },
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    handlerAdd() {},
    closeDrawer() {
      this.$refs.showRight.close()
    },
    submit() {},
    remove() {}
  }
}
</script>

<style scoped lang="less">
@import url('./write.less');
</style>
