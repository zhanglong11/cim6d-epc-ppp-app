<template>
  <div class="main guide is-white">
    <span v-if="tabIndex < 3" class="skip" @click="skip()">跳过</span>
    <swiper class="swiper" :current="tabIndex" indicator-dots :interval="3000" @change="changeSwiper">
      <!-- #ifdef APP-PLUS -->
      <swiper-item
        v-for="i in 4"
        :key="i"
        class="swiper-item"
        :style="`background: url(../../static/images/guide/guide${i}.png)`"
      >
      </swiper-item>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <swiper-item
        v-for="i in 4"
        :key="i"
        class="swiper-item"
        :style="`background: url(../../static/images/guide/guide${i}.png)`"
      >
      </swiper-item>
      <!-- #endif -->
      <!-- #ifdef MP -->
      <swiper-item
        v-for="i in 4"
        :key="i"
        class="swiper-item"
        :style="'background: url(' + require(`../../static/images/guide/guide${i}.png`) + ')'"
      >
      </swiper-item>
      <!-- #endif -->
    </swiper>
    <button type="primary" class="skip-btn" :animation="skipAnimation" @click="skip()">
      立即体验
    </button>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      tabIndex: 0,
      skipAnimation: {}
    }
  },
  mounted() {},
  //方法集合
  methods: {
    // 切换图片
    changeSwiper(e) {
      let current = e.detail.current
      this.tabIndex = current
      let skipAnimation = uni.createAnimation()
      if (current === 3) {
        skipAnimation.scale(1).step()
      } else {
        skipAnimation.scale(0).step()
      }
      this.skipAnimation = skipAnimation.export()
    },
    // 跳过
    skip() {
      this.$utils.toUrl('/pages/login/login', 1)
    }
  } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
