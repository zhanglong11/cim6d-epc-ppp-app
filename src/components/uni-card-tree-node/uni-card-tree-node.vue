<template>
  <div>
    <div class="card-warp uni-card" :class="{ 'form-card': isForm, disabled }" @click="onClick">
      <aside v-if="checkable" class="check" :class="{ checked: checked }"></aside>
      <div class="content" @click="handleNodeClick(item)">
        <div
          v-if="item.children && item.children.length"
          class="control"
          :class="{ opened: opened }"
          @click.stop="handleControlClick"
        ></div>
        <slot :item="item" />
      </div>
    </div>
    <div v-show="opened">
      <div v-for="item2 in item.children" :key="item2[itemKey]">
        <UniCardTreeNode class="child" :itemKey="itemKey" :item="item2" @node-click="handleNodeClick">
          <template v-slot="{ item }">
            <slot :item="item" />
          </template>
        </UniCardTreeNode>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UniCardTreeNode',
  components: {},
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    itemKey: {
      type: String,
      required: true
    },
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
    return {
      opened: false
    }
  },
  methods: {
    refresh() {},
    // 点击事件
    onClick() {
      this.$emit('click')
    },
    handleControlClick() {
      this.opened = !this.opened
    },
    handleNodeClick(item) {
      this.$emit('node-click', item)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.card-warp {
  position: relative;
  margin: 0 auto 25px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px #eee;
  border-radius: 20px;
  background: #fff;
  aside {
    margin: 0 10px 0 30px;
  }
  section {
    flex: 1;
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
.child {
  margin-left: 30px;
  margin-top: 15px;
}
.control {
  display: inline-block;
  border-top: 2px solid;
  border-right: 2px solid;
  width: 20px;
  height: 20px;
  border-color: #666;
  transform: rotate(-230deg);
  z-index: 100;
  position: absolute;
  top: 30px;
  right: 30px;
  transition: all 0.2s;
  &::before {
    content: '';
    position: absolute;
    top: -30px;
    right: -30px;
    bottom: -30px;
    left: -30px;
    transform: rotate(-45deg);
  }
  &.opened {
    transform: rotate(-45deg);
  }
}
</style>
