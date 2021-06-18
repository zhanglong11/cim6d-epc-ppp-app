<template>
  <div class="main is-white">
    <uni-search-bar placeholder="搜索用户名" @input="handleInput"></uni-search-bar>
    <scroll-view
      class="scroll-roll"
      scroll-with-animation
      scroll-y
      :scroll-into-view="activeAlpha"
      @click.stop
      @scroll="handleScroll"
    >
      <div v-if="topNavVisible" class="top-nav">
        <uni-form-item
          :iconSize="80"
          label="公司部门"
          icon="/static/images/struct.png"
          isLink
          @click="$utils.toUrl('/pages/contact/department/department')"
        ></uni-form-item>
        <!--        屏蔽此功能-->
        <!--  <uni-form-item
          :iconSize="80"
          label="同事收藏夹"
          icon="/static/images/star.png"
          isLink
          @click="$utils.toUrl('/pages/contact/collection/collection')"
        ></uni-form-item>-->
      </div>
      <div class="group-list">
        <div v-for="group in computedList" :key="group.firstLetter" class="item">
          <h3 :id="group.firstLetter">{{ group.firstLetter }}</h3>
          <ul class="user-list">
            <li
              v-for="user in group.children"
              :key="user.id"
              :class="{ active: user.checked }"
              @click="handleClick(user)"
              @touchstart="handleTouchstart"
              @longpress="() => handleLongpress(user)"
            >
              <uni-avatar :user="user" :size="80"></uni-avatar>
              <div class="info">
                <p class="name">{{ user.name }}</p>
                <p class="depart">
                  {{ user.roleName }}
                  <span v-if="user.remark" class="remark">{{ user.remark }}</span>
                </p>
              </div>
              <div class="check"></div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 无数据空载页 start -->
      <EmptyTemplate v-if="computedList.length === 0" />
      <!-- 无数据空载页 end -->
    </scroll-view>
    <aside class="alpha-list" @click.stop>
      <ul>
        <li v-for="e in computedList" :key="e.firstLetter" @click="activeAlpha = e.firstLetter">
          {{ e.firstLetter }}
          <div class="max">{{ e.firstLetter }}</div>
        </li>
      </ul>
    </aside>
  </div>
</template>
<script>
import { groupBy, sortBy, map } from 'lodash'
export default {
  name: 'UserList',
  props: {
    // 是否显示顶部 选择部门、我的收藏 跳转按钮
    topNavVisible: {
      type: Boolean,
      default: false
    },
    // 收藏夹id，设置此项将展示收藏夹用户
    collectionId: {
      type: String,
      default: null
    },
    // 部门id
    departmentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      q: '',
      activeAlpha: '',
      moved: false //点击之后是否移动过,解决长按之后滑动页面的bug
    }
  },
  computed: {
    computedList() {
      let userList = this.$store.state.project.userList
      let list = []
      let ids = []
      userList.map(item => {
        if (!ids.includes(item.userId)) {
          ids.push(item.userId)
          list.push(item)
        }
      })
      if (this.q) {
        list = list.filter(e => e.name.includes(this.q) || (e.remark && e.remark.includes(this.q)))
      }
      if (this.departmentId) {
        list = list.filter(e => e.organId === this.departmentId)
      }
      let groupList = groupBy(list, 'firstLetter')

      const result = map(groupList, (v, k) => ({ children: v, firstLetter: k }))
      return sortBy(result, 'firstLetter')
    }
  },
  methods: {
    handleClick(user) {
      this.$utils.toUrl('/pages/contact/user/detail?id=' + user.userId)
    },
    handleInput({ value }) {
      this.q = value
    },
    handleScroll({ detail }) {
      if (detail.scrollTop > 20) {
        this.moved = true
      }
    },
    handleTouchstart() {
      this.moved = false
    },
    handleLongpress(user) {
      if (!this.moved) {
        this.$emit('longpress', user)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./UserList.less');
</style>
