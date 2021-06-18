<template>
  <div class="main is-white">
    <div v-if="showSearch" class="tabs-wrap">
      <uni-search-bar
        placeholder="输入文件名"
        @confirm="handleSearchBarConfirm"
        @input="handleSearchBarInput"
      ></uni-search-bar>
    </div>
    <div v-else class="tabs-wrap">
      <uni-tabs v-model="type">
        <uni-tab-pane name="1" label="集团资料"></uni-tab-pane>
        <uni-tab-pane name="2" label="行业资料"></uni-tab-pane>
        <uni-tab-pane name="3" label="项目资料"></uni-tab-pane>
      </uni-tabs>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <!--      <DocList :key="type + '' + step" :list="list" @clickDoc="handleClickDoc"> </DocList>-->
      <DocList :list="list" @clickDoc="handleClickDoc"> </DocList>
    </scroll-view>
    <EmptyTemplate v-if="total === 0" />
  </div>
</template>
<script>
import Api from '@/api/document'
import DocList from '@/pages/document/components/DocList'
export default {
  name: 'Index',
  components: { DocList },
  data() {
    return {
      type: '1',
      step: 1,
      subType: '', //第二层目录 隧道建设2桥梁建设3道路建设4水利建设   项目名称这些
      subContent: '',
      subCustomType: '', //第三层 1建设2设计3勘察4施工5监理6劳务7基坑支护 (1安全资料2质量资料3图纸资料4设计资料)(1劳务类2环保类3给排水4强电5弱电)
      subCustomContent: '',
      list: [],
      total: 10,
      showSearch: false,
      keyword: '',
      originList: []
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        this.total = 10 //给个默认,防止出现空白提示
        this.step = 1
        this.subType = 0
        this.subContent = ''
        this.getRootFolderList(val)
      }
    }
  },
  onPullDownRefresh() {
    //this.getFolderList()
  },
  onBackPress() {
    this.showSearch = false
    if (this.step !== 1) {
      // this.type = '1'
      this.total = 10 //给个默认,防止出现空白提示
      this.step = 1
      this.subType = 0
      this.subContent = ''
      this.getRootFolderList(this.type)
      return true
    } else {
      return false
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'add') {
      let that = this
      uni.showActionSheet({
        itemList: ['上传文件', '新建文件夹'],
        success: function (res) {
          if (res.tapIndex === 0) {
            that.$utils.toUrl(`/pages/document/select-document?allowLast=true&key=123`)
          } else {
            that.$utils.toUrl(`/pages/document/document-add-folder`)
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
    if (obj.key === 'search') {
      // this.$utils.toUrl(`/pages/document/file-search`)
      this.keyword = ''
      this.showSearch = !this.showSearch
    }
  },
  onShow() {
    this.total = 10 //给个默认,防止出现空白提示
    this.step = 1
    this.subType = null
    this.subCustomType = null
    this.type = '1'
    this.getRootFolderList('1')
  },
  created() {},
  methods: {
    //获取最底层自定义文件夹
    async getFolderList() {
      let param = {
        categoryType: this.type,
        type: this.subCustomType
      }
      if (this.type === '2') param.industryType = this.subType
      if (this.type === '3') param.projectId = this.subType
      let res = await Api.getFolderList(param)
      this.list = res.data && res.data.records
      this.originList = [...this.list]
      this.total = res.data && res.data.total
    },
    async getRootFolderList(val) {
      switch (val) {
        case '1':
          this.list = this.$getArgList('corpCategory').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          this.originList = [...this.list]
          break
        case '2':
          this.list = this.$getArgList('industryCategory').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          this.originList = [...this.list]
          break
        case '3':
          this.list = [
            {
              id: uni.getStorageSync('projectId'),
              name: uni.getStorageSync('projectName')
            }
          ]
          this.originList = [...this.list]
          break
      }
    },
    async handleClickDoc(data) {
      this.showSearch = false
      let content = ['集团资料', '行业资料', '项目资料']
      if (this.step === 3) {
        this.step = 4
        this.$utils.toUrl(
          `/pages/document/doc-file-list?categoryType=${this.type}&categoryContent=${content[this.type - 1]}&subType=${
            this.subType
          }&subContent=${this.subContent}&subCustomType=${this.subCustomType}&subCustomContent=${
            this.subCustomContent
          }&id=${data.id}&name=${data.name}`
        )
      } else {
        if (this.type === '1' && this.step === 1) {
          this.step = 3
          this.subType = ''
          this.subContent = ''
          this.subCustomType = data.id
          this.subCustomContent = data.name
          await this.getFolderList()
          return
        }
        if (this.type === '2' && this.step === 1) {
          this.step = 2
          this.subType = data.id
          this.subContent = data.name
          this.list = this.$getArgList('industryInfomationType').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          this.originList = [...this.list]
          return
        }
        if (this.type === '3' && this.step === 1) {
          this.step = 2
          this.subType = data.id
          this.subContent = data.name
          this.list = this.$getArgList('informationType').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          this.originList = [...this.list]
          return
        }
        if (this.type === '2' && this.step === 2) {
          this.step = 3
          this.subCustomType = data.id //最底层文件夹
          this.subCustomContent = data.name
          //获取行业资料最底层
          await this.getFolderList()
          return
        }
        if (this.type === '3' && this.step === 2) {
          this.step = 3
          this.subCustomType = data.id
          this.subCustomContent = data.name
          //获取项目资料最底层
          await this.getFolderList()
          return
        }
      }
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
@import url('./index.less');
</style>
