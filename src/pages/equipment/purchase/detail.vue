<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!--已通过 显示 start-->
        <block v-if="baseInfo.status === 2">
          <!-- <uni-form-custom ref="formPerson" :model="form" :rules="personRules">
            <uni-card isForm>
              <uni-form-item label="指定到货确认人" isLink isRequired prop="nextPerson">
                <uni-select-user v-model="form.nextPersonId" :name.sync="form.nextPerson" placeholder="请选择" />
              </uni-form-item>
            </uni-card>
          </uni-form-custom>-->
          <view class="btn-wrapper">
            <button class="button" type="primary" style="border-radius: 3px" @click="handlePurchase">
              采购
            </button>
          </view>
        </block>
        <!--已通过 显示 end-->
        <!--待入库信息 显示 start-->
        <block v-if="baseInfo.status === 6">
          <view class="btn-wrapper">
            <button class="button" type="primary" style="border-radius: 3px" @click="handleStorage">
              入库
            </button>
          </view>
        </block>
        <!--待入库信息 显示 end-->

        <view v-if="baseInfo.status !== 1 && baseInfo.status !== 0" class="card-title-info">
          <view class="title">审核信息</view>
        </view>
        <uni-card>
          <uni-form-item label="采购单编号" :border="false" align="left">
            <view>{{ baseInfo.code }}</view>
          </uni-form-item>
          <uni-form-item label="" style="margin:0 0 -15px 0;padding-bottom: 0;">
            <view v-if="baseInfo.status >= 0">
              <span class="circle" :style="{ backgroundColor: purchaseStatus[baseInfo.status].color }"></span
              >{{ purchaseStatus[baseInfo.status].label }}
            </view>
          </uni-form-item>
          <uni-form-item label="申请到货时间" :border="false" align="left">
            <!-- <view class="placeholder">采购入库</view> -->
            <view class="placeholder">{{ baseInfo.appyArrivalTime | formatData }}</view>
          </uni-form-item>
          <uni-form-item label="申请部门" :border="false" align="left">
            <!-- <view class="placeholder">采购入库</view> -->
            <view class="placeholder">{{ baseInfo.applyDepartmentName }}</view>
          </uni-form-item>
          <uni-form-item label="申请原因" :border="false" align="left">
            <!-- <view class="placeholder">采购入库</view> -->
            <view class="placeholder">{{ baseInfo.applyReason }}</view>
          </uni-form-item>
          <uni-form-item label="使用位置" :border="false" align="left">
            <!-- <view class="placeholder">采购入库</view> -->
            <view class="placeholder">{{ baseInfo.usePart }}</view>
          </uni-form-item>
          <uni-form-item label="设备使用人" :border="false" align="left">
            <!-- <view class="placeholder">采购入库</view> -->
            <view class="placeholder">{{ baseInfo.userName }}</view>
          </uni-form-item>
          <uni-form-item label="设备使用部门" :border="false" align="left">
            <!-- <view class="placeholder">采购入库</view> -->
            <view class="placeholder">{{ baseInfo.useCompanyName }}</view>
          </uni-form-item>
        </uni-card>
        <!--采购中 显示 start-->
        <block v-if="baseInfo.status === 4">
          <!--<uni-card isForm>
            <uni-form-item label="指定到货确认人" isLink isRequired prop="consigneeId">
              <uni-select-user v-model="form.consigneeId" :name.sync="form.consigneeName" placeholder="请选择" />
            </uni-form-item>
          </uni-card>-->
        </block>
        <!--采购中 显示 end-->
        <view class="card-title-outer">
          <view class="title">采购明细</view>
        </view>
        <uni-card>
          <block v-for="(item, index) in baseInfo.purchaseDetails || []" :key="index">
            <view v-if="index > 0" class="line"></view>
            <uni-form-item label="序号" :border="false" align="left">
              <view class="placeholder">{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
            </uni-form-item>
            <uni-form-item label="设备名称" :border="false" align="left">
              <view class="placeholder">{{ item.name }}</view>
            </uni-form-item>
            <uni-form-item label="设备类型" :border="false" align="left">
              <view class="placeholder">{{ $getLabel(equipmentType, item.type) }}</view>
            </uni-form-item>
            <uni-form-item label="规格型号" :border="false" align="left">
              <view class="placeholder">{{ item.models }}</view>
            </uni-form-item>
            <uni-form-item label="单位" :border="false" align="left">
              <view class="placeholder">{{ item.materialUnit || item.unit }}</view>
            </uni-form-item>
            <uni-form-item label="生产厂家" :border="false" align="left">
              <view class="placeholder">{{ item.manufacturer }}</view>
            </uni-form-item>
            <uni-form-item label="供应商" :border="false" align="left">
              <view class="placeholder">{{ item.materialSupplier || item.supplier }}</view>
            </uni-form-item>
            <uni-form-item label="申请采购数量" :border="false" align="left">
              <view class="placeholder">{{ item.number }}</view>
            </uni-form-item>
            <uni-form-item label="单价" :border="false" align="left">
              <view class="placeholder">{{ item.univalence }}</view>
            </uni-form-item>
            <uni-form-item label="合价" :border="false" align="left">
              <view class="placeholder">{{ item.combinedPrice }}</view>
            </uni-form-item>
            <block v-if="baseInfo.status === 5 || baseInfo.status === 6">
              <uni-form-item label="到货数量" :border="false" align="left">
                <view class="placeholder">{{ item.arrivalNumber }}</view>
              </uni-form-item>
              <uni-form-item label="可入库量" :border="false" align="left">
                <view class="placeholder">{{ item.enableInputNumber }}</view>
              </uni-form-item>
              <uni-form-item label="备注" :border="false" align="left">
                <view class="placeholder">{{ item.remark }}</view>
              </uni-form-item>
            </block>
            <!--采购中 显示 start-->
            <block v-if="baseInfo.status === 4">
              <uni-form-custom :ref="item.id" :model="item" :rules="subRules" class="border-top">
                <uni-card isForm style="border: 0;border-radius: 0;width: 345px;">
                  <uni-form-item label="到货数量" isRequired prop="arrivalNumber">
                    <input v-model.number="item.arrivalNumber" class="uni-input" placeholder="点击输入" />
                  </uni-form-item>
                  <uni-form-item label="可入库量" isRequired prop="enableInputNumber">
                    <input v-model.number="item.enableInputNumber" class="uni-input" placeholder="点击输入" />
                  </uni-form-item>
                  <uni-form-item label="备注" align="rihgt" type="textarea">
                    <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入" auto-height />
                  </uni-form-item>
                </uni-card>
              </uni-form-custom>
            </block>
            <!--采购中 显示 end-->
            <!--鉴定验收 显示 start-->
            <block v-if="baseInfo.status === 5">
              <uni-form-custom :ref="item.id" :model="item" :rules="subRules5" class="border-top">
                <uni-card isForm style="border: 0;border-radius: 0;width: 345px;">
                  <uni-form-item label="检定验收结果" isLink isRequired prop="acceptResult">
                    <view name="acceptResult" @click="handleResultItemClick5(index)">{{
                      item.acceptResult === true ? '通过' : item.acceptResult === false ? '驳回' : '点击选择'
                    }}</view>
                  </uni-form-item>
                  <uni-form-item label="检定验收单位" isRequired prop="acceptUnit">
                    <input v-model.number="item.acceptUnit" class="uni-input" placeholder="点击输入" />
                  </uni-form-item>
                  <uni-form-item label="检定验收内容" isRequired prop="acceptContent">
                    <input v-model.number="item.acceptContent" class="uni-input" placeholder="点击输入" />
                  </uni-form-item>
                  <uni-form-item label="检定验收时间" isRequired prop="acceptTime">
                    <uni-date-picker v-model="item.acceptTime" fields="second" mode="date"></uni-date-picker>
                  </uni-form-item>
                </uni-card>
              </uni-form-custom>
            </block>
            <!--鉴定验收 显示 end-->
          </block>
        </uni-card>
        <!-- 备注信息 start -->
        <view class="btn-wrapper">
          <!--采购状态 start-->
          <button v-if="baseInfo.status === 4" class="button" type="primary" @click="handleReceiveGoods">
            到货确认
          </button>
          <button v-if="baseInfo.status === 5" class="button" type="primary" @click="handleAccept">
            鉴定验收
          </button>
          <!--采购状态 end-->
        </view>
        <uni-card>
          <uni-form-item label="采购金额(￥)" :border="false" align="left">
            <view class="placeholder"> {{ totalPrice }}</view>
          </uni-form-item>

          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.remark }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 入库人信息 start -->
        <uni-card>
          <uni-form-item label="申请人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.applicantName }}</view>
          </uni-form-item>

          <uni-form-item label="申请时间" :border="false" align="left">
            <view class="placeholder">{{ (baseInfo.applyTime || '') | formatData }}</view>
          </uni-form-item>
        </uni-card>
        <block v-if="baseInfo.status !== 1 && baseInfo.status !== 0">
          <uni-card title="审核结果">
            <uni-form-item label="审核结果" :border="false">
              <view class="placeholder">{{ ['通过', '驳回'][baseInfo.status - 2] }}</view>
              <!--              <view v-if="baseInfo.status">{{ // baseInfo.status===2?:"" }}</view>-->
            </uni-form-item>
            <uni-form-item label="审核人" :border="false"
              ><view class="placeholder">{{ baseInfo.reviewerName }}</view></uni-form-item
            >
            <uni-form-item label="审核意见">
              <view class="placeholder">{{ baseInfo.optionContent }}</view>
            </uni-form-item>
            <uni-form-item label="审核日期" :border="false">
              <view class="placeholder">{{ baseInfo.auditTime | ymd }}</view>
            </uni-form-item>
          </uni-card>
        </block>
        <block v-if="baseInfo.status === 1">
          <uni-form-custom ref="auditForm" :model="form" :rules="rules">
            <uni-card isForm>
              <uni-form-item label="审核日期" isLink prop="actualInspectTime">
                <uni-date-picker v-model="form.actualInspectTime" mode="date" fields="day"></uni-date-picker>
              </uni-form-item>
              <uni-form-item label="审核人">
                {{ $store.state.user.userName }}
              </uni-form-item>
              <uni-form-item label="审核意见" prop="optionContent">
                <textarea v-model.trim="form.optionContent" :maxlength="-1" auto-height placeholder="点击输入" />
              </uni-form-item>
              <uni-form-item label="审核结果" isLink isRequired prop="status">
                <view name="IsCheckText" @click="handleResultItemClick">{{ IsCheckText || '点击选择' }}</view>
              </uni-form-item>
            </uni-card>
          </uni-form-custom>
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleCheck">
              审核
            </button>
          </view>
        </block>
      </view>
      <!-- <view v-if="baseInfo.status === 0" class="btn-wrapper">
        <button class="button" type="primary" @click="handleSubmit">
          保存
        </button>
      </view> -->
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/equipmentPurchase'
import purchaseStatus from './lib/purchaseStatus'
import equipmentType from './lib/equipmentType'
import _ from 'lodash'

export default {
  data() {
    return {
      id: '',
      isDraft: true, //是否草稿

      baseInfo: {},
      purchaseStatus,
      equipmentType,
      status: '',
      totalPrice: '',
      //审核是否合格：
      IsCheck: [
        { name: '通过', value: 2 },
        { name: '驳回', value: 3 }
      ],
      //是否继续
      IsContinue: [
        { name: '是', value: 1 },
        { name: '否', value: 2 }
      ],
      form: {
        nextPerson: '',
        IsContinueValue: '',
        auditStatus: '',
        auditOpinion: '',
        optionContent: ''
      },
      rules: {
        status: { required: true }
      },
      personRules: {
        nextPerson: {
          required: true
        }
      },
      subRules: {
        arrivalNumber: {
          required: true
        },
        enableInputNumber: {
          required: true
        }
      },
      //鉴定验收验证
      subRules5: {
        acceptUnit: {
          required: true
        },
        acceptContent: {
          required: true
        },
        acceptTime: {
          required: true
        }
      },
      //检查结果是否合格
      IsCheckText: '',
      //检查结果是否继续
      IsContinueText: ''
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
    this.status = options.status || ''
    this.isDraft = Number(options.status) === 0
    this.init()
  },
  onReady() {
    // 非草稿状态隐藏顶部更多操作
    // #ifdef  APP-PLUS
    if (!this.isDraft) {
      let webView = this.$mp.page.$getAppWebview()
      webView.setTitleNViewButtonStyle(0, {
        text: '',
        fontSize: 0
      })
    }
    // #endif
  },
  onNavigationBarButtonTap(obj) {
    if (obj.type === 'menu') {
      this.showMenu()
    }
  },
  methods: {
    init() {
      // 通过请求获取设备详情
      Api.getEquipmentPurchaseOrderDetail(this.id).then(res => {
        this.baseInfo = res.data || {}
        //计算采购金额
        let totalPrice = 0
        const base = 1000 //用来避免小数计算产生异常
        if (this.baseInfo) {
          _.forEach(this.baseInfo.purchaseDetails, item => {
            if (item.univalence && item.number) {
              totalPrice += item.univalence * base * (item.number * base)
            }
          })
          this.totalPrice = totalPrice / base / base
        }
      })
    },
    //草稿状态下 进行删除
    handleDelete() {
      Api.getPurchaseOrderDelete(this.id).then(res => {
        if (res.code === 200) {
          this.$utils.showToast('删除成功')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        }
      })
    },

    //草稿状态下进行保存
    async handleSubmit() {
      await Api.updateEquipmentPurchaseOrder({
        ...this.baseInfo,
        status: 1,
        projectId: this.projectId
      })
      this.$utils.showToast('已保存')
    },
    // 审核中 进行审核
    async handleCheck() {
      await this.$refs.auditForm.validate()
      console.log(this.form)
      await this.fly.material.post(`/equipmentPurchase/updatePurchase`, { ...this.form, id: this.id })
      this.$utils.showToast('审核完成')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    },
    // 已通过 进行采购
    async handlePurchase() {
      /*await this.$refs.formPerson.validate()*/
      await this.fly.material.get(`/equipmentPurchase/makePurchases/${this.id}`)
      this.$utils.showToast('采购成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    },
    //选择检查结果
    handleResultItemClick() {
      let vm = this
      let itemList = (this.IsCheck || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.IsCheck[res.tapIndex] || {}
          vm.IsCheckText = selectItem.name
          vm.form.status = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //验收结果
    handleResultItemClick5(index) {
      console.log(index)
      let vm = this
      let itemList = (this.IsCheck || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.IsCheck[res.tapIndex] || {}
          // vm.IsCheckText = selectItem.name
          // vm.form.status = selectItem.value
          vm.baseInfo.purchaseDetails[index].acceptResult = selectItem.value === 2 ? true : false
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //选择检查结果是否继续审核
    handleIsCheckItemClick() {
      let vm = this
      let itemList = (this.IsContinue || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.IsContinue[res.tapIndex] || {}
          vm.IsContinueText = selectItem.name
          vm.form.IsContinueValue = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //采购中 到货确认
    async handleReceiveGoods() {
      await Promise.all(
        this.baseInfo.purchaseDetails.map(item => {
          return this.$refs[item.id][0].validate()
        })
      )
      await this.fly.material.post(`/equipmentPurchase/arrivalConfirmation`, {
        id: this.id,
        purchaseDetails: this.baseInfo.purchaseDetails
      })
      this.$utils.showToast('确认收货成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    },
    //鉴定验收
    async handleAccept() {
      let res = this.baseInfo.purchaseDetails.some(item => item.acceptResult === null)
      if (res) {
        this.$utils.showToast('鉴定结果不能为空')
        return false
      }
      await Promise.all(
        this.baseInfo.purchaseDetails.map(item => {
          return this.$refs[item.id][0].validate()
        })
      )
      await this.fly.material.post(`/equipmentPurchase/verificationAcceptance`, {
        id: this.id,
        purchaseDetails: this.baseInfo.purchaseDetails
      })
      this.$utils.showToast('鉴定验收成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    },
    //待入库 进行入库操作
    async handleStorage() {
      await this.fly.material.get(`/equipmentPurchase/addInventory/${this.id}`)
      this.$utils.showToast('入库成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    },
    // 草稿状态的报修项展示更多操作：编辑和删除
    showMenu() {
      uni.showActionSheet({
        itemList: ['编辑', '删除'],
        success: res => {
          let index = res.tapIndex
          if (index === 1) {
            this.handleDelete()
          } else if (index === 0) {
            this.$utils.toUrl(`/pages/equipment/purchase/add?id=${this.id}`)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import './detail.less';
</style>
