<template>
  <div class="main is-white">
    <uni-search-bar placeholder="搜索部门名" @input="handleInput"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y :scroll-into-view="activeAlpha" @click.stop>
      <div class="group-list">
        <h3>我的部门</h3>
        <ul class="department-list">
          <li
            v-for="item in computedListIncludeMe"
            :key="item.organId"
            @click="handleClick({ id: item.organId, name: item.organName })"
          >
            <div class="content">
              <uni-avatar :user="item" :size="80"></uni-avatar>
              <p>{{ item.organName }}</p>
            </div>
          </li>
        </ul>
        <h3>全部部门</h3>
        <DepartmentTree :data="computedList" @nodeClick="handleClick"></DepartmentTree>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import treeFilter from '@/utils/treeFilter'
import toFlat from '@/utils/toFlat'
import treeFind from '@/utils/treeFind'
export default {
  name: 'Department',
  props: {
    // 收藏夹id，设置此项将展示收藏夹用户
    collectionId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      q: '',
      activeAlpha: ''
    }
  },
  computed: {
    computedList() {
      let list = treeFilter(this.$store.state.project.departmentUserList, item => item.type === 1)
      if (this.q) {
        list = list.filter(e => e.name.includes(this.q))
      }
      return list
    },
    computedListIncludeMe() {
      return this.$store.state.project.userList.filter(item => item.userId === this.$store.state.user.userId)
    }
  },
  methods: {
    handleClick(item) {
      this.$utils.toUrl(`/pages/contact/department/user-list?id=${item.id}&name=${item.name}`)
    },
    handleInput({ value }) {
      this.q = value
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./department.less');
</style>
