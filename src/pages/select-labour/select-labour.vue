<template>
  <div class="main">
    <uni-search-bar placeholder="搜索" @input="changeSearch"></uni-search-bar>
    <view v-if="showCheckAll" class="checkAllContainer" @click="handleCheckAllClick">
      <div class="checkAll" :class="{ 'is-indeterminate': indeterminate, 'is-checked': checkAll }"></div>
      全选
    </view>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y :scroll-into-view="activeAlpha" @click.stop>
      <div class="group-list">
        <div v-for="group in computedList" :key="group.firstLetter" class="item">
          <h3 :id="group.firstLetter">{{ group.firstLetter }}</h3>
          <ul class="user-list">
            <li
              v-for="user in group.children"
              :key="user.id"
              :class="{ active: user.checked, 'is-disabled': !user.workType }"
              @click="handleClick(user)"
            >
              <div class="check"></div>
              <uni-avatar :user="user" :size="80"></uni-avatar>
              <div class="info">
                <p class="name">{{ user.name }}</p>
                <p v-if="activeScreen.groupKey !== 'workType'" class="depart">
                  {{ $getLabelFromArg('workType', user.workType) }}/{{ ['', '男', '女'][user.gender] }}
                </p>
                <p v-else class="depart">{{ user.groupName }}/{{ ['', '男', '女'][user.gender] }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
    <aside v-if="activeScreen.groupKey === 'firstLetter'" class="alpha-list" @click.stop>
      <ul>
        <li
          v-for="e in computedList"
          :key="e.firstLetter"
          :class="{ active: activeAlpha === e.firstLetter }"
          @click="activeAlpha = e.firstLetter"
        >
          {{ e.firstLetter }}
          <div class="max">{{ e.firstLetter }}</div>
        </li>
      </ul>
    </aside>
  </div>
</template>
<script>
import { groupBy, sortBy, map, cloneDeep } from 'lodash'
export default {
  name: 'LabourList',
  data() {
    return {
      keyWorks: '',
      activeAlpha: '',
      key: '',
      list: [],
      canChooseUserIdList: [],
      disabledUserIds: [],
      multiple: false,
      roles: [],
      showCheckAll: false, //是否显示全选按钮
      checkAll: false, //是否全部选中
      indeterminate: false, //是否有选中项

      screen: [
        { groupKey: 'firstLetter', value: 1, name: '全部', color: '#f00' },
        { groupKey: 'labourCompanyName', value: 2, name: '按劳务公司', color: '#f00' },
        { groupKey: 'jobStatus', fromArg: true, value: 3, name: '按在职情况', color: '#0f0' },
        { groupKey: 'groupName', value: 4, name: '按班组', color: '#0066ff' },
        { groupKey: 'workType', fromArg: true, value: 5, name: '按工种', color: '#d000ff' }
      ], // 筛选
      activeScreen: {}
    }
  },
  computed: {
    computedList() {
      let groupKey = this.activeScreen.groupKey || ''
      // const { groupKey } = this.activeScreen
      let list
      if (this.keyWorks) {
        list = this.list.filter(e => e.name.includes(this.keyWorks))
      } else {
        list = this.list
      }
      if (this.canChooseUserIdList.length) {
        list = list.filter(e => this.canChooseUserIdList.includes(e.id))
      }
      if (this.disabledUserIds.length) {
        list = list.filter(e => !this.disabledUserIds.includes(e.id))
      }
      if (this.roles.length) {
        list = this.list.filter(e => this.roles.includes(e.roleName))
      }
      list.forEach(e => {
        // console.log(groupKey, 'computed')
        if (!e[groupKey]) {
          // e[groupKey] = '无'
          e[groupKey] = null
        }
      })
      // console.log(list)
      let groupList = groupBy(list, groupKey)
      const result = map(groupList, (v, k) => {
        let firstLetter = this.activeScreen.fromArg ? this.$getLabelFromArg(groupKey, k) : k
        return {
          children: v,
          firstLetter
        }
      })
      return sortBy(result, groupKey)
    },
    checkedList() {
      return this.list.filter(e => e.checked)
    }
  },
  watch: {
    checkedList: {
      handler(val) {
        // console.log('checklist change')
        this.setCheckAllState()
      },
      deep: true,
      immediate: true
    },

    computedList: {
      handler() {
        this.setCheckAllState()
      },
      deep: true,
      immediate: true
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    uni.stopPullDownRefresh()
  },
  onLoad(option) {
    this.queryLabourList(option)
    // 设置分组选项
    this.activeScreen = _.find(this.screen, { groupKey: option.groupKey })
    // console.log('onload', option.groupKey, this.activeScreen)
    // 全选相关
    this.showCheckAll = option.showCheckAll === 'true'
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'save') {
      this.submit()
    }
  },
  methods: {
    queryLabourList(option) {
      this.fly.labour
        .post('employee/list', {
          page: 1,
          rows: 100000,
          jobStatus: 'jobStatus_1',
          projectId: wx.getStorageSync('projectId')
        })
        .then(res => {
          res.data.records.forEach(e => (e.checked = false))
          let list = res.data.records || []
          list.forEach(e => (e.checked = false))
          this.key = option.key
          this.multiple = option.multiple === 'true'
          this.roles = option.roles.split(',').filter(e => e)
          if (option.canChooseUserIds) {
            this.canChooseUserIdList = option.canChooseUserIds.split(',')
          }
          if (option.disabledUserIds) {
            this.disabledUserIds = option.disabledUserIds.split(',')
          }
          const checkedIds = option.checkedIds ? option.checkedIds.split(',') : []
          list.forEach(user => {
            if (checkedIds.includes('' + user.id)) {
              user.checked = true
            }
          })
          this.list = list
        })
    },
    // 搜索
    changeSearch({ value }) {
      this.keyWorks = value
    },
    handleClick(f) {
      if (!f.workType) return
      if (this.multiple) {
        f.checked = !f.checked
      } else {
        uni.$emit('update:select-labour', {
          key: this.key,
          value: [f]
        })
        uni.navigateBack()
      }
    },
    submit() {
      if (this.checkedList.length === 0) {
        this.$utils.showToast('请选择成员')
        return
      }
      uni.$emit('update:select-labour', {
        key: this.key,
        value: this.checkedList
      })
      uni.navigateBack()
    },
    // 点击全选
    handleCheckAllClick() {
      if (this.checkAll) {
        //取消全选
        this.checkAll = false
        this.indeterminate = false
        this.computedList.forEach(item => {
          item.children &&
            item.children.forEach(subItem => {
              subItem.checked = false
            })
        })
      } else {
        //全选
        this.checkAll = true
        this.indeterminate = false
        this.computedList.forEach(item => {
          item.children &&
            item.children.forEach(subItem => {
              subItem.checked = true
            })
        })
      }
    },
    // 根据选中项设置全选状态
    setCheckAllState() {
      let size = _.map(this.computedList, e => (e.children && e.children.length) || 0)
      let totalLength = _.reduce(size, function(sum, n) {
        return sum + n
      })
      this.checkAll = totalLength === this.checkedList.length
      this.indeterminate = this.checkedList.length > 0 && totalLength !== this.checkedList.length
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./select-labour.less');
</style>
