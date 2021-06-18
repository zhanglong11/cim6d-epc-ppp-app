<template>
  <div class="main">
    <UserList :department-id="departmentId"></UserList>
  </div>
</template>
<script>
import UserList from '../components/UserList'
export default {
  name: 'DepartmentUserList',
  components: { UserList },
  data() {
    return {
      departmentId: []
    }
  },
  onLoad({ id, name }) {
    this.departmentId = id
    this.$utils.setTitle(name)
  }
}
</script>
<style lang="less" scoped></style>
