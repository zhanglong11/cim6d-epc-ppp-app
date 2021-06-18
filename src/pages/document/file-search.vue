<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="输入文件名"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <FileList :list="list" style="background-color: transparent" @clickDoc="handleClickFile"></FileList>
    </scroll-view>
    <EmptyTemplate v-if="total === 0" />
  </div>
</template>

<script>
import Api from '@/api/document'
import FileList from '@/pages/document/components/FileList'
import _ from 'lodash'
export default {
  name: 'FileSearch',
  components: { FileList },
  data() {
    return {
      list: [],
      total: 0,
      keyword: '',
      page: 1,
      rows: 5,
      folderId: ''
    }
  },
  watch: {},
  onLoad(options) {
    this.folderId = options.folderId || ''
  },
  onShow() {},
  onPullDownRefresh() {
    this.page = 1
    this.list = []
    this.getFileList()
  },
  onNavigationBarButtonTap(obj) {},
  created() {},
  methods: {
    getFileList: _.debounce(async function() {
      this.loading = true
      let res = await Api.searchFileList({ keyword: this.keyword, page: this.page, rows: this.rows })
      let pageList =
        res.data &&
        res.data.records &&
        res.data.records.map(item => {
          return {
            id: item.id,
            name: item.name,
            createTime: item.createTime,
            creator: '未知'
          }
        })
      this.list = [...this.list, ...pageList]
      this.total = this.list?.length || 0
    }, 100),
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.keyword = e.value.trim()
      this.list = []
      this.getFileList()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.list = []
      this.keyword = ''
      this.getFileList()
    },
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.page++
      this.getFileList()
    },
    handleClickFile(data) {
      this.$utils.toUrl(`/pages/document/file-detail?fileId=${data.id}`)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./file-search.less');
</style>
