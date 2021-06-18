<template>
  <div class="main">
    <uni-search-bar placeholder="搜索" @input="changeSearch"></uni-search-bar>
    <uni-card class="labour-total">
      <ul>
        <li>
          <p>在库</p>
          <b>{{ list.length }}</b>
        </li>
        <li class="job">
          <p>在职</p>
          <b>{{ onTheJobLength }}</b>
        </li>
        <li class="quit">
          <p>离职</p>
          <b>{{ dimissionLength }}</b>
        </li>
      </ul>
    </uni-card>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y :scroll-into-view="activeAlpha" @click.stop>
      <div class="group-list">
        <div v-for="group in computedList" :key="group.firstLetter" class="item">
          <h3 :id="group.firstLetter">{{ group.firstLetter }}</h3>
          <ul class="user-list">
            <li
              v-for="user in group.children"
              :key="user.id"
              :class="{ active: user.checked }"
              @click="toDetails(user)"
            >
              <uni-avatar :user="user" :size="80"></uni-avatar>
              <div class="info">
                <p class="name">{{ user.name }}</p>
                <p class="depart">{{ user.labourCompanyName }} / {{ $getLabelFromArg('workType', user.workType) }}</p>
              </div>
              <div class="sex">{{ ['', '男', '女'][user.gender] }}</div>
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
    <uni-add @click.native="add"></uni-add>
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
      multiple: false,
      roles: [],
      screen: [
        { groupKey: 'firstLetter', value: 1, name: '全部', color: '#f00' },
        { groupKey: 'labourCompanyName', value: 2, name: '按劳务公司', color: '#f00' },
        { groupKey: 'jobStatus', fromArg: true, value: 3, name: '按在职情况', color: '#0f0' },
        { groupKey: 'groupName', value: 4, name: '按班组', color: '#0066ff' },
        { groupKey: 'workType', fromArg: true, value: 5, name: '按工种', color: '#d000ff' }
      ], // 筛选
      activeScreen: { groupKey: 'firstLetter', value: 1, name: '全部', color: '#f00' }
    }
  },
  computed: {
    computedList() {
      const { groupKey } = this.activeScreen
      let list
      if (this.keyWorks) {
        list = this.list.filter(e => e.name.includes(this.keyWorks))
      } else {
        list = this.list
      }
      if (this.roles.length) {
        list = this.list.filter(e => this.roles.includes(e.roleName))
      }
      list.forEach(e => {
        if (!e[groupKey]) {
          e[groupKey] = '无'
        }
      })
      console.log(list)
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
    onTheJobLength() {
      console.log(this.list)
      return this.list.filter(e => e.jobStatus === 'jobStatus_1').length
    },
    dimissionLength() {
      return this.list.filter(e => e.jobStatus === 'jobStatus_2').length
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    uni.stopPullDownRefresh()
  },
  onShow() {
    this.fly.labour
      .post('employee/list', { page: 1, rows: 100000, projectId: wx.getStorageSync('projectId') })
      .then(res => {
        res.data.records.forEach(e => (e.checked = false))
        this.list = res.data.records
      })
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.selectScreen()
    }
  },
  methods: {
    // 跳转详情
    toDetails(e) {
      this.$utils.toUrl(`/pages/labour/labour-user-details?id=${e.id}`)
    },
    // 搜索
    changeSearch({ value }) {
      this.keyWorks = value
    },
    // 筛选
    selectScreen() {
      uni.showActionSheet({
        itemList: this.screen.map(e => e.name),
        success: res => {
          this.activeScreen = this.screen[res.tapIndex]
        }
      })
    },
    add() {
      this.$utils.toUrl('labour-user-edit')
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./labour.less');
</style>
