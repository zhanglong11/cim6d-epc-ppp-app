<template>
  <div class="main">
    <TkiTree
      :selectIds="selectIds"
      :range="treeData"
      :rangeKey="rangeKey"
      :multiple="multiple"
      :is-simple="false"
      @change="handleSelectChange"
    ></TkiTree>
  </div>
</template>
<script>
import TkiTree from '@/components/tki-tree/tki-tree.vue'
import treeFind from '@/utils/treeFind'
export default {
  name: 'SelectLocation',
  components: { TkiTree },
  data() {
    return {
      selectIds: [],
      rangeKey: 'name',
      idKey: 'id',
      multiple: false,
      treeData: []
    }
  },
  computed: {},
  onLoad(option) {
    this.key = option.key
    this.selectIds = [option.selectId] || []
  },
  onNavigationBarButtonTap(obj) {
    if (this.selectIds.length === 0) {
      this.$utils.showToast('请选择楼层')
      return false
    }
    let a = treeFind(this.treeData, item => this.selectIds.includes(item.id) || this.selectIds.includes(item.id + ''))
    uni.$emit('update:select-location', { key: this.key, value: this.selectIds[0], name: a.name })
    uni.navigateBack()
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.treeData = [
        {
          name: '1',
          id: 1,
          children: [
            { name: '1-1', id: 11, children: [{ name: '1-1-1', id: 111 }] },
            { name: '1-2', id: 12 },
            { name: '1-3', id: 13 }
          ]
        }
      ]
    },
    handleSelectChange(data) {
      this.selectIds = data.filter(item => item.checked === true).map(item => item.id)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common');
</style>
