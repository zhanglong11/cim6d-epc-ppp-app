<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view v-if="baseInfo.status !== 1 && baseInfo.status !== 0" class="card-title-info">
          <view class="title">审核信息</view>
        </view>
        <uni-card>
          <uni-form-item label="使用申请单编号" :border="false" align="left">
            <view>{{ baseInfo.code }}</view>
          </uni-form-item>
          <uni-form-item label="" style="margin: 0 0 -15px 0; padding-bottom: 0;">
            <view v-if="baseInfo.status >= 0">
              <span class="circle" :style="{ backgroundColor: purchaseStatus[baseInfo.status].color }"></span
              >{{ purchaseStatus[baseInfo.status].label }}
            </view>
          </uni-form-item>
          <uni-form-item label="使用申请单名称" :border="false" align="left">
            <view>{{ baseInfo.applyName }}</view>
          </uni-form-item>
          <uni-form-item label="申请部门" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.applyDepartmentName }}</view>
          </uni-form-item>
          <uni-form-item label="申请原因" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.applyReason }}</view>
          </uni-form-item>
          <uni-form-item label="关联进度" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.schduleName }}</view>
          </uni-form-item>
          <uni-form-item label="指定审核人" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.firstAuditPersonName }}</view>
          </uni-form-item>
          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.remark }}</view>
          </uni-form-item>
          <uni-form-item v-if="baseInfo.purchasePersonName" label="通知采购人" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.purchasePersonName }}</view>
          </uni-form-item>
        </uni-card>

        <view class="card-title-outer">
          <view class="title">采购明细</view>
        </view>
        <uni-card>
          <block v-for="(item, index) in baseInfo.details || []" :key="index">
            <view v-if="index > 0" class="line"></view>
            <uni-form-item label="序号" :border="false" align="left">
              <view class="placeholder">{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
            </uni-form-item>
            <uni-form-item label="材料编码" :border="false" align="left">
              <view class="placeholder">{{ item.materialCode || item.materialEntity.code }}</view>
            </uni-form-item>
            <uni-form-item label="材料名称" :border="false" align="left">
              <view class="placeholder">{{ item.materialName || item.materialEntity.name }}</view>
            </uni-form-item>
            <uni-form-item label="规格型号" :border="false" align="left">
              <view class="placeholder">{{ item.materialModels || item.materialEntity.models }}</view>
            </uni-form-item>
            <uni-form-item label="单位" :border="false" align="left">
              <view class="placeholder">{{ item.materialUnit || item.materialEntity.unit }}</view>
            </uni-form-item>
            <uni-form-item label="品牌" :border="false" align="left">
              <view class="placeholder">{{ item.materialBrand || item.materialEntity.brand }}</view>
            </uni-form-item>
            <uni-form-item label="供应商" :border="false" align="left">
              <view class="placeholder">{{ item.materialSupplier || item.materialEntity.supplier }}</view>
            </uni-form-item>
            <uni-form-item label="库存量" :border="false" align="left">
              <view class="placeholder">{{
                item.materialInventoryNumber || item.materialEntity.inventoryNumber || 0
              }}</view>
            </uni-form-item>
            <!--            <uni-form-item label="预算量" :border="false" align="left">-->
            <!--              <view class="placeholder">{{ item.budgetNumber }}</view>-->
            <!--            </uni-form-item>-->
            <uni-form-item label="材料使用数量" :border="false" align="left">
              <view class="placeholder">{{ item.number }}</view>
            </uni-form-item>
          </block>
        </uni-card>

        <block v-if="baseInfo.status > 1">
          <uni-card title="审核结果">
            <!--            <view v-for="item in baseInfo.auditRecordList" :key="item.auditTime">-->
            <uni-form-item label="审核结果" :border="false">
              <view>{{ $getLabel(purchaseStatus, baseInfo.status) }}</view>
              <!--              <view v-if="baseInfo.status">{{ // baseInfo.status===2?:"" }}</view>-->
            </uni-form-item>
            <!--            <uni-form-item label="备注" :border="false">-->
            <!--              <view>{{ baseInfo.taskRemark }}</view>-->
            <!--            </uni-form-item>-->
            <!--            <uni-form-item label="附件" :border="false">-->
            <!--              <uni-attachment v-model="baseInfo.reviewFileId"></uni-attachment>-->
            <!--            </uni-form-item>-->
            <uni-form-item label="审核人" :border="false">{{ baseInfo.firstAuditPersonName }}</uni-form-item>
            <uni-form-item label="审核意见" :border="false">
              <view>{{ baseInfo.auditOpinion }}</view>
            </uni-form-item>
            <uni-form-item label="审核日期" :border="false" style="border-bottom: 1px solid #f5f5f5;">
              <view>{{ baseInfo.auditDate | ymd }}</view>
            </uni-form-item>
            <!--            </view>-->
          </uni-card>
        </block>
        <!-- 审批记录 start -->
        <uni-check-detail :id="id"></uni-check-detail>
        <!-- 审批记录 end -->
        <!-- 通用审批 start -->
        <uni-check-card :id="id" ref="checkCard" />
        <!-- 通用审批 end -->
        <!--        <block v-if="baseInfo.status === 1 && baseInfo.firstAuditPersonId === $store.state.user.userId">-->
        <!--          <uni-form-custom ref="form" :model="form" :rules="rules">-->
        <!--            <uni-card isForm style="margin-top: 10px;">-->
        <!--              <uni-form-item label="审核日期" isLink isRequired prop="auditTime">-->
        <!--                <uni-date-picker v-model="form.auditTime" fields="day" mode="date"></uni-date-picker>-->
        <!--              </uni-form-item>-->
        <!--              &lt;!&ndash;              <uni-form-item label="审核人">&ndash;&gt;-->
        <!--              &lt;!&ndash;                <view>{{ baseInfo.currentAuditPerson }}</view>&ndash;&gt;-->
        <!--              &lt;!&ndash;                &lt;!&ndash;                {{ $store.state.user.userName }}&ndash;&gt;&ndash;&gt;-->
        <!--              &lt;!&ndash;                &lt;!&ndash;                <uni-select-user v-model="form.auditPersonId" :name.sync="form.auditPerson" placeholder="请选择" />&ndash;&gt;&ndash;&gt;-->
        <!--              &lt;!&ndash;              </uni-form-item>&ndash;&gt;-->

        <!--              <uni-form-item label="审核意见" prop="issueDescription">-->
        <!--                <textarea v-model.trim="form.auditOpinion" :maxlength="-1" auto-height placeholder="点击输入" />-->
        <!--              </uni-form-item>-->
        <!--              <uni-form-item label="审核结果" isLink isRequired prop="status">-->
        <!--                &lt;!&ndash;              <uni-select v-model="form.status" :option="IsCheck"></uni-select>&ndash;&gt;-->
        <!--                <view name="IsCheckText" @click="handleResultItemClick">{{ IsCheckText || '点击选择' }}</view>-->
        <!--              </uni-form-item>-->
        <!--              <view v-if="form.status === 2">-->
        <!--                <uni-form-item label="是否继续审核" isLink prop="isContinueAudit">-->
        <!--                  &lt;!&ndash;              <uni-select v-model="form.inspect" :option=" IsContinue"></uni-select>&ndash;&gt;-->
        <!--                  <view name="IsContinueText" @click="handleIsCheckItemClick">{{ IsContinueText || '点击选择' }}</view>-->
        <!--                </uni-form-item>-->
        <!--                <uni-form-item v-if="IsContinueValue === 1" label="下一审核人" isLink isRequired prop="nextPersonName">-->
        <!--                  <uni-select-user v-model="form.nextPersonId" :name.sync="form.nextPersonName" placeholder="请选择" />-->
        <!--                </uni-form-item>-->
        <!--              </view>-->
        <!--            </uni-card>-->
        <!--            &lt;!&ndash; 备注和附件信息开始 &ndash;&gt;-->
        <!--            &lt;!&ndash;          <uni-card isForm>&ndash;&gt;-->
        <!--            &lt;!&ndash;            <uni-form-item label="备注" align="left" type="textarea" class="block-item" prop="remark">&ndash;&gt;-->
        <!--            &lt;!&ndash;              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />&ndash;&gt;-->
        <!--            &lt;!&ndash;            </uni-form-item>&ndash;&gt;-->
        <!--            &lt;!&ndash;            <uni-form-item class="file-item" label="附件" prop="file">&ndash;&gt;-->
        <!--            &lt;!&ndash;              <uni-attachment v-model="form.file" edit></uni-attachment>&ndash;&gt;-->
        <!--            &lt;!&ndash;            </uni-form-item>&ndash;&gt;-->
        <!--            &lt;!&ndash;          </uni-card>&ndash;&gt;-->
        <!--            &lt;!&ndash; 备注和附件信息结束 &ndash;&gt;-->
        <!--          </uni-form-custom>-->
        <!--          <view class="btn-wrapper">-->
        <!--            <button class="button" type="primary" @click="handleCheck">-->
        <!--              审核-->
        <!--            </button>-->
        <!--          </view>-->
        <!--        </block>-->
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { Api } from '@/api/material/purchaseOrder'
import purchaseStatus from './lib/purchaseStatus'
// import purchaseType from '@/pages/material/purchaseOrder/lib/purchaseType'
import _ from 'lodash'
import moment from 'moment'

export default {
  data() {
    return {
      id: '',
      isDraft: true, //是否草稿
      baseInfo: {},
      purchaseStatus,
      // purchaseType,
      showBarOperate: false,
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
        { name: '否', value: 0 }
      ],
      form: {
        nextPersonName: '',
        status: '',
        auditOpinion: '',
        isContinueAudit: '',
        auditTime: moment().format('YYYY-MM-DD')
      },
      personRules: {
        nextPersonName: {
          required: true
        }
      },
      rules: {
        auditTime: { required: true },
        status: { required: true },
        isContinueAudit: { required: true },
        nextPersonName: { required: true }
      },
      subRules: {
        arrivalNumber: {
          required: true
        },
        enableInputNumber: {
          required: true
        }
      },
      //检查结果是否合格
      IsCheckText: '',
      //检查结果是否继续
      IsContinueText: '',
      IsContinueValue: ''
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
      // 通过请求获取材料详情
      Api.getMaterialApplyDetail(this.id).then(res => {
        this.baseInfo = res.data || {}

        //计算采购金额
        let totalPrice = 0
        const base = 1000 //用来避免小数计算产生异常
        if (this.baseInfo) {
          _.forEach(this.baseInfo.detailList, item => {
            if (item.univalence && item.number) {
              totalPrice += item.univalence * base * (item.number * base)
            }
          })
          this.totalPrice = totalPrice / base / base
        }
      })
    },

    // 审核中 进行审核
    async handleCheck() {
      let obj = {
        // status: 1,
        id: this.baseInfo.id
      }
      if (this.form.nextPersonName) {
        this.form.status = 1
      }
      await this.$refs.form.validate()
      await this.fly.material.post(`materialApply/audit`, { ...this.form, ...obj }).then(res => {
        this.$utils.showToast('审核完成')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1000)
      })
    },
    // 已通过 进行采购
    async handlePurchase() {
      let obj = {
        purchaseId: this.baseInfo.id,
        nextPersonId: this.form.nextPersonId,
        nextPersonName: this.form.nextPersonName
      }
      await this.$refs.formPerson.validate()
      await this.fly.material.post(`materialPurchase/purchase`, obj).then(res => {
        this.$utils.showToast('采购成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1000)
      })
    },
    //选择检查结果
    handleResultItemClick() {
      let vm = this
      let itemList = (this.IsCheck || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function (res) {
          let selectItem = vm.IsCheck[res.tapIndex] || {}
          vm.IsCheckText = selectItem.name
          vm.form.status = selectItem.value
        },
        fail: function (res) {
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
        success: function (res) {
          let selectItem = vm.IsContinue[res.tapIndex] || {}
          vm.IsContinueText = selectItem.name
          vm.IsContinueValue = selectItem.value
          vm.form.isContinueAudit = selectItem.value
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    },
    //采购中 到货确认
    async handleReceiveGoods() {
      let list = this.baseInfo.detailList.map(item => {
        return {
          arrivalNumber: item.arrivalNumber,
          enableInputNumber: item.enableInputNumber,
          materialId: item.materialId,
          purchaseId: this.baseInfo.id,
          remark: item.remark,
          univalence: item.univalence
        }
      })
      let obj = {
        auditOpinion: '',
        // status: 1,
        purchaseId: this.baseInfo.id,
        detialAddList: list,
        nextPersonId: this.form.nextPersonId,
        nextPersonName: this.form.nextPersonName
      }
      await this.$refs.formPerson.validate()
      Promise.all(
        this.baseInfo.detailList.map(item => {
          return this.$refs[item.id][0].validate()
        })
      ).then(res => {
        this.fly.material.post(`materialPurchase/arrivalConfirm`, obj).then(res => {
          this.$utils.showToast('确认收货')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        })
      })
    },
    //待入库 进行入库操作
    async handleStorage() {
      // await this.$refs.formPerson.validate()
      let purchaseId = this.baseInfo.id
      this.fly.material.post(`materialPurchase/executeInput/${purchaseId}`).then(res => {
        this.$utils.showToast('入库成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1000)
      })
    },
    //验收
    async handleCheckAccept() {
      // await this.$refs.formPerson.validate()
      let purchaseId = this.baseInfo.id
      this.fly.material
        .post(`materialPurchase/accept`, {
          ...this.form,
          purchaseId: purchaseId
        })
        .then(res => {
          this.$utils.showToast('验收成功')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        })
    },
    //草稿状态下 进行删除
    handleDelete() {
      Api.getMaterialApplyDelete(this.id).then(res => {
        if (res.code === 200) {
          this.$utils.showToast('删除成功')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        }
      })
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
            this.$utils.toUrl(`/pages/material/purchaseOrder/add?id=${this.id}`)
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
