<template>
  <div class="main">
    <UserList topNavVisible></UserList>
  </div>
</template>
<script>
import UserList from './components/UserList'
export default {
  name: 'Detail',
  components: { UserList },
  data() {
    return {}
  },
  onNavigationBarButtonTap(options) {
    if (options.key === 'more') {

    }
  }
}
</script>
<style lang="less" scoped></style>
