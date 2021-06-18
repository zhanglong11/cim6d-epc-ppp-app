<template>
  <div class="main is-white">
    <div class="input-wrapper"><input v-model="name" placeholder="文件夹名称" /></div>
    <div class="select-wrapper">
      <uni-card isForm>
        <uni-form-item label="选择位置" isLink>
          <uni-document-select
            v-model="position"
            placeholder="位置"
            @selectData="handleSelectData"
          ></uni-document-select>
        </uni-form-item>
      </uni-card>
    </div>
  </div>
</template>

<script>
import Api from '@/api/document'
export default {
  name: 'DocumentAddFolder',
  components: {},
  data() {
    return {
      name: '',
      position: '',
      selectData: {}
    }
  },
  watch: {},
  onLoad(options) {},
  onPullDownRefresh() {},
  onNavigationBarButtonTap(obj) {
    if (!this.name || !this.selectData.subCustomType) {
      this.$utils.showToast('请输入名称,选择添加位置')
      return
    }
    this.addFolder()
  },
  created() {},
  methods: {
    handleSelectData(data) {
      this.selectData = data
    },
    async addFolder() {
      let { type, subType, subCustomType, subCustomContent } = this.selectData
      let param = {
        categoryType: type,
        name: this.name
      }
      if (type === '1') {
        param.corpCategory = subCustomType
      }
      if (type === '2') {
        param.industryCategory = subType
        param.industryInfomationType = subCustomType
      }
      if (type === '3') {
        param.projectId = subType
        param.informationType = subCustomType
      }
      let res = await Api.addFolder(param)
      this.$utils.showToast('添加成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./document-add-folder.less');
</style>
