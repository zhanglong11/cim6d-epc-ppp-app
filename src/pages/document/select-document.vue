<template>
  <div class="main is-white">
    <div class="nav-title">{{ navTitle.join('>') }}</div>
    <scroll-view class="scroll-roll" scroll-y style="position: relative">
      <div v-if="step === 0">
        <uni-card isForm class="noRadius">
          <uni-form-item label="集团资料" isLink @click="handleClickRootFolder('1')">
            <div slot="icon">
              <div class="imgWrapper">
                <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
              </div>
            </div>
          </uni-form-item>
          <uni-form-item label="行业资料" isLink @click="handleClickRootFolder('2')">
            <div slot="icon">
              <div class="imgWrapper">
                <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
              </div>
            </div>
          </uni-form-item>
          <uni-form-item label="项目资料" isLink @click="handleClickRootFolder('3')">
            <div slot="icon">
              <div class="imgWrapper">
                <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
              </div>
            </div>
          </uni-form-item>
        </uni-card>
      </div>
      <div v-else-if="step === 4">
        <div class="file-wrapper">
          <FileList :list="fileList"></FileList>
          <EmptyTemplate v-if="fileList.length === 0" />
        </div>
      </div>
      <div v-else>
        <DocList :hasBtn="false" :list="list" @clickDoc="handleClickFolder"> </DocList>
        <!-- <uni-card isForm>
          <uni-form-item v-for="(item,index) of list" :key="'folder'+index" :label="item.name" isLink @click="handleClickFolder(item)">
            <div slot="icon">
              <div class="imgWrapper">
                <uni-font-awesome type="fas fa-folder" color="#6e6e6e" size="50"></uni-font-awesome>
              </div>
            </div>
          </uni-form-item>
        </uni-card>-->
        <EmptyTemplate v-if="total === 0" />
      </div>
    </scroll-view>
  </div>
</template>

