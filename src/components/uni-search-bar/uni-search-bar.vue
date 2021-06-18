<template>
  <view class="uni-searchbar" :class="{ [type]: type }">
    <view
      :style="{ borderRadius: radius + 'px', backgroundColor: bgColor }"
      class="uni-searchbar__box"
      @click="searchClick"
    >
      <input
        v-if="show"
        v-model="searchVal"
        :focus="showSync"
        :placeholder="placeholder"
        :maxlength="maxlength"
        class="uni-searchbar__box-search-input"
        confirm-type="search"
        type="text"
        @confirm="confirm"
      />
      <text v-else class="uni-searchbar__text-placeholder">{{ placeholder }}</text>
      <view
        v-if="show && (clearButton === 'always' || (clearButton === 'auto' && searchVal !== ''))"
        class="uni-searchbar__box-icon-clear"
        @click="clear"
      >
        <uni-icons color="#999999" class size="24" type="clear" />
      </view>
      <uni-icons v-else color="#496FE5" class="uni-searchbar__box-icon-search" size="18" type="search" />
    </view>
    <text
      v-if="cancelButton === 'always' || (show && cancelButton === 'auto')"
      class="uni-searchbar__cancel"
      @click="cancel"
      >{{ cancelText }}</text
    >
  </view>
</template>

<script>
import uniIcons from '../uni-icons/uni-icons.vue'
export default {
  name: 'UniSearchBar',
  components: {
    uniIcons
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    },
    radius: {
      type: [Number, String],
      default: 18
    },
    clearButton: {
      type: String,
      default: 'auto'
    },
    cancelButton: {
      type: String,
      default: 'none'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    bgColor: {
      type: String,
      default: '#fff'
    },
    maxlength: {
      type: [Number, String],
      default: 100
    },
    /* 搜索栏样式
    default 白色背景
    primary 蓝色背景
    gary  灰色背景
    */
    type: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      show: false,
      showSync: false,
      searchVal: ''
    }
  },
  watch: {
    searchVal() {
      this.$emit('input', {
        value: this.searchVal
      })
    }
  },
  methods: {
    searchClick() {
      if (this.show) {
        return
      }
      this.searchVal = ''
      this.show = true
      this.$nextTick(() => {
        this.showSync = true
      })
    },
    clear() {
      this.searchVal = ''
    },
    cancel() {
      this.$emit('cancel', {
        value: this.searchVal
      })
      this.searchVal = ''
      this.show = false
      this.showSync = false
      // #ifndef APP-PLUS
      uni.hideKeyboard()
      // #endif
      // #ifdef APP-PLUS
      plus.key.hideSoftKeybord()
      // #endif
    },
    confirm() {
      // #ifndef APP-PLUS
      uni.hideKeyboard()
      // #endif
      // #ifdef APP-PLUS
      plus.key.hideSoftKeybord()
      // #endif
      this.$emit('confirm', {
        value: this.searchVal
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$uni-searchbar-height: 60px;

.uni-searchbar {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  position: relative;
  &.primary {
    background: #496fe5;
  }
  &.gray {
    background-color: #f9f9f9;
  }
}

.uni-searchbar__box {
  box-shadow: 0px 0px 10px 0px rgba(11, 75, 159, 0.13);
  width: 700px;
  margin: 0 auto;
  /* #ifndef APP-NVUE */
  display: flex;
  box-sizing: border-box;
  /* #endif */
  overflow: hidden;
  position: relative;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  height: $uni-searchbar-height;
  padding: 10px 12px 10px 30px;
  // border-width: 0.5px;
  // border-style: solid;
  // border-color: $uni-border-color;
}

.uni-searchbar__box-icon-search {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  width: 64px;
  justify-content: center;
  align-items: center;
  color: $uni-text-color-placeholder;
}

.uni-searchbar__box-search-input {
  flex: 1;
  font-size: 13px;
  color: $uni-text-color;
}

.uni-searchbar__box-icon-clear {
  align-items: center;
  line-height: 48px;
  padding-left: 10px;
}

.uni-searchbar__text-placeholder {
  font-size: 13px;
  color: $uni-text-color-placeholder;
}

.uni-searchbar__cancel {
  padding-left: 20px;
  line-height: $uni-searchbar-height;
  font-size: 14px;
  color: $uni-text-color;
}
</style>
