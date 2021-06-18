<template>
  <view class="main">
    <div v-if="saveTime" class="save-time">实时保存{{ saveTime }}</div>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="使用申请单编号">
              <textarea v-model.trim="form.code" auto-height disabled placeholder="自动生成" />
            </uni-form-item>
            <uni-form-item label="使用申请单名称" prop="applyName" isRequired>
              <textarea v-model.trim="form.applyName" auto-height placeholder="点击输入" />
            </uni-form-item>
            <uni-form-item label="申请部门" prop="applyDepartmentName" isRequired isLink>
              <uni-department-select
                v-model="form.applyDepartmentId"
                :name.sync="form.applyDepartmentName"
              ></uni-department-select>
            </uni-form-item>
            <!--            <uni-form-item label="申请到货时间" prop="appyArrivalTime" isRequired isLink>-->
            <!--              <uni-date-picker v-model="form.appyArrivalTime" fields="day" mode="date"></uni-date-picker>-->
            <!--            </uni-form-item>-->
            <uni-form-item label="申请原因">
              <textarea v-model.trim="form.applyReason" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="关联进度" isLink>
              <textarea
                v-model="form.schduleName"
                :ids="form.schduleId"
                auto-height
                disabled
                placeholder="请选择"
                @click="handleOpenProcedureDrawer"
              />
            </uni-form-item>
            <uni-form-item label="指定审核人" isLink isRequired prop="firstAuditPersonName">
              <uni-select-user
                v-model="form.firstAuditPersonId"
                :name.sync="form.firstAuditPersonName"
                placeholder="请选择"
              />
            </uni-form-item>
            <uni-form-item label="备注">
              <textarea v-model.trim="form.remark" auto-height placeholder="请输入" />
            </uni-form-item>
            <!--            <uni-form-item label="类型" prop="type" isRequired isLink>-->
            <!--              <uni-select v-model="form.type" :options="purchaseType" @change="selectChangeVal"></uni-select>-->
            <!--            </uni-form-item>-->
          </uni-card>
        </uni-form-custom>
        <view class="card-title-outer">
          <view class="title">
            <view>采购明细</view>
            <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleOpenDrawer"></uni-icons>
          </view>
        </view>
        <block v-if="listWithCache.length">
          <block v-for="(item, index) in listWithCache" :key="index">
            <uni-form-custom :ref="index" :model="item" :rules="subRules" class="border-top mt20">
              <uni-card v-if="item.id">
                <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />
                <uni-form-item label="序号">
                  <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                </uni-form-item>
                <uni-form-item label="材料编码">
                  <view>{{ item.materialCode || item.code }}</view>
                </uni-form-item>
                <uni-form-item label="材料名称">
                  <view>{{ item.materialName || item.name }}</view>
                </uni-form-item>
                <uni-form-item label="规格型号">
                  <view>{{ item.materialModels || item.models }}</view>
                </uni-form-item>
                <uni-form-item label="单位">
                  <view>{{ item.materialUnit || item.unit }}</view>
                </uni-form-item>
                <uni-form-item label="品牌">
                  <view>{{ item.materialBrand || item.brand }}</view>
                </uni-form-item>
                <uni-form-item label="供应商">
                  <view>{{ item.materialSupplier || item.supplier }}</view>
                </uni-form-item>
                <uni-form-item label="库存量">
                  <view>{{ item.materialInventoryNumber || item.inventoryNumber || 0 }}</view>
                </uni-form-item>
                <!--                <uni-form-item label="预算量">-->
                <!--                  <view class="placeholder">{{ item.budgetNumber }}</view>-->
                <!--                </uni-form-item>-->

                <uni-form-item label="使用申请数量" isRequired prop="number">
                  <input
                    v-model.number="item.number"
                    type="number"
                    class="uni-input"
                    placeholder="请输入申请采购数量"
                    @change="handleCalcombinedPrice(item)"
                  />
                </uni-form-item>
                <!--                <uni-form-item label="单价(￥)" isRequired prop="univalence">-->
                <!--                  <input-->
                <!--                    v-model.number="item.univalence"-->
                <!--                    type="number"-->
                <!--                    class="uni-input"-->
                <!--                    placeholder="请输入材料单价"-->
                <!--                    @change="handleCalcombinedPrice(item)"-->
                <!--                  />-->
                <!--                </uni-form-item>-->
                <!--                <uni-form-item label="合价(￥)">-->
                <!--                  <view>{{ item.combinedPrice || null }}</view>-->
                <!--                </uni-form-item>-->
              </uni-card>
            </uni-form-custom>
          </block>

          <!-- 备注信息开始 -->
          <uni-card v-if="purchasePersonVisible" isForm>
            <uni-form-item label="通知采购人" isLink isRequired prop="purchasePersonName">
              <uni-select-user
                v-model="form.purchasePersonId"
                :name.sync="form.purchasePersonName"
                placeholder="请选择"
              />
            </uni-form-item>
            <!--            <uni-form-item isRequired label="审批人" align="right" isLink>-->
            <!--              <uni-select-user-->
            <!--                v-model="form.firstAuditPersonId"-->
            <!--                :name.sync="form.firstAuditPersonName"-->
            <!--              ></uni-select-user>-->
            <!--            </uni-form-item>-->
            <!--            <uni-form-item label="采购金额">-->
            <!--              <view>{{ totalPrice }}</view>-->
            <!--            </uni-form-item>-->
            <!--            <uni-form-item label="申请人">-->
            <!--              <view>{{ $store.state.user.userName }}</view>-->
            <!--            </uni-form-item>-->
            <!--            <uni-form-item label="备注" align="right">-->
            <!--              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入" auto-height />-->
            <!--            </uni-form-item>-->
          </uni-card>
          <!-- 备注信息结束 -->
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit(1)">提 交</button>
          </view>
        </block>
      </view>
    </scroll-view>
    <uni-drawer ref="productList" :width="750" mode="right">
      <inventory-select :checked="checkedValue" @selected="handleInventorySelected"></inventory-select>
    </uni-drawer>
    <!-- 进度侧边栏start -->
    <uni-drawer ref="ProcedureList" class="drawer" :width="750" mode="right">
      <div class="header">
        <span class="close" @click="handleCloseDrawer">取消</span>
        <span class="title">关联进度</span>
      </div>
      <SelectStepOne :uUid="uUid" @selected="handleSelectedSchdule" />
    </uni-drawer>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import InventorySelect from './inventory'