<script>
import Api from '@/api/document'
import FileList from '@/pages/document/components/FileList'
import DocList from '@/pages/document/components/DocList'
export default {
  name: 'SelectDocument',
  components: { FileList, DocList },
  data() {
    return {
      key: '',
      allowLast: false, //false表示添加文件夹,只能选到倒数第二层, true表示上传文件,可以选到最后一层文件夹
      canSubmit: false, //必须选择到固定位置才可以提交
      navTitle: ['文档管理'],
      step: 0,
      type: '',
      subType: '', //第二层目录 隧道建设2桥梁建设3道路建设4水利建设   项目名称这些
      subContent: '',
      subCustomType: '', //第三层 1建设2设计3勘察4施工5监理6劳务7基坑支护 (1安全资料2质量资料3图纸资料4设计资料)(1劳务类2环保类3给排水4强电5弱电)
      lastFoldId: '', //最后一层文件夹id
      lastFoldName: '', //最后一层文件夹id
      subCustomContent: '',
      list: [],
      fileList: [], //最底层fileList
      total: 0,
      operateType: '', //是上传时的选择位置,还是移动时的选择位置
      infoId: '' //删除时需要
    }
  },
  watch: {},
  onLoad(options) {
    this.allowLast = options.allowLast === 'true'
    this.key = options.key
    this.operateType = options.operateType //移动文件时需要
    this.infoId = options.infoId //移动文件的id
    this.fileId = options.fileId //移动文件的id
    this.fileName = options.fileName //移动文件的name
    this.categoryId = options.categoryId //移动文件的categoryId
  },
  onPullDownRefresh() {},
  onNavigationBarButtonTap(obj) {
    if (this.canSubmit) {
      if (this.allowLast) {
        if (this.operateType === 'move') {
          this.handleMove()
          return
        }
        this.$utils.toUrl(`/pages/document/upload-file?id=${this.lastFoldId}`)
      } else {
        console.log(this.type, this.subType, this.subCustomType, this.subCustomContent)
        uni.$emit('update:document-select', {
          key: this.key,
          type: this.type,
          subType: this.subType,
          subCustomType: this.subCustomType,
          subCustomContent: this.subCustomContent
        })
        uni.navigateBack()
      }
    } else {
      this.$utils.showToast(this.allowLast ? '该层级下需要添加文件夹后才能上传文件' : '添加文件夹的层级不对')
    }
  },
  created() {},
  methods: {
    async handleClickRootFolder(type) {
      this.canSubmit = false
      this.step = 1
      this.total = 10 //给个默认,防止出现空白提示
      switch (type) {
        case '1':
          this.type = '1'
          this.list = this.$getArgList('corpCategory').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          break
        case '2':
          this.type = '2'
          this.list = this.$getArgList('industryCategory').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          console.log(this.list)
          break
        case '3':
          this.type = '3'
          this.list = [
            {
              id: uni.getStorageSync('projectId'),
              name: uni.getStorageSync('projectName')
            }
          ]
          break
      }
    },
    async handleClickFolder(data) {
      if (this.canSubmit) {
        return
      }
      if (this.allowLast) {
        if (this.type === '1' && this.step === 1) {
          this.step = 3
          this.navTitle = ['集团资料', data.name]
          this.subCustomType = data.id
          this.subCustomContent = data.name
          await this.getFolderList()
          return
        }
        if (this.type === '1' && this.step === 3) {
          this.step = 4
          this.navTitle = [...this.navTitle, data.name]
          this.canSubmit = true
          this.lastFoldId = data.id
          this.lastFoldName = data.name
          await this.getFileList()
          return
        }
        if (this.type === '2' && this.step === 1) {
          this.step = 2
          this.subType = data.id
          this.subContent = data.name
          this.navTitle = ['行业资料', data.name]
          this.list = this.$getArgList('industryInfomationType').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          return
        }
        if (this.type === '3' && this.step === 1) {
          this.step = 2
          this.subType = data.id
          this.subContent = data.name
          this.navTitle = ['项目资料', data.name]
          this.list = this.$getArgList('informationType').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          return
        }
        if (this.type === '2' && this.step === 2) {
          this.step = 3
          this.navTitle = [...this.navTitle, data.name]
          this.subCustomType = data.id //最底层文件夹
          this.subCustomContent = data.name
          //获取行业资料最底层
          await this.getFolderList()
          return
        }
        if (this.type === '3' && this.step === 2) {
          this.step = 3
          this.navTitle = [...this.navTitle, data.name]
          this.subCustomType = data.id
          this.subCustomContent = data.name
          //获取项目资料最底层
          await this.getFolderList()
          return
        }
        if (this.type === '2' && this.step === 3) {
          this.step = 4
          this.navTitle = [...this.navTitle, data.name]
          this.canSubmit = true
          this.lastFoldId = data.id
          this.lastFoldName = data.name
          await this.getFileList()
          return
        }
        if (this.type === '3' && this.step === 3) {
          this.step = 4
          this.navTitle = [...this.navTitle, data.name]
          this.canSubmit = true
          this.lastFoldId = data.id
          this.lastFoldName = data.name
          await this.getFileList()
          return
        }
      } else {
        if (this.type === '1' && this.step === 1) {
          this.navTitle = ['集团资料', data.name]
          this.canSubmit = true
          this.subCustomType = data.id
          this.subCustomContent = data.name
          await this.getFolderList()
          return
        }
        if (this.type === '2' && this.step === 1) {
          this.step = 2
          this.subType = data.id
          this.subContent = data.name
          this.navTitle = ['行业资料', data.name]
          this.list = this.$getArgList('industryInfomationType').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          return
        }
        if (this.type === '3' && this.step === 1) {
          this.step = 2
          this.subType = data.id
          this.subContent = data.name
          this.navTitle = ['项目资料', data.name]
          this.list = this.$getArgList('informationType').map(item => {
            return {
              id: item.value,
              name: item.label
            }
          })
          return
        }
        if (this.type === '2' && this.step === 2) {
          this.step = 3
          this.canSubmit = true
          this.navTitle = [...this.navTitle, data.name]
          this.subCustomType = data.id //最底层文件夹
          this.subCustomContent = data.name
          //获取行业资料最底层
          await this.getFolderList()
          return
        }
        if (this.type === '3' && this.step === 2) {
          this.step = 3
          this.canSubmit = true
          this.navTitle = [...this.navTitle, data.name]
          this.subCustomType = data.id
          this.subCustomContent = data.name
          //获取项目资料最底层
          await this.getFolderList()
          return
        }
      }
    },
    async getFolderList() {
      let param = {
        categoryType: this.type,
        type: this.subCustomType
      }
      if (this.type === '2') param.industryType = this.subType
      if (this.type === '3') param.projectId = this.subType
      let res = await Api.getFolderList(param)
      this.list = res.data && res.data.records
      this.total = res.data && res.data.total
    },
    async getFileList() {
      let res = await Api.getFileList(this.lastFoldId)
      this.fileList =
        res.data &&
        res.data.fileList.map(item => {
          return {
            name: item.fileName,
            createTime: item.createTime
          }
        })
    },
    async handleMove() {
      await Api.addFile({ categoryId: this.lastFoldId, fileId: this.fileId, fileName: this.fileName })
      await Api.deleteFile(this.infoId)
      this.$utils.showToast('移动成功')
      uni.navigateBack()
    }
  }
}
</script>

<style scoped lang="less">
@import url('./select-document.less');
</style>
