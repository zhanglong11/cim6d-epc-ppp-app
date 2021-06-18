<template>
  <view class="main ">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="设备名称" isLink isRequired prop="equipmentId">
            <textarea
              v-model.trim="form.equipmentName"
              disabled
              auto-height
              placeholder="点击选择设备"
              @click="handleEquipmentItemClick"
            />
          </uni-form-item>
          <uni-form-item label="故障发生时间" isLink isRequired prop="faultTime">
            <uni-date-picker v-model="form.faultTime" fields="minute" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="操作人员" isRequired prop="operatorName">
            <textarea
              v-model.trim="form.operatorName"
              placeholder="请输入操作人员"
              auto-height
              @change="handleOperatorChange"
            />
          </uni-form-item>
          <uni-form-item label="操作人员电话" isRequired prop="operatorPhone">
            <textarea v-model.trim="form.operatorPhone" placeholder="请输入操作人员电话" auto-height />
          </uni-form-item>
          <uni-form-item label="故障等级" isRequired isLink prop="level">
            <view :class="{ placeholder: !Boolean(form.level) }" @click="handleLevelSelected">
              {{ form.level ? $getLabel(levelList, form.level) : '点击选择故障等级' }}
            </view>
          </uni-form-item>
          <uni-form-item label="故障类别" isRequired isLink prop="type">
            <view :class="{ placeholder: !Boolean(form.type) }" @click="handleCategorySelected">
              {{ form.type ? $getLabel(categoryList, form.type) : '点击选择故障类别' }}
            </view>
          </uni-form-item>
          <uni-form-item label="维修班组" isLink isRequired prop="repairDepartmentId">
            <uni-department-select
              v-model="form.repairDepartmentId"
              :multiple="false"
              :name.sync="form.repairDepartmentName"
            ></uni-department-select>
          </uni-form-item>
          <uni-form-item label="紧急程度" isRequired isLink prop="urgency">
            <view :class="{ placeholder: !Boolean(form.urgency) }" @click="handleUrgencySelected">
              {{ form.urgency ? $getLabel(urgencyList, form.urgency) : '点击选择紧急程度' }}
            </view>
          </uni-form-item>
          <uni-form-item label="是否停机" isRequired isLink prop="isStop">
            <view :class="{ placeholder: !Boolean(form.isStop) }" @click="handleStopSelected">
              {{ form.isStop ? $getLabel(isStopList, form.isStop) : '点击选择' }}
            </view>
          </uni-form-item>
          <uni-form-item label="故障描述" isRequired prop="description">
            <textarea v-model.trim="form.description" :maxlength="-1" placeholder="请输入故障描述" auto-height />
          </uni-form-item>
          <uni-form-item label="是否外委" isRequired isLink prop="isOutsource">
            <view :class="{ placeholder: !Boolean(form.isOutsource) }" @click="handleOutsourceSelected">
              {{ form.isOutsource ? $getLabel(isOutsourceList, form.isOutsource) : '点击选择' }}
            </view>
          </uni-form-item>
        </uni-card>

        <!-- 附件信息 start -->
        <uni-card isForm class="attachmentInfo">
          <uni-form-item label="备注">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>

          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <!-- 附件信息 end -->
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSubmit">提 交</button>
      </view>
    </view>
    <!-- 故障列表start  -->
    <uni-drawer-custom ref="filterRef" title="故障类别" :width="750" @reset="handleDrawerReset">
      <view class="category-list">
        <view
          v-for="item in categoryList"
          :key="item.value"
          class="list-item"
          :class="{ active: form.type === item.value }"
          @click="handleCategoryItemClick(item)"
        >
          <view class="title">{{ item.label }}</view>
          <span class="check"></span>
        </view>
      </view>
    </uni-drawer-custom>
    <!-- 故障列表end -->
    <!-- 设备列表start -->
    <uni-drawer ref="equipmentList" :width="750" mode="right">
      <select-equipment :status="1" @selected="handleEquipmentSelect"></select-equipment>
    </uni-drawer>
    <!-- 设备列表end -->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import levelList from './lib/levelList'
import categoryList from './lib/categoryList'
import urgencyList from './lib/urgencyList'
import isStopList from './lib/isStopList'
import isOutsourceList from './lib/isOutsourceList'
import SelectEquipment from '../select-equipment/select-equipment'

