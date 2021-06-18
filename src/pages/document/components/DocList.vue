<template>
  <div class="doc-wrapper">
    <div v-for="item of list" :key="item.id" class="list" @click="handleDocClick(item)">
      <div class="imgWrapper">
        <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
      </div>
      <!--      <div class="info" @click="handleDocClick(item)">-->
      <div class="info">
        <div class="info-detail">{{ item.name }}</div>
      </div>
      <div class="operateBtn" v-if="hasBtn">
        <!--        <uni-font-awesome type="fas fa-ellipsis-h" color="#6e6e6e" size="40"></uni-font-awesome>-->
        <slot>
          <div
            style="letter-spacing: 5px;
      font-weight: bolder;
      color: #6e6e6e;"
          >
            ···
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DocList',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    hasBtn: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    handleDocClick(item) {
      this.$emit('clickDoc', item)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./doc-list.less');
</style>
