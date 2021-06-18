<template>
  <div class="main">
    <UserList :collection-id="collectionId" @longpress="handleLongpress"></UserList>
  </div>
</template>
<script>
import UserList from '../components/UserList'
export default {
  name: 'Detail',
  components: { UserList },
  data() {
    return {
      collectionId: null
    }
  },
  onLoad({ id, name }) {
    this.$utils.setTitle(name)
    this.collectionId = id
  },
  onNavigationBarButtonTap(options) {
    const $utils = this.$utils
    if (options.key === 'more') {
      const itemList = [
        {
          name: '编辑',
          handler() {
            $utils.toUrl('edit?id=' + this.id)
          }
        },
        {
          name: '删除',
          handler() {
            uni.showModal({
              title: '提示',
              content: `确定要删除这个收藏夹吗 ?`,
              success: res => {
                if (res.confirm) {
                  $utils.showToast('删除成功')
                }
              }
            })
          }
        }
      ]
      uni.showActionSheet({
        itemList: itemList.map(e => e.name),
        success({ tapIndex }) {
          itemList[tapIndex].handler()
        }
      })
    }
  },
  methods: {
    handleLongpress(user) {
      const itemList = [
        {
          name: '编辑',
          handler() {
            console.log(1)
          }
        },
        {
          name: '从收藏夹中删除',
          handler: () => {
            uni.showModal({
              title: '提示',
              content: `确定要从收藏夹中删除 ${user.userName} 吗 ?`,
              success: res => {
                if (res.confirm) {
                  this.$utils.showToast('删除成功')
                }
              }
            })
          }
        }
      ]
      uni.showActionSheet({
        itemList: itemList.map(e => e.name),
        success: ({ tapIndex }) => {
          itemList[tapIndex].handler()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
