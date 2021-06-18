<template>
  <div class="main">
    <div class="card">
      <uni-form-item label="收藏夹名称">
        <input v-model="form.name" type="text" placeholder="请输入" />
      </uni-form-item>
    </div>
    <div class="card">
      <uni-form-item label="收藏夹成员" :border="false"></uni-form-item>
      <div class="user-select-wrap">
        <uni-select-user v-model="form.userIds" :size="117.5" mode="2" multiple></uni-select-user>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data() {
    return {
      form: {
        name: '',
        userIds: ''
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    submit() {},
    remove() {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.card {
  width: 700px;
  margin-bottom: 30px;
}
.user-select-wrap{
  padding: 0 10px;
}
</style>
