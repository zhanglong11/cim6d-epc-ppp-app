<template>
  <div class="card-warp uni-card" :class="{ 'form-card': isForm, disabled }" @click="onClick">
    <aside v-if="checkable" class="check" :class="{ checked: checked }"></aside>
    <section>
      <div class="title" :class="{ 'no-title': !title }">
        <p v-if="title" class="name">{{ title }}</p>
        <slot name="title" />
      </div>
      <div class="content">
        <slot />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'UniCard',
  components: {},
  props: {
    // 标题栏
    title: {
      type: String,
      default: ''
    },
    // 是否是表单card
    isForm: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    checkable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    refresh() {},
    // 点击事件
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.card-warp {
  margin: 25px auto 0;
  width: 100%;
  max-width: 700px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px #eee;
  border-radius: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  aside {
    margin: 0 10px 0 30px;
  }
  section {
    flex: 1;
    > .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
      > .name {
        font-size: 14px;
        color: @h2FontColor;
      }
      &.no-title {
        padding: 0;
        border: 0;
      }
    }
    > .content {
      padding: 6px;
      .form-item:first-child {
        &:before {
          display: none;
        }
      }
    }
    > .content:empty {
      padding: 0;
    }
    &:first-child {
      margin-top: 0;
    }
  }
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
.check {
  margin-right: 40px;
  margin-left: 10px;
  font-size: 0;
  width: 30px;
  height: 30px;
  border: 2px @headerColor solid;
  border-radius: 50%;
  transition: all 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    content: '';
    margin-top: -4px;
    width: 15px;
    height: 10px;
    border-left: 2px #fff solid;
    border-bottom: 2px #fff solid;
    transform: rotate(-45deg);
  }
}
.check.checked {
  background: @headerColor;
}
</style>
