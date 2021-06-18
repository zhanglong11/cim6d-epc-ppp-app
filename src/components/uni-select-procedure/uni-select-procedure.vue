<template>
  <uni-card isForm>
    <uni-form-item label="选择单体" isRequired isLink @click="showModal('entityRef')">
      <textarea :value="entityName" auto-height disabled placeholder="请选择" />
    </uni-form-item>
    <uni-form-item label="选择楼层" isRequired isLink @click="showModal('floorRef')">
      <textarea
        :value="selectFloorNames.length > 1 ? `已选（${selectFloorNames.length}）层` : selectFloorNames.join('')"
        auto-height
        disabled
        placeholder="请选择"
      />
    </uni-form-item>
    <uni-form-item label="选择工序" isRequired isLink @click="showModal('procedureRef')">
      <textarea
        :value="
          selectProcedureNames.length > 1 ? `已选（${selectProcedureNames.length}）道` : selectProcedureNames.join('')
        "
        auto-height
        disabled
        placeholder="请选择"
      />
    </uni-form-item>
    <uni-form-item isLink @click="viewModel()">
      <span class="primary-link">查看模型</span>
    </uni-form-item>

    <!-- 选择单体 start -->
    <uni-drawer ref="entityRef" class="drawer" mode="right" :width="750">
      <div class="header">
        <span class="close" @click="hideModal('entityRef')">取消</span>
        <span class="title">选择单体</span>
      </div>
      <uni-search-bar placeholder="请输入单体名称" @input="changeKeyWordsEntity" />
      <scroll-view class="scroll-roll" scroll-y>
        <div class="content">
          <ul class="content-list">
            <li
              v-for="(item, i) in computedEntityList"
              :key="i"
              :class="{ active: entityId === item.entityId }"
              @click="selectItem(item, 'entityRef')"
            >
              <span class="checked" />
              <span class="name">{{ item.label }}</span>
              <span class="status">任务数：{{ item.planFinish }}/{{ item.totalProcedure }}</span>
            </li>
          </ul>
        </div>
      </scroll-view>
    </uni-drawer>
    <!-- 选择单体 end -->

    <!-- 选择楼层 start -->
    <uni-drawer ref="floorRef" class="drawer multiple" mode="right" :width="750">
      <div class="header">
        <span class="close" @click="hideModal('floorRef')">取消</span>
        <span class="title">选择楼层</span>
        <span class="save" @click="saveFloor">完成</span>
      </div>
      <uni-search-bar placeholder="请输入楼层" @input="changeKeyWordsFloor" />
      <scroll-view class="scroll-roll" scroll-y>
        <div class="content">
          <ul class="content-list">
            <li
              v-for="(item, i) in computedFloorList"
              :key="i"
              :class="{ active: floorIds.includes(item.floorId) }"
              @click="selectItem(item, 'floorRef')"
            >
              <span class="checked" />
              <span class="name">{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </scroll-view>
    </uni-drawer>
    <!-- 选择楼层 end -->

    <!-- 选择工序 start -->
    <uni-drawer ref="procedureRef" class="drawer multiple" mode="right" :width="750">
      <div class="header">
        <span class="close" @click="hideModal('procedureRef')">取消</span>
        <span class="title">选择工序</span>
        <span class="save" @click="saveProcedure">完成</span>
      </div>
      <uni-search-bar placeholder="请输入楼层或工序" @input="changeKeyWordsProcedure" />
      <scroll-view class="scroll-roll" scroll-y>
        <div class="content">
          <ul class="content-list">
            <li
              v-for="(item, i) in computedProcedureList"
              :key="i"
              :class="{ active: procedureIds.includes(item.id) }"
              @click="selectItem(item, 'procedureRef')"
            >
              <span class="checked" />
              <span class="name">{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </scroll-view>
    </uni-drawer>
    <!-- 选择工序 end -->
  </uni-card>
</template>

<script>
import { find, isNull } from 'lodash'
import { workingAPI } from '@/api/working'
export default {
  name: 'UniSelectProcedure',
  props: {},
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
      formData: [] // 最终保存的表单数据
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
    }
  },
  mounted() {
    this.getEntityList()
  },
  methods: {
    // 项目下单体列表
    async getEntityList() {
      if (!this.projectId) {
        return
      }
      const result = await workingAPI.getEntityList(this.projectId, false)
      let datas = result.data || []
      let list = datas.sort(this.$utils.setSort('entityName'))
      list.map(item => {
        item.checked = false
        item.label = item.entityName
      })
      this.entityList = list
    },
    // 显示选择模态框
    showModal(key) {
      if (!this.entityId && (key === 'floorRef' || key === 'procedureRef')) {
        this.$utils.showToast('请先选择单体')
        return
      }
      if (this.selectFloorIds.length === 0 && key === 'procedureRef') {
        this.$utils.showToast('请先选择楼层')
        return
      }
      // 选择楼层
      if (key === 'floorRef') {
        this.floorIds = this.selectFloorIds.map(item => item)
        this.floorNames = this.selectFloorNames.map(item => item)
      }
      // 选择工序
      if (key === 'procedureRef') {
        this.procedureIds = this.selectProcedureIds.map(item => item)
        this.procedureNames = this.selectProcedureNames.map(item => item)
      }
      this.$refs[key].open()
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
      let floorNum = []
      if (!this.entityId) {
        this.$utils.showToast('请先选择单体')
        return
      }
      if (this.selectFloorIds.length === 0) {
        this.$utils.showToast('请先选择楼层')
        return
      }
      floorNum = this.selectFloorNames.join(',').replace(/层/g, '')
      let url = `/pages/bim-model/index?entityId=${this.entityId}&configId=${this.configId}&entityName=${this.entityName}&floorNum=${floorNum}&showBtn=false`
      this.$utils.toUrl(url)
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-select-procedure.less';
</style>
