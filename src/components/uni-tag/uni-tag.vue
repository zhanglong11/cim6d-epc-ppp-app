<template>
  <span class="uni-tag" :style="{ backgroundColor: color }"><slot></slot></span>
</template>

<script>
export default {
  name: 'UniTag',
  props: {
    color: {
      type: String,
      default: '#496FE5'
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
span {
  display: inline-block;
  padding: 8px 30px;
  color: #fff;
  border-radius: 10px;
  font-size: 14px;
  & + .uni-tag {
    margin-left: 15px;
  }
  &.small{
    padding: 5px 20px;
  }
}
</style>
