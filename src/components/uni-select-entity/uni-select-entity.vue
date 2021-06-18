<template>
  <uni-card isForm>
    <uni-form-item label="不合格位置" isLink @click="showModal('entityRef')">
      <textarea :value="entityName" auto-height disabled placeholder="请选择" />
    </uni-form-item>
    <uni-form-item label="不合格构件" isLink @click="selectBimModel()">
      <textarea
        :value="selectGuidNum === 0 ? '' : `已选择 ${selectGuidNum} 个构件`"
        auto-height
        disabled
        placeholder="请选择"
      />
    </uni-form-item>
    <uni-form-item isLink @click="viewModel()">
      <span class="primary-link">查看模型</span>
    </uni-form-item>

    <!-- 选择位置 start -->
    <uni-drawer ref="entityRef" class="drawer" mode="right" :width="750">
      <div class="header">
        <span class="close" @click="hideModal('entityRef')">取消</span>
        <span class="title">选择位置</span>
        <span class="save" @click="changeEntity('treeEntityRef')">完成</span>
      </div>
      <uni-search-bar placeholder="搜索" @input="changeKeyWordsEntity" />
      <scroll-view class="scroll-roll" scroll-y>
        <div class="content">
          <uni-tree
            ref="treeEntityRef"
            :treeData="treeEntity"
            defaultExpandAll
            :props="treeProps"
            node-key="value"
            showCheckbox
            checkOnClickNode
            :defaultCheckedKeys="selectData.entityListIds"
          />
        </div>
      </scroll-view>
    </uni-drawer>
    <!-- 选择位置 end -->

    <!-- 选择构件 start -->
    <uni-drawer ref="floorRef" class="drawer multiple" mode="right" :width="750">
      <div class="header">
        <span class="close" @click="hideModal('floorRef')">取消</span>
        <span class="title">选择构件</span>
        <span class="save" @click="changeComponent('treeComponentRef')">完成</span>
      </div>
      <uni-search-bar placeholder="搜索" @input="changeKeyWordsFloor" />
      <scroll-view class="scroll-roll" scroll-y>
        <div class="content">
          <uni-tree
            ref="treeComponentRef"
            :treeData="treeComponent"
            defaultExpandAll
            :props="treeProps"
            node-key="value"
            showCheckbox
            checkOnClickNode
          />
        </div>
      </scroll-view>
    </uni-drawer>
    <!-- 选择构件 end -->
  </uni-card>
</template>