import { Api } from '@/api/material/purchaseOrder'
import SelectStepOne from '@/pages/material/materialUse/components/SelectStepOne'
export default {
  components: {
    InventorySelect,
    SelectStepOne
  },
  data() {
    return {
      //申请到货日期
      checkDate: '',
      id: '',
      purchasePersonVisible: false,
      form: {
        projectId: wx.getStorageSync('projectId'),
        applyDepartmentId: '',
        applyDepartmentName: '',
        applicantId: '',
        applicantName: '',
        applyReason: '',
        schduleName: '',
        schduleId: '',
        code: ''
        // type: 1
      },
      rules: {
        applyName: { required: true },
        applyDepartmentName: { required: true },
        firstAuditPersonName: { required: true },
        purchasePersonName: { required: true }
      },
      subRules: {
        number: {
          required: true
        }
      },
      list: [], //选中的材料
      checkedValue: [], //选中的 材料的id
      totalPrice: '', //采购金额,
      uUid: this.$utils.getUuid() || '' // 接收选择的构件或其他服务使用
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    // 表单缓存
    formDataTemp() {
      return this.$store.state.addCache.addMaterialPurchaseOrderCache
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.addCache.saveTime
    },
    listWithCache() {
      return [...this.$store.state.addCache.addMaterialPurchaseOrderCache.list, ...this.list]
    }
  },
  onLoad(options) {
    this.form.applicantId = this.$store.state.user.userId
    this.form.applicantName = this.$store.state.user.userName
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑材料使用申请')
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'draft') {
      this.handleSubmit(0)
    }
  },
  beforeDestroy() {
    // 关闭自动缓存定时器
    this.$store.commit('closeCacheTimer')
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.autoSave()
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('setAddMaterialPurchaseOrderCache', { ...this.form, list: this.list })
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('clearCompanyTemp', 'addLogCache')
    },
    //获得详情
    getDetail() {
      Api.getPurchaseOrderDetail(this.id).then(res => {
        this.form = res.data || {}
        this.list = [...this.form.details]
        // console.log('获得详情', this.list)
      })
    },
    //删除选中的采购产品
    handleDeleteItem(index) {
      this.list.splice(index, 1)
    },
    // 点击保存按钮
    async handleSubmit(type) {
      // 开启表单验证
      await this.$refs.form.validate()
      Promise.all(
        this.list.map((item, index) => {
          console.log('item' + index)
          // let item = 'item' + index
          return this.$refs[index][0].validate()
        })
      ).then(res => {
        let data = _.cloneDeep(this.form)
        data.appyArrivalTime = `${data.appyArrivalTime} 00:00:00`
        // console.log('材料',this.list)
        data.details = this.list.map(item => {
          return {
            materialId: item.id,
            number: item.number
          }
        })
        // if (!this.form.firstAuditPersonId) {
        //   this.$utils.showToast('请选择审批人')
        //   return
        // }
        let num = this.id ? 2 : 1
        this.id
          ? Api.getMaterialApplyConstructionUpdate({ ...data, status: type }).then(res => {
              if (type === 1) {
                this.$utils.showToast('保存成功')
              } else {
                this.$utils.showToast('已保存草稿')
              }
              this.clearCache()
              setTimeout(() => {
                this.$utils.goBack(num)
              }, 1000)
            })
          : Api.getMaterialApplyConstructionAdd({ ...data, status: type }).then(res => {
              if (type === 1) {
                this.$utils.showToast('保存成功')
              } else {
                this.$utils.showToast('已保存草稿')
              }
              this.clearCache()
              setTimeout(() => {
                this.$utils.goBack(num)
              }, 1000)
            })
      })
    },
    // 打开物料选择框
    handleOpenDrawer() {
      this.$refs.productList.open()
    },
    // 选中物料后数据回传处理
    handleInventorySelected(data) {
      let { checked, checkedValue } = data
      let list = data.checked.map(item => {
        return Object.assign(item, {
          number: null,
          univalence: null,
          combinedPrice: null
        })
      })
      var result = [...this.list, ...list]
      let addMaterial = _.filter(result, item => !item.id)
      let checkedMaterial = _.unionBy(
        _.filter(result, item => item.id),
        'id'
      )
      this.list = [...addMaterial, ...checkedMaterial]
      this.checkedValue = [...data.checkedValue]
      this.$refs.productList.close()
      // console.log('选中材料', this.list)
    },
    // 如果材料使用量大于库存量不显示采购人
    handleCalcombinedPrice(item) {
      if (item.number > item.inventoryNumber) {
        this.purchasePersonVisible = true
      } else {
        this.purchasePersonVisible = false
      }
    },
    // 显示进度选择模态框
    handleOpenProcedureDrawer() {
      this.$refs.ProcedureList.open()
    },
    // 关闭进度选择模态框
    handleCloseDrawer() {
      this.$refs.ProcedureList.close()
    },
    // 选择进度完成
    handleSelectedSchdule(data) {
      this.form.schduleName = data.checked.map(item => item.name).join(',') || ''
      this.form.schduleId = data.checked.map(item => item.id).join(',') || ''
      this.$refs.ProcedureList.close()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
@import url('step.less');
.mt20 + .mt20 {
  margin-top: 40rpx;
}
</style>
