<template>
  <image
    v-if="user.headImage"
    class="avatar"
    :src="user.headImage"
    :style="{ width: size + 'rpx', height: size + 'rpx' }"
  >
  </image>
  <span
    v-else
    class="avatar"
    :style="{ backgroundColor: color, width: size + 'rpx', height: size + 'rpx', fontSize: size / 2.5 + 'rpx' }"
  >
    {{ surname }}
  </span>
</template>

<script>
import { first } from 'lodash'
import compoundSurname from './compoundSurname'
import ColorHash from 'color-hash'
export default {
  name: 'UniAvatar',
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    },
    size: {
      type: Number,
      default: 60
    }
  },
  computed: {
    name() {
      return this.user.name || this.user.userName || this.user.realName || this.user.organName || this.user.title
    },
    surname() {
      if (this.name && compoundSurname.find(e => this.name.includes(e))) {
        return this.name.slice(0, 2)
      } else {
        return first(this.name)
      }
    },
    color() {
      const hashColor = new ColorHash({ hue: 90 })
      return hashColor.hex(this.name)
    }
  },
  methods: {
    first
  }
}
</script>

<style scoped lang="less">
@import './uni-avatar.less';
</style>
