<template>
  <uni-card isForm>
    <uni-form-item v-if="isEidt" label="问题部位" isRequired isLink @click="showModal('entityRef')">
      <textarea :value="locationName" auto-height disabled placeholder="请选择" />
    </uni-form-item>
    <uni-form-item v-else label="问题部位">
      {{ locationName }}
    </uni-form-item>
    <uni-form-item isLink @click="viewModel()">
      <span class="primary-link">{{ isEidt ? 'BIM选择问题构件' : 'BIM查看问题构件' }}</span>
    </uni-form-item>

    <!-- 选择单体 start -->
    <uni-drawer ref="entityRef" class="drawer" mode="right" :width="600">
      <div class="header">
        <span class="close" @click="hideModal('entityRef')">取消</span>
        <span class="title">选择问题部位</span>
      </div>
      <scroll-view class="scroll-roll" scroll-y>
        <div class="content">
          <uni-tree
            :treeData="entityList"
            nodeKey="id"
            defaultExpandAll
            showRadio
            checkOnClickNode
            @check="clickNode"
          ></uni-tree>
        </div>
      </scroll-view>
    </uni-drawer>
    <!-- 选择单体 end -->
  </uni-card>
</template>

<script>
import { find, isNull } from 'lodash'
import { bimApi } from './api'
import toTree from '@/utils/toTree'
export default {
  name: 'SelectAnchor',
  props: {
    // 接收选择的构件或其他服务使用
    uUid: {
      type: [String, Number],
      default: ''
    },
    // 允许添加锚点
    isAddAnchor: {
      type: Boolean,
      default: false
    },
    // 是否允许编辑
    isEidt: {
      type: Boolean,
      default: false
    },
    // 默认显示的数据
    defaultData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 锚点类型
    anchorType: {
      type: String,
      default: 'quality'
    }
  },
  data() {
    return {
      entityList: [], // 单体列表
      locationId: '', // 楼层id
      locationName: '', // 楼层名字
      problemId: '', // 问题id
      formData: [] // 最终保存的表单数据
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    // 选择的构件
    selectGuid() {
      return this.$store.state.bim.selectGuid
    }
  },
  watch: {
    defaultData(obj) {
      console.log(222, obj)
      this.locationId = obj.viewId
      this.locationName = obj.locationName
      this.problemId = obj.id
    }
  },
  mounted() {
    this.queryFloorList()
  },
  methods: {
    // 查询项目下的所有楼层结构
    async queryFloorList() {
      if (!this.projectId) {
        return
      }
      let params = {
        projectId: this.projectId
      }
      const result = await bimApi.queryFloorList(params)
      let datas = result.data || []
      datas.map(e => {
        e.label = e.title
        e.disabled = !e.viewId || e.type !== 5
      })
      let list = toTree(datas, 'pid', '', 'id', true, true)
      this.entityList = list
      // console.log(111, list)
    },
    // 显示选择模态框
    showModal(key) {
      this.$refs[key].open()
    },
    // 关闭选择模态框
    hideModal(key) {
      this.$refs[key].close()
    },
    // 查看模型
    viewModel() {
      if (!this.locationId) {
        this.$utils.showToast('请先选择问题部位')
        return
      }
      let url = `/pages/bim-model/index?locationId=${this.locationId}&uUid=${this.uUid}&isAddAnchor=${this.isAddAnchor}&entityName=${this.locationName}&anchorType=${this.anchorType}&problemId=${this.problemId}&bimShowType=2d&showBtn=false`
      this.$utils.toUrl(url)
    },
    // 选择节点
    clickNode({ checkedNodes }) {
      if (checkedNodes.length === 0) {
        return
      }
      let selectData = checkedNodes[0]
      selectData.locationId = selectData.viewId
      selectData.locationName = selectData.initLabel || selectData.title
      this.locationId = selectData.viewId
      this.locationName = selectData.initLabel || selectData.title

      this.formData = selectData
      // 回传父组件数据
      this.$emit('change', this.formData)
      this.hideModal('entityRef')
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-select-anchor.less';
</style>