export default {
  components: {
    SelectEquipment
  },
  data() {
    return {
      id: '', //用于编辑,此时编辑项为草稿状态
      loading: false,
      form: {
        projectId: wx.getStorageSync('projectId'),
        files: '',
        type: null, //故障类别
        level: null, //故障等级
        urgency: null, //紧急程度
        isStop: null, //是否停机
        repairDepartmentId: '',
        repairDepartmentName: '',
        isOutsource: null, //是否外委
        equipmentName: ''
      },
      rules: {
        equipmentId: {
          required: true
        },
        operatorName: { required: true },
        faultTime: { required: true },
        operatorPhone: { required: true },
        level: { required: true },
        type: { required: true },
        urgency: { required: true },
        isStop: { required: true },
        description: { required: true },
        isOutsource: { required: true },
        type: {
          required: true
        }
      },
      repairDepartmentList: [], //维修班组信息
      levelList,
      categoryList,
      urgencyList,
      isStopList,
      isOutsourceList,
      drawerForm: {}
    }
  },
  onLoad(options) {
    this.id = options.id || ''
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'draft') {
      this.handleSubmit('draft')
    }
  },
  methods: {
    init() {
      this.queryRepairDepartmentInfo()
      if (this.id) {
        this.form.id = this.id
        this.$utils.setTitle('编辑设备故障信息')

        this.getItemDetailInfo()
      }
    },
    // 获取草稿维修单的详细信息
    async getItemDetailInfo() {
      let result = await this.fly.material.get(`equipmentRepair/get/${this.id}`)
      let baseInfo = result.data || {}
      Object.assign(this.form, baseInfo)
    },
    // 输入操作人员后，默认人员ID和name一致
    handleOperatorChange() {
      this.form.operatorId = this.form.operatorName
    },
    // 选择设备
    handleEquipmentItemClick() {
      this.$refs.equipmentList.open()
    },
    // 选中设备的回调
    handleEquipmentSelect(data) {
      this.$refs.equipmentList.close()
      if (!data) return
      Object.assign(this.form, data)
    },
    // 编辑时获取维修项基本信息
    async queryItemInfo() {
      let result = await this.fly.material.get(`equipmentRepair/get/${this.id}`)
      let baseInfo = result.data || {}
      Object.assign(this.form, baseInfo)
    },
    // 获取维修班组信息
    async queryRepairDepartmentInfo() {
      let params = {
        projectId: this.projectId,
        content: '维修',
        page: 1,
        rows: 500
      }
      let result = await this.fly.construction.post('labour/group/list', params, { isLoading: true })
      let datas = (result.data && result.data.records) || []

      this.repairDepartmentList = _.map(datas, item => {
        return {
          label: item.name,
          value: item.id
        }
      })
    },

    // 选择故障类别
    handleCategorySelected() {
      this.$refs.filterRef.open()
    },
    handleCategoryItemClick(item) {
      this.form.type = item.value
      this.$refs.filterRef.close()
    },
    handleDrawerReset() {
      this.form.type = null
      this.$refs.filterRef.close()
    },
    // 选择是否外委
    handleOutsourceSelected() {
      uni.showActionSheet({
        itemList: _.map(this.isOutsourceList, 'label'),
        success: res => {
          let selectItem = this.isOutsourceList[res.tapIndex] || {}
          this.form.isOutsource = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选择是否停机
    handleStopSelected() {
      uni.showActionSheet({
        itemList: _.map(this.isStopList, 'label'),
        success: res => {
          let selectItem = this.isStopList[res.tapIndex] || {}
          this.form.isStop = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选择紧急程度
    handleUrgencySelected() {
      uni.showActionSheet({
        itemList: _.map(this.urgencyList, 'label'),
        success: res => {
          let selectItem = this.urgencyList[res.tapIndex] || {}
          this.form.urgency = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选择故障等级
    handleLevelSelected() {
      uni.showActionSheet({
        itemList: _.map(this.levelList, 'label'),
        success: res => {
          let selectItem = this.levelList[res.tapIndex] || {}
          this.form.level = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 保存
    async handleSubmit(type) {
      await this.$refs.form.validate()
      let mobile = /^((\+|00)86)?1((3[\d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[\d])|(9[1,8,9]))\d{8}$/
      if (!mobile.test(this.form.operatorPhone)) {
        this.$utils.showToast('请输入正确的操作人员电话')
        return
      }
      let url = '/equipmentRepair/add'
      let params = _.cloneDeep(this.form)
      params.repairStatus = 1
      if (this.id) {
        //编辑草稿状态的故障单
        url = '/equipmentRepair/submit'
      }
      // 添加草稿状态故障单
      if (type === 'draft') {
        params.repairStatus = 0
      }

      let result = await this.fly.material.post(url, params)
      if (result.code === 200) {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          let num = this.id ? 2 : 1
          this.$utils.goBack(num)
        }, 1500)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
