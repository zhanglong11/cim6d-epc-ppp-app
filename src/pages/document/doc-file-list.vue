<template>
  <div class="main is-white">
    <div v-if="showSearch" class="tabs-wrap">
      <uni-search-bar
        placeholder="输入文件名"
        @confirm="handleSearchBarConfirm"
        @input="handleSearchBarInput"
      ></uni-search-bar>
    </div>
    <div v-else class="nav-title">
      {{ categoryContent }} <span class="ellipsis"> {{ subContent ? '>' + subContent : '' }}</span
      >><span class="ellipsis"> {{ subCustomContent }}</span
      >><span class="ellipsis">{{ name }}</span>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <FileList :list="list" @clickDoc="handleClickFile"></FileList>
    </scroll-view>
    <EmptyTemplate v-if="total === 0" />
  </div>
</template>

<script>
import Api from '@/api/document'
import FileList from '@/pages/document/components/FileList'
export default {
  name: 'DocFileList',
  components: { FileList },
  data() {
    return {
      list: [],
      total: 0,
      //1集团//2行业//3项目
      categoryType: '',
      categoryContent: '',
      //第二级菜单 集团:''行业:1隧道建设2桥梁建设3道路建设4水利建设;项目:项目名称
      subType: '',
      subContent: '',
      //第三级菜单 集团:1建设2设计3勘察4施工5监理6劳务7基坑支护 行业:1劳务类2环保类3给排水4强电5弱电;项目:1安全资料2质量资料3图纸资料4设计资料
      subCustomType: '',
      subCustomContent: '',
      //最底层自定义文件夹
      id: '',
      name: '',
      sort: 'name',
      showSearch: false,
      keyword: '',
      originList: []
    }
  },
  watch: {},
  onLoad(options) {
    let { categoryType, categoryContent, subType, subContent, subCustomType, subCustomContent, id, name } = options
    this.categoryType = categoryType
    this.categoryContent = categoryContent
    this.subType = subType
    this.subContent = subContent
    this.subCustomType = subCustomType
    this.subCustomContent = subCustomContent
    this.id = id
    this.name = name
    this.$utils.setTitle(this.name)
  },
  onShow() {
    this.getFileList()
  },
  onPullDownRefresh() {
    if (this.showSearch) {
      uni.stopPullDownRefresh()
      return
    }
    this.getFileList()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'add') {
      this.$utils.toUrl(`/pages/document/upload-file?id=${this.id}`)
    }
    if (obj.key === 'sort') {
      this.showSortSheet()
    }
    if (obj.key === 'search') {
      // this.$utils.toUrl(`/pages/document/file-search?folderId=${this.id}`)
      this.keyword = ''
      this.showSearch = !this.showSearch
    }
  },
  created() {
    //this.getFileList()
  },
  methods: {
    async getFileList() {
      let res = await Api.getFileList(this.id)
      this.list =
        res.data &&
        res.data.fileList &&
        res.data.fileList.map((item, index) => {
          return {
            id: item.id,
            name: item.fileName,
            createTime: item.createTime,
            creatorName: item.creatorName
          }
        })
      this.originList = [...this.list]
      this.total = this.list?.length || 0
    },
    handleSort() {
      let sortArr = _.sortBy(this.list, o => {
        return o[this.sort]
      })
      this.list = [...sortArr]
    },
    handleClickFile(data) {
      this.$utils.toUrl(`/pages/document/file-detail?fileId=${data.id}`)
    },
    showSortSheet() {
      let that = this
      //  itemList: ['创建时间', '文件名称', '更新时间'],
      uni.showActionSheet({
        itemList: ['创建时间', '文件名称'],
        success: function(res) {
          if (res.tapIndex === 0) {
            that.sort = 'createTime'
          } else if (res.tapIndex === 1) {
            that.sort = 'name'
          } else {
            that.sort = 'id'
          }
          that.handleSort()
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    handleSearchBarConfirm(e) {
      this.keyword = e.value.trim()
      this.listFilter()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      this.keyword = e.value.trim()
      this.listFilter()
    },
    listFilter() {
      this.list = this.originList.filter(item => {
        if (this.keyword) {
          return item.name.indexOf(this.keyword) >= 0
        } else {
          return true
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import url('./doc-file-list.less');
@import url('./index.less');
</style>
