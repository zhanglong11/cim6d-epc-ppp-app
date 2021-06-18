<template>
  <view class="steps__row">
    <view class="steps__row-container">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="steps__row-line-item"
        :class="{ 'item-checked': index <= active, 'current-step': index == active }"
      >
        <view
          class="steps__row-line steps__row-line--before"
          :class="[index == 0 ? 'steps__row-line-transparent' : '']"
        />
        <view class="steps__row-circle" />
        <view
          class="steps__row-line steps__row-line--after"
          :class="[index == list.length - 1 ? 'steps__row-line-transparent' : '']"
        />
      </view>
    </view>
    <view class="steps__row-text-container">
      <view
        v-for="(item, index) in options"
        :key="index"
        class="steps__row-text"
        :class="[item.type ? 'steps__row-text-' + item.type : '', index > active ? 'placeholder' : '']"
      >
        <text class="steps__row-title"
          ><span>{{ item.title }}</span></text
        >
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      list: [],
      currentIndex: 0
    }
  },
  watch: {
    options: {
      handler(newVal) {
        this.list = [...this.options] || []
      },
      deep: true,
      immediate: true
    },
    active() {
      this.currentIndex = active
    }
  }
}
</script>

<style lang="less" scoped>
@import './m-steps.less';
</style>
