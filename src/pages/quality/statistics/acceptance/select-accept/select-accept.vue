<template>
  <div class="accept-wrap">
    <uni-search-bar v-model="filterForm.q" placeholder="搜索"></uni-search-bar>
    <ul>
      <li v-for="item in dataList" :key="item.id" :class="{ active: item.id === curId }" @click="curId = item.id">
        <p>
          <span>{{ item.acceptanceName }}</span
          ><span>({{ item.acceptanceApplyNumber }})</span>
        </p>
        <p>
          {{ item.acceptanceManName }}
        </p>
      </li>
    </ul>
    <EmptyTemplate v-if="dataList.length === 0"></EmptyTemplate>
  </div>
</template>

<script>
import { clone, debounce } from 'lodash'
import Api from '@/api/quality/accept'
export default {
  name: 'SelectAccept',
  components: {},
  data() {
    return {
      type: null,
      filterForm: {},
      loading: false,
      dataList: [],
      curId: null,
      typeList: [
        { url: 'jianyanpi', value: 1, name: '检验批验收' },
        { url: 'yinbi', value: 2, name: '隐蔽工程验收' },
        { url: 'danwei', value: 3, name: '单位工程验收' },
        { url: 'fenbu', value: 4, name: '分部工程验收' },
        { url: 'fenxiang', value: 5, name: '分项工程验收' }
      ]
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.text === '确定') {
      if (!this.curId) {
        this.$utils.showToast('请选择验收')
        return
      }
      let tourl = this.typeList.filter(item => item.value + '' === this.type)[0].url
      this.$utils.toUrl(`/pages/quality/statistics/acceptance/${tourl}/edit?acceptId=${this.curId}`)
    }
  },
  onLoad(options) {
    this.type = options.type
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.refresh()
  },
  watch: {
    'filterForm.q': debounce(function(v) {
      this.refresh()
    }, 300)
  },
  created() {
    this.refresh()
  },
  mounted() {},

  methods: {
    async refresh() {
      this.loading = true
      const res = await Api.getAcceptanceApplyList({
        search: this.filterForm.q ? this.filterForm.q.value : '',
        acceptanceType: this.type
      })
      this.loading = false
      this.dataList = res.data
    }
  }
}
</script>

<style scoped lang="less">
@import url('./select-accept.less');
</style>
