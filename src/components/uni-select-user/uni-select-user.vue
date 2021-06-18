<template>
  <div
    v-if="+mode === 1"
    class="align-right"
    name="construcationNames"
    :style="{ color: !value ? '#777' : 'unset' }"
    @click="jump"
  >
    {{ computedText }}
  </div>
  <div v-else-if="+mode === 2">
    <ul class="footer-user-list">
      <li v-for="user in selectedUserList" :key="user.id" :style="{ width: size + 'rpx', height: size + 'rpx' }">
        <uni-avatar :user="user" :size="size" />
        <uni-icons class="close" type="clear" color="red" size="18" @click="remove(user)" />
        <span class="name">{{ user.name }}</span>
      </li>
      <li :style="{ width: size + 'rpx', height: size + 'rpx' }" @click="jump">
        <i class="iconfont icon-tianjia"></i>
        <span class="name">更多</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { find, uniqueId, floor } from 'lodash'
export default {
  name: 'UniSelectUser',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    mode: {
      type: [Number, String],
      default: 1
    },
    /**
     * 列数
     */
    columns: {
      type: Number,
      default: 4
    },
    /**
     * 单个item的宽高
     */
    size: {
      type: Number,
      default: 100
    },
    roles: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 可以选择的人员id列表， ，号连起来的字符串
     */
    canChooseUserIds: {
      type: String,
      default: ''
    },
    disabledUserIds: {
      type: Array,
      default() {
        return []
      }
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否展示全选按钮
    showCheckAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      key: ''
    }
  },
  computed: {
    userList() {
      return _.cloneDeep(this.$store.state.project.userList)
    },
    computedText() {
      if (this.value) {
        return this.value
          .split(',')
          .map(userId => find(this.userList, { userId })?.name || '')
          .join(',')
      } else {
        return this.placeholder
      }
    },
    computedIds() {
      if (this.value) {
        return this.value
          .split(',')
          .map(userId => find(this.userList, { userId })?.id || '')
          .join(',')
      } else {
        return ''
      }
    },
    selectedUserList() {
      if (this.value) {
        return this.value.split(',').map(userId => find(this.userList, { userId }))
      } else {
        return []
      }
    }
  },
  created() {
    this.key = uniqueId('user_')
    uni.$on('update:select-user', data => {
      if (data.key === this.key) {
        let userId = data.value.map(e => e.userId).join(',')
        let userName = data.value.map(e => e.name).join(',')
        let mobile = data.value.map(e => e.mobile).join(',')
        let companyId = data.value.map(e => e.companyId).join(',')
        this.$emit('input', userId)
        this.$emit('change', {
          userId,
          userName,
          mobile,
          companyId
        })
        this.$emit('update:id', userId)
        this.$emit('update:name', userName)
        this.$emit('update:mobile', mobile)
        this.$emit('update:companyId', companyId)
      }
    })
  },
  methods: {
    remove(user) {
      let values = this.selectedUserList.filter(e => e.id !== user.id)
      let userId = values.map(e => e.userId).join(',')
      let userName = values.map(e => e.name).join(',')
      let mobile = values.map(e => e.mobile).join(',')
      this.$emit('input', userId)
      this.$emit('change', {
        userId,
        userName,
        mobile
      })
    },
    floor,
    jump() {
      if (this.disabled) {
        return
      }
      this.$utils.toUrl(
        `/pages/select-user/select-user?multiple=${this.multiple}&key=${this.key}&checkedIds=${
          this.computedIds
        }&roles=${this.roles.join(',')}&canChooseUserIds=${this.canChooseUserIds}&disabledUserIds=${
          this.disabledUserIds
        }&showCheckAll=${this.showCheckAll}`
      )
    }
  }
}
</script>
<style lang="less" scoped>
@import './uni-select-user.less';
</style>
