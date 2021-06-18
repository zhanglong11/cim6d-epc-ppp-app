<template>
  <div class="main">
    <uni-search-bar placeholder="搜索" @input="changeSearch"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y @click.stop>
      <div class="group-list">
        <div v-for="group in computedList" :key="group.companyId" class="item">
          <div class="company" :class="{ open: group.openStatus }" @click="changeArrow(group)">
            <span class="name">{{ group.name }}</span>
            <span class="arrow"></span>
          </div>
          <ul class="user-list" :class="{ open: group.openStatus }">
            <li
              v-for="item in group.children"
              :key="item.id"
              :class="{ active: item.checked }"
              @click="toDetails(item)"
            >
              <uni-avatar :user="{ name: item.principalName }" :size="80"></uni-avatar>
              <div class="info">
                <p class="name">{{ item.lisencePlate }}</p>
                <p class="depart">{{ item.principalName }}</p>
              </div>
              <div class="desc">{{ item.carType }}</div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import { groupBy, map } from 'lodash'

export default {
  name: 'HealthyVehicleList',
  data() {
    return {
      keyWorks: '',
      activeAlpha: '',
      key: '',
      list: [],
      computedList: [],
      multiple: false,
      roles: []
    }
  },
  watch: {
    list() {
      let list = []
      if (this.keyWorks) {
        list = this.list.filter(e => e.lisencePlate.includes(this.keyWorks))
      } else {
        list = this.list
      }
      let groupList = groupBy(list, 'subordinateCompanyName')
      this.computedList = map(groupList, (v, k) => ({
        name: k,
        companyId: v.companyId,
        children: v,
        checked: false,
        openStatus: true
      }))
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    uni.stopPullDownRefresh()
  },
  onLoad(option) {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.selectScreen()
    }
  },
  methods: {
    // 初始化
    async init() {
      this.list = await this.fly.construction
        .post('carManage/querylist', {
          page: 1,
          rows: 10000,
          projectId: uni.getStorageSync('projectId')
        })
        .then(res => res.data.records)
    },
    // 展开闭合分组
    changeArrow(e) {
      e.openStatus = !e.openStatus
    },
    // 跳转详情
    toDetails(e) {
      this.$utils.toUrl(`/pages/labour/healthy/healthy-vehicle-details?id=${e.id}`)
    },
    // 搜索
    changeSearch({ value }) {
      this.keyWorks = value
      this.list = this.list.slice()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./healthy.less');
</style>
