<template>
  <div class="main is-white">
    <div class="nav-title">{{ navTitle.join('>') }}</div>
    <scroll-view class="scroll-roll" scroll-y>
      <div v-if="step === 0">
        <uni-card isForm class="noRadius">
          <uni-form-item label="集团资料" isLink @click="handleClickRootFolder('group')">
            <div slot="icon">
              <div class="imgWrapper">
                <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
              </div>
            </div>
          </uni-form-item>
          <uni-form-item label="行业资料" isLink @click="handleClickRootFolder('industry')">
            <div slot="icon">
              <div class="imgWrapper">
                <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
              </div>
            </div>
          </uni-form-item>
          <uni-form-item label="项目资料" isLink @click="handleClickRootFolder('project')">
            <div slot="icon">
              <div class="imgWrapper">
                <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
              </div>
            </div>
          </uni-form-item>
        </uni-card>
      </div>
      <div v-else>
        <uni-card isForm>
          <uni-form-item v-for="item of list" :key="item.id" :label="item.name" isLink @click="handleClickFolder(item)">
            <div slot="icon">
              <div class="imgWrapper">
                <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
              </div>
            </div>
          </uni-form-item>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import Api from '@/api/document'
export default {
  name: 'SelectDocType',
  components: {},
  data() {
    return {
      navTitle: ['文档管理'],
      step: 0,
      list: [],
      total: null
    }
  },
  watch: {},
  onLoad(options) {},
  onPullDownRefresh() {},
  onNavigationBarButtonTap(obj) {},
  created() {},
  methods: {
    async handleClickRootFolder(type) {
      this.step++
      switch (type) {
        case 'group':
          this.navTitle.push('集团资料')
          await this.getRootListData(1)
          break
        case 'industry':
          this.navTitle.push('行业资料')
          await this.getRootListData(2)
          break
        case 'project':
          this.navTitle.push('项目资料')
          await this.getRootListData(3)
          break
        default:
          return
      }
    },
    async handleClickFolder(item) {
      console.log(item)
      this.step++
      await this.getListData(1)
    },
    async getListData() {
      this.list = [
        { id: 1, name: '文件夹1' + Math.random() },
        { id: 2, name: '文件夹2' + Math.random() },
        { id: 3, name: '文件夹3' + Math.random() }
      ]
    },
    async getRootListData(type) {
      console.log(type)
      this.list = [
        { id: 1, name: '文件夹1' + type },
        { id: 2, name: '文件夹2' + type },
        { id: 3, name: '文件夹3' + type }
      ]
    }
  }
}
</script>

<style scoped lang="less">
@import url('./doc-file-list.less');
</style>
