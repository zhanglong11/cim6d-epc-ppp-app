<template>
  <div class="custom-title">
    <span v-if="title" class="title" v-html="title"></span>
    <slot name="title" class="title" />
    <span class="extra" v-html="extra"></span>
    <slot name="extra" class="extra" />
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 额外显示的内容，默认位置在右上角
    extra: {
      type: String,
      default: ''
    }
  },
  data() {
    //这里存放数据
    return {}
  },
  mounted() {},
  //方法集合
  methods: {} //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.custom-title {
  padding-top: 30rpx;
  display: flex;
  font-size: 12px;
  .title {
    flex: 1;
    font-size: 16px;
  }
}
</style>