<script>
import { find, isNull } from 'lodash'
import { workingAPI } from '@/api/working'
import { bimAPI } from '@/api/bim'
export default {
  name: 'UniSelectProcedure',
  props: {
    // 接收选择的构件或其他服务使用
    uUid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      entityList: [], // 单体列表
      keyWordsEntity: '', // 单体搜索关键词
      entityId: '', // 选择的单体id
      entityName: '',
      configId: '',
      // 楼层相关参数
      floorList: [], // 楼层列表
      keyWordsFloor: '', // 楼层搜索关键词
      floorIds: [], // 选择的楼层ID集合
      floorNames: [], // 选择的楼层名字集合
      selectFloorIds: [], // 保存的楼层ID集合
      selectFloorNames: [], // 保存的楼层名字集合
      // 工序相关参数
      procedureList: [], // 工序列表
      keyWordsProcedure: '', // 工序搜索关键词
      procedureIds: [], // 选择的工序ID集合
      procedureNames: [], // 选择的工序名字集合
      selectProcedureIds: [], // 保存的工序ID集合
      selectProcedureNames: [], // 保存的工序名字集合
      formData: [], // 最终保存的表单数据
      treeDataAll: [], // 全部树
      treeEntity: [], // 选择楼层树
      treeEntityBack: [],
      treeComponent: [], // 选择构建树
      treeComponentBack: [],
      treeProps: {
        label: 'label',
        children: 'children'
      },
      // 选择的数据
      selectData: {
        entityListIds: [], // 选择的位置 ids
        entityList: [], // 选择的位置
        componentList: [] // 选择的构建
      }
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    // 根据关键词自动查询 单体数据
    computedEntityList() {
      if (this.keyWordsEntity) {
        return this.entityList.filter(e => e.label.toLowerCase().includes(this.keyWordsEntity.toLowerCase()))
      } else {
        return this.entityList
      }
    },
    // 根据关键词自动查询 楼层数据
    computedFloorList() {
      if (this.keyWordsFloor) {
        return this.floorList.filter(e => e.label.toLowerCase().includes(this.keyWordsFloor.toLowerCase()))
      } else {
        return this.floorList
      }
    },
    // 根据关键词自动查询 工序数据
    computedProcedureList() {
      if (this.keyWordsProcedure) {
        return this.procedureList.filter(e => e.label.toLowerCase().includes(this.keyWordsProcedure.toLowerCase()))
      } else {
        return this.procedureList
      }
    },
    // 选择的构件
    selectGuid() {
      return this.$store.state.bim.selectGuid
    },
    // 选择的构件数量
    selectGuidNum() {
      return this.$store.state.bim.selectGuidNum
    }
  },
  mounted() {
    this.getBimNewTree()
  },
  methods: {
    // 获取BIM树
    async getBimNewTree() {
      if (!this.projectId) {
        return
      }
      const result = await bimAPI.getBimNewTree(this.projectId)
      let datas = result.data || []
      if (datas.length > 0) {
        this.treeDataAll = [...datas[0].children]
      }
    },
    // 处理树数据
    formatArray(array, type) {
      array.map(item => {
        item.value = item.bimResourceId || item.id
        item.label = item.bimResourceName || item.name
        if (type === 'entity') {
          this.treeEntityBack.push(item)
        } else {
          this.treeComponentBack.push(item)
        }
        if (item.type === 3) {
          let children = []
          if (type === 'entity') {
            children = (item.bimEntityDTOList || []).filter(e => e.type === 1)
            children.map(e => {
              e.entityId = item.bimResourceId
              e.componentsIds = []
              e.children.map(f => {
                // 处理楼层所有dbid
                if (f.components) {
                  e.componentsIds.push(...f.components)
                }
              })
              e.children = []
            })
          } else {
            children = (item.bimMemberDTOList || []).filter(e => e.type === 1)
            children.map(e => {
              e.entityId = item.bimResourceId
            })
          }
          item.children = children
        }
        if (item.children) {
          this.formatArray(item.children, type)
        }
      })
      return array
    },
    // 确定选择位置
    changeEntity(key) {
      let ids = this.$refs[key].getCheckedKeys()
      let labels = this.treeEntityBack.filter(e => ids.includes(e.value))
      this.selectData.entityList = labels.map(e => {
        let newItem = {
          value: e.value,
          label: e.label,
          entityId: e.entityId,
          components: e.componentsIds // 获取楼层所有dbid
        }
        return newItem
      })
      this.selectData.entityListIds = ids
      if (labels.length === 0) {
        this.$utils.showToast('请先选择楼层')
        return
      }
      this.entityName = _.map(this.selectData.entityList, 'label').join(',')
      this.$emit('change', this.selectData)
      this.hideModal('entityRef')
    },
    // 确定选择构件
    changeComponent(key) {
      let ids = this.$refs[key].getCheckedKeys()
      let labels = this.treeComponentBack.filter(e => ids.includes(e.value))
      this.selectData.componentList = labels.map(e => {
        return {
          value: e.value,
          label: e.label,
          entityId: e.entityId
        }
      })
      if (labels.length === 0) {
        this.$utils.showToast('请先选择构件')
        return
      }
      this.$emit('change', this.selectData)
      this.hideModal('floorRef')
    },
    // 显示选择模态框
    showModal(key) {
      // 选择位置
      if (key === 'entityRef') {
        this.treeEntityBack = []
        this.treeEntity = this.formatArray([...this.treeDataAll], 'entity')
      }
      // 选择楼层
      if (key === 'floorRef') {
        this.treeComponent = this.formatArray([...this.treeDataAll], 'member')
      }
      this.$refs[key].open()
    },
    // 选择构件
    selectBimModel() {
      if (this.selectData.entityList.length === 0) {
        this.$utils.showToast('请先选择楼层')
        return
      }
      let selectEntity = _.uniq(_.map(this.selectData.entityList, 'entityId'))
      let selectFloor = []
      this.selectData.entityList.map(e => {
        selectFloor.push(`${e.entityId}-${e.value}`)
      })
      this.$utils.toUrl(
        `/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=6&selectEntity=${selectEntity.join(
          ','
        )}&selectFloor=${selectFloor.join(',')}&uUid=${this.uUid}`
      )
    },
    // 关闭选择模态框
    hideModal(key) {
      this.$refs[key].close()
    },
    // 搜索单体
    changeKeyWordsEntity({ value }) {
      this.keyWordsEntity = value
    },
    // 搜索楼层
    changeKeyWordsFloor({ value }) {
      this.keyWordsFloor = value
    },
    // 搜索工序
    changeKeyWordsProcedure({ value }) {
      this.keyWordsProcedure = value
    },
    // 单体下楼层列表
    async getFloorList(configId) {
      if (!configId) {
        return
      }
      const result = await workingAPI.getFloorList(configId, false)
      let datas = result.data || []
      let list = []
      datas.map(item => {
        item.label = item.floorNum + '层'
      })
      this.floorList = datas
    },
    // 选择数据
    selectItem(item, key) {
      // 选择单体
      if (key === 'entityRef') {
        this.entityId = item.entityId
        this.entityName = item.entityName
        this.selectFloorIds = []
        this.selectFloorNames = []
        this.selectProcedureIds = []
        this.selectProcedureNames = []
        this.configId = item.configId
        this.getFloorList(item.configId)
        this.hideModal(key)
        return
      }

      // 选择楼层
      if (key === 'floorRef') {
        let index = this.floorIds.indexOf(item.floorId)
        this.selectProcedureIds = []
        this.selectProcedureNames = []
        if (index < 0) {
          this.floorIds.push(item.floorId)
          this.floorNames.push(`${item.floorNum}层`)
        } else {
          this.floorIds.splice(index, 1)
          this.floorNames.splice(index, 1)
        }
      }

      // 选择工序
      if (key === 'procedureRef') {
        let index = this.procedureIds.indexOf(item.id)
        if (index < 0) {
          this.procedureIds.push(item.id)
          this.procedureNames.push(item.mainProcedure)
        } else {
          this.procedureIds.splice(index, 1)
          this.procedureNames.splice(index, 1)
        }
      }
    },
    // 保存楼层选择
    saveFloor() {
      let selectFloor = []
      let selectFloorName = []
      this.procedureList = []
      if (this.floorIds.length === 0) {
        this.$utils.showToast('请选择楼层')
        return
      }
      this.floorList.map(item => {
        if (this.floorIds.includes(item.floorId)) {
          selectFloor.push(item.floorId)
          selectFloorName.push(item.label)
          this.getScheduleList(item.configId, item.floorNum)
        }
      })
      this.selectFloorIds = selectFloor
      this.selectFloorNames = selectFloorName
      this.hideModal('floorRef')
    },
    // 楼层下工序列表
    async getScheduleList(configId, floorNum) {
      if (!configId) {
        return
      }
      const result = await workingAPI.getScheduleList(configId, floorNum, false)
      let datas = result.data || []
      datas.map(item => {
        item.label = `${item.floorNum}层 / ${item.mainProcedure}`
        this.procedureList.push(item)
      })
    },
    // 保存工序
    saveProcedure() {
      let selectProcedureIds = []
      let selectProcedureNames = []
      if (this.procedureIds.length === 0) {
        this.$utils.showToast('请选择工序')
        return
      }
      selectProcedureIds = this.procedureIds.map(item => item)
      selectProcedureNames = this.procedureNames.map(item => item)
      this.selectProcedureIds = selectProcedureIds
      this.selectProcedureNames = selectProcedureNames
      let formData = []
      this.procedureList.map(item => {
        if (selectProcedureIds.includes(item.id)) {
          formData.push({
            configId: item.configId,
            entityId: item.entityId,
            floorId: item.floorId,
            floorNum: item.floorNum,
            floorScheduleId: item.id,
            projectId: this.projectId
          })
        }
      })
      this.formData = formData
      // 回传父组件数据
      this.$emit('change', this.formData)
      this.hideModal('procedureRef')
    },
    // 查看模型
    viewModel() {
      let guidList = []
      this.selectGuid.map(e => {
        guidList.push(..._.map(e.componentIdList, 'guid'))
      })
      this.$utils.toUrl(
        `/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=7&selectGuid=${guidList.join(',')}`
      )
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-select-entity.less';
</style>
