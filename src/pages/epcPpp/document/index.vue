<template>
  <div class="main is-white">
    <Tabs ref="tabs" v-model="curTab" :tabList="tabList" @click="tabClick" />
    <uni-search-bar placeholder="输入文件名" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput" />
    <div v-if="isLoading" class="load">
      <LoadMore status="loading"></LoadMore>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <ul class="doc-list">
        <li v-for="item in list" :key="item.id" class="item" @click="toSub(item)">
          <div>
            <FileAvatar :isFolder="item.folderFlag || !id" :name="item.name" />
          </div>
          <div class="title">
            {{ item.name }}
          </div>
          <p v-if="!id || item.folderFlag" class="more" @click.stop="showDetail($event, item)" />
        </li>
      </ul>
    </scroll-view>
    <Popover
      v-model="popVisible"
      :dynamic="true"
      :popData="!id ? rootPopData : PopData"
      :x="x"
      :y="y"
      placement="top-end"
      @tapPopup="popClick"
    />
    <uni-add v-if="isFile !== '1'" @click.native="add" />
  </div>
</template>

<script>
import LoadMore from './components/LoadMore'
import FileAvatar from './components/FileAvator'
import Popover from './components/Popover/Popover'
import Tabs from './components/Tabs'
import Api from './api'
export default {
  name: 'Document',
  // import引入的组件
  components: {
    LoadMore,
    FileAvatar,
    Popover,
    Tabs
  },
  data() {
    // 这里存放数据
    return {
      activeType: '1',
      curTab: '1',
      keyword: '',
      list: [],
      id: null,
      isLoading: false,
      isFirst: true,
      popVisible: false,
      tabList: [
        { label: '工程管理', value: '1' },
        { label: '商务合约', value: '2' },
        { label: '行政管理', value: '3' },
        { label: '项目特色', value: '4' },
        { label: '竣工资料', value: '7' }
      ],
      rootPopData: [
        { title: '删除', type: 'remove' },
        { title: '编辑', type: 'edit' }
      ],
      PopData: [
        { title: '删除', type: 'remove' },
        { title: '编辑', type: 'edit' },
        { title: '查看', type: 'watch' }
      ],
      x: 0,
      y: 0,
      activeRow: {},
      level: 1,
      isFile: 0
    }
  },
  onLoad(options) {
    const { id, activeType, curTab, level, firstLevelId, isFile } = options
    this.activeType = activeType || '1'
    this.curTab = curTab || '1'
    this.id = id || null
    this.level = level || 1
    this.firstLevelId = firstLevelId || null
    this.isFile = isFile
  },
  onShow() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      if (this.id) {
        this.getSubList()
      } else {
        this.getDocumentList()
      }
    },
    //获取子文件夹
    async getDocumentList() {
      // this.isLoading = true
      const res = await Api.folderList({
        category: this.activeType
      })
      this.originList = _.cloneDeep(res.data)
      this.list = this.originList
      // this.isLoading = false
    },
    //获取子文件夹
    async getSubList() {
      // this.isLoading = true
      const res = await Api.subList({ id: this.id })
      this.originList = _.cloneDeep(res.data)
      this.list = this.originList.filter(r => (this.isFile === '1' ? !r.folderFlag : r.folderFlag))
      // this.isLoading = false
    },
    //跳转子文件夹
    toSub(row) {
      if (row.level !== 1 && !row.folderFlag) {
        this.$utils.toUrl(`/pages/epcPpp/document/detail?fileId=${row.fileId}`)
      } else {
        const firstLevelId = row.level === 1 ? row.id : this.firstLevelId
        const isFile = row.level === 3 ? 1 : 0
        this.$utils.toUrl(
          `/pages/epcPpp/document/index?isFile=${isFile}&id=${row.id}&activeType=${this.activeType}&level=${
            row.level + 1
          }&firstLevelId=${firstLevelId}&curTab=${this.curTab}`
        )
      }
    },
    //跳转子文件
    toShowFile() {
      this.$utils.toUrl(
        `/pages/epcPpp/document/index?isFile=1&id=${this.activeRow.id}&activeType=${this.activeType}&level=${
          this.activeRow.level + 1
        }&firstLevelId=${this.firstLevelId}&curTab=${this.curTab}`
      )
    },
    //过滤
    listFilter() {
      this.list = this.originList.filter(r => r.name.includes(this.keyword))
    },
    //搜索
    handleSearchBarConfirm(e) {
      this.keyword = e.value.trim()
      this.listFilter()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      this.keyword = e.value.trim()
      this.listFilter()
    },
    //跳转添加
    add() {
      if (!this.id) {
        this.$utils.toUrl(`/pages/epcPpp/document/add?activeType=${this.activeType}&level=${this.level}`)
      } else {
        this.$utils.toUrl(
          `/pages/epcPpp/document/add?activeType=${this.activeType}&level=${this.level}&pid=${this.id}&firstLevelId=${this.firstLevelId}`
        )
      }
    },
    //跳转编辑
    edit() {
      this.$utils.toUrl(
        `/pages/epcPpp/document/add?isEdit=true&id=${this.activeRow.id}&activeType=${this.activeType}&level=${this.activeRow.level}`
      )
    },
    //打开冒泡框
    showDetail(e, item) {
      this.x = e.touches[0].clientX
      this.y = e.touches[0].clientY
      this.popVisible = true
      this.activeRow = item
    },
    //删除
    async remove() {
      uni.showModal({
        title: '提示',
        content: `确定要删除当前项吗 ?`,
        success: async res => {
          if (res.confirm) {
            !this.id
              ? await Api.removeRoot(this.activeRow.id)
              : await Api.removeChild({
                  level: this.activeRow.level,
                  id: this.activeRow.id,
                  firstLevelId: this.firstLevelId
                })
            this.$utils.showToast('操作成功')
            this.refresh()
          }
        }
      })
    },
    //切换tab
    tabClick(item) {
      if (item === '7') {
        this.showMenu()
        return
      }
      this.curTab = ['5', '6'].includes(item) ? '7' : item
      this.activeType = item
      this.id = null
      this.level = 1
      this.refresh()
    },
    showMenu() {
      uni.showActionSheet({
        itemList: ['施工单位资料', '监理单位资料'],
        success: res => {
          let index = res.tapIndex
          this.tabClick(index === 0 ? '5' : '6')
        }
      })
    },
    //点击冒泡框
    popClick(e) {
      if (e.type === 'remove') {
        this.remove()
      } else if (e.type === 'edit') {
        this.edit()
      } else {
        this.toShowFile()
      }
    }
  }
}
</script>

<style scoped lang="less">
@import './index';
</style>
