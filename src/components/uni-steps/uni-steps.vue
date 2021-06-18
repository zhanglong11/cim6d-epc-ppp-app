<template>
  <view class="uni-steps">
    <view :class="[direction === 'column' ? 'uni-steps__column' : 'uni-steps__row']">
      <view :class="[direction === 'column' ? 'uni-steps__column-container' : 'uni-steps__row-container']">
        <view
          v-for="(item, index) in options"
          :key="index"
          :class="[direction === 'column' ? 'uni-steps__column-line-item' : 'uni-steps__row-line-item']"
        >
          <view
            :class="[
              direction === 'column' ? 'uni-steps__column-line' : 'uni-steps__row-line',
              direction === 'column' ? 'uni-steps__column-line--before' : 'uni-steps__row-line--before'
            ]"
            :style="{
              backgroundColor:
                index <= active && index !== 0 ? activeColor : index === 0 ? 'transparent' : deactiveColor
            }"
          />
          <!-- <view
            v-if="index === active"
            :class="[direction === 'column' ? 'uni-steps__column-check' : 'uni-steps__row-check']"
          >
            <uni-icons :color="activeColor" type="checkbox-filled" size="14" />
          </view> -->
          <view
            v-if="index === active"
            :class="[direction === 'column' ? 'uni-steps__column-circle' : 'uni-steps__row-circle']"
            :style="{ borderColor: activeColor }"
          />
          <view
            v-else
            :class="[direction === 'column' ? 'uni-steps__column-circle' : 'uni-steps__row-circle']"
            :style="{ borderColor: index < active ? activeColor : deactiveColor }"
          />
          <view
            :class="[
              direction === 'column' ? 'uni-steps__column-line' : 'uni-steps__row-line',
              direction === 'column' ? 'uni-steps__column-line--after' : 'uni-steps__row-line--after'
            ]"
            :style="{
              backgroundColor:
                index < active && index !== options.length - 1
                  ? activeColor
                  : index === options.length - 1
                  ? 'transparent'
                  : deactiveColor
            }"
          />
        </view>
      </view>
      <view :class="[direction === 'column' ? 'uni-steps__column-text-container' : 'uni-steps__row-text-container']">
        <view
          v-for="(item, index) in options"
          :key="index"
          :class="[direction === 'column' ? 'uni-steps__column-text' : 'uni-steps__row-text']"
        >
          <text :class="[direction === 'column' ? 'uni-steps__column-desc' : 'uni-steps__row-desc']">{{
            item.desc
          }}</text>
          <text
            :class="[direction === 'column' ? 'uni-steps__column-title' : 'uni-steps__row-title']"
            :style="{ color: item.color || '#333' }"
            >{{ item.title }}</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '../uni-icons/uni-icons.vue'
/**
 * Steps 步骤条
 * @description 评分组件
 * @property {Number} active 当前步骤
 * @property {String} direction = [row|column] 当前步骤
 * 	@value row 横向
 * 	@value column 纵向
 * @property {String} activeColor 选中状态的颜色
 * @property {Array} options 数据源，格式为：[{title:'xxx',desc:'xxx'},{title:'xxx',desc:'xxx'}]
 */
export default {
  name: 'UniSteps',
  components: {
    uniIcons
  },
  props: {
    direction: {
      // 排列方向 row column
      type: String,
      default: 'row'
    },
    activeColor: {
      // 激活状态颜色
      type: String,
      default: '#52c1f5'
    },
    deactiveColor: {
      // 未激活状态颜色
      type: String,
      default: '#EAEAEA'
    },
    active: {
      // 当前步骤
      type: Number,
      default: 0
    },
    options: {
      type: Array,
      default() {
        return []
      }
    } // 数据
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
@import './uni-steps.less';
</style>
