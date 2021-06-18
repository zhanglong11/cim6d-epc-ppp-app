<template>
  <div class="dropWrapper" @click="toggle">
    竣工资料
    <ul :class="show ? 'active' : ''">
      <li>施工单位资料</li>
      <li>监理单位资料</li>
    </ul>
    <div :class="show ? 'show' : ''" class="DropMask" @click.stop="maskClick" />
  </div>
</template>

<script>
export default {
  name: 'DropDown',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      show: false
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    toggle() {
      this.show = true
    },
    maskClick() {
      this.show = false
    }
  }
}
</script>

<style scoped lang="less">
.dropWrapper {
  position: relative;
  ul {
    display: none;
    position: absolute;
    z-index: 10000;
    &.active {
      display: block;
    }
  }
}
.DropMask {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 10000;
  &.show {
    display: block;
  }
}
</style>
