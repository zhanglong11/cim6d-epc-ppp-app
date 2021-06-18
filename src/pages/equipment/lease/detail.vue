<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!--已通过 显示 start-->
        <block v-if="baseInfo.status === 2">
          <!--          <uni-form-custom ref="formPerson" :model="form" :rules="personRules">-->
          <!--            <uni-card isForm>-->
          <!--              <uni-form-item label="指定到货确认人" isLink isRequired prop="nextPerson">-->
          <!--                <uni-select-user v-model="form.nextPersonId" :name.sync="form.nextPerson" placeholder="请选择" />-->
          <!--              </uni-form-item>-->
          <!--            </uni-card>-->
          <!--          </uni-form-custom>-->
          <view class="btn-wrapper">
            <button class="button" type="primary" style="border-radius: 3px" @click="handlePurchase">
              租赁
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

        <!--        <view v-if="baseInfo.status !== 1 && baseInfo.status !== 0" class="card-title-info">-->
        <!--          <view class="title">审核信息</view>-->
        <!--        </view>-->
        <uni-card>
          <uni-form-item label="租赁单编号" :border="false" align="left">
            <view>{{ baseInfo.code }}</view>
          </uni-form-item>
          <uni-form-item label="" style="margin:0 0 -15px 0;padding-bottom: 0;">
            <view v-if="baseInfo.status >= 0">
              <span class="circle" :style="{ backgroundColor: purchaseStatus[baseInfo.status].color }"></span
              >{{ purchaseStatus[baseInfo.status].label }}
            </view>
          </uni-form-item>

          <uni-form-item label="申请部门" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.applyDepartmentName }}</view>
          </uni-form-item>
          <uni-form-item label="申请原因" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.applyReason }}</view>
          </uni-form-item>
          <uni-form-item label="设备使用单位" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.useCompanyName }}</view>
          </uni-form-item>
          <uni-form-item label="租赁单位" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.leaseCompany }}</view>
          </uni-form-item>
          <uni-form-item label="租赁人" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.leaseUserName }}</view>
          </uni-form-item>
          <uni-form-item label="租赁联系方式" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.leaseUserPhone }}</view>
          </uni-form-item>
          <uni-form-item label="租赁开始时间" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.leaseStartTime | formatData }}</view>
          </uni-form-item>
          <uni-form-item label="租赁结束时间" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.leaseEndTime | formatData }}</view>
          </uni-form-item>
          <uni-form-item label="租赁总期限（天）" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.leasePeriod }}</view>
          </uni-form-item>
        </uni-card>
        <!--采购中 显示 start-->
        <!--        <block v-if="baseInfo.status === 4">-->
        <!--          <uni-card isForm>-->
        <!--            <uni-form-item label="指定到货确认人" isLink isRequired prop="consigneeId">-->
        <!--              <uni-select-user v-model="form.consigneeId" :name.sync="form.consigneeName" placeholder="请选择" />-->
        <!--            </uni-form-item>-->
        <!--          </uni-card>-->
        <!--        </block>-->
        <!--采购中 显示 end-->
        <view class="card-title-outer">
          <view class="title">租赁明细</view>
        </view>
        <uni-card>
          <block v-for="(item, index) in baseInfo.details || []" :key="index">
            <view v-if="index > 0" class="line"></view>
            <uni-form-item label="序号" :border="false" align="left">
              <view class="placeholder">{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
            </uni-form-item>
            <uni-form-item label="设备名称" :border="false" align="left">
              <view class="placeholder">{{ item.name }}</view>
            </uni-form-item>
            <uni-form-item label="规格型号" :border="false" align="left">
              <view class="placeholder">{{ item.models }}</view>
            </uni-form-item>
            <uni-form-item label="单位" :border="false" align="left">
              <view class="placeholder">{{ item.unit }}</view>
            </uni-form-item>
            <uni-form-item label="设备类别" :border="false" align="left">
              <view>{{
                ['特种设备', '监测设备', '起重机械', '基础设备', '办公设备', '其他'][Number(item.type) + 1]
              }}</view>
            </uni-form-item>
            <uni-form-item label="生产厂家" :border="false" align="left">
              <view class="placeholder">{{ item.manufacturer }}</view>
            </uni-form-item>
            <uni-form-item label="供应商" :border="false" align="left">
              <view class="placeholder">{{ item.supplier }}</view>
            </uni-form-item>
            <uni-form-item label="租赁押金" :border="false" align="left">
              <view class="placeholder">{{ item.rentDeposit }}</view>
            </uni-form-item>
            <uni-form-item label="租赁期限" :border="false" align="left">
              <view class="placeholder">{{ item.rentTime }}</view>
            </uni-form-item>
            <uni-form-item label="租赁租金" :border="false" align="left">
              <view class="placeholder">{{ item.rentReprises }}</view>
            </uni-form-item>
            <block v-if="baseInfo.status >= 5">
              <uni-form-item label="到货数量" :border="false" align="left">
                <view class="placeholder">{{ item.arrivalNumber }}</view>
              </uni-form-item>
              <uni-form-item label="可入库量" :border="false" align="left">
                <view class="placeholder">{{ item.enableInputNumber }}</view>
              </uni-form-item>
              <!--              <uni-form-item label="备注" :border="false" align="left">-->
              <!--                <view class="placeholder">{{ item.remark }}</view>-->
              <!--              </uni-form-item>-->
            </block>
            <block v-if="baseInfo.status >= 6">
              <uni-form-item label="检定验收结果" :border="false" align="left">
                <view class="placeholder">{{ item.acceptResult }}</view>
              </uni-form-item>
              <uni-form-item label="检定验收单位" :border="false" align="left">
                <view class="placeholder">{{ item.acceptUnit }}</view>
              </uni-form-item>
              <uni-form-item label="检定验收内容" :border="false" align="left">
                <view class="placeholder">{{ item.acceptContent }}</view>
              </uni-form-item>
              <uni-form-item label="检定验收时间" :border="false" align="left">
                <view class="placeholder">{{ item.acceptTime }}</view>
              </uni-form-item>
              <uni-form-item label="备注" :border="false" align="left">
                <view class="placeholder">{{ item.remark }}</view>
              </uni-form-item>
            </block>
            <!--租赁中 显示 start-->
            <block v-if="baseInfo.status === 4">
              <uni-form-custom :ref="item.id" :model="item" :rules="subRules" class="border-top">
                <uni-card isForm style="border: 0;border-radius: 0;width: 345px;">
                  <uni-form-item label="到货数量" isRequired prop="arrivalNumber">
                    <input v-model.number="item.arrivalNumber" class="uni-input" placeholder="点击输入" />
                  </uni-form-item>
                  <uni-form-item label="可入库量" isRequired prop="enableInputNumber">
                    <input v-model.number="item.enableInputNumber" class="uni-input" placeholder="点击输入" />
                  </uni-form-item>
                  <!--                  <uni-form-item label="备注" align="right">-->
                  <!--                    <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入" auto-height />-->
                  <!--                  </uni-form-item>-->
                </uni-card>
              </uni-form-custom>
            </block>
            <!--租赁中 显示 end-->
            <!--鉴定验收中 start-->
            <block v-if="baseInfo.status === 5">
              <uni-form-custom :ref="item.id" :model="item" :rules="subRules" class="border-top">
                <uni-card isForm style="border: 0;border-radius: 0;width: 345px;">
                  <uni-form-item label="检定验收结果" isRequired prop="acceptResult">
                    <uni-select v-model="item.acceptResult" :option="IsCheck"></uni-select>
                  </uni-form-item>
                  <!--                  <uni-form-item label="检定验收单位*" isRequired prop="enableInputNumber">-->
                  <!--                    <input v-model.number="item.enableInputNumber" class="uni-input" placeholder="点击输入" />-->
                  <!--                  </uni-form-item>-->
                  <uni-form-item label="检定验收单位" prop="acceptUnit" isRequired isLink>
                    <uni-department-select
                      v-model="item.acceptUnitId"
                      :name.sync="item.acceptUnit"
                    ></uni-department-select>
                  </uni-form-item>
                  <uni-form-item label="检定验收内容" align="right" prop="acceptContent">
                    <textarea v-model.trim="item.acceptContent" :maxlength="-1" placeholder="请输入" auto-height />
                  </uni-form-item>
                  <uni-form-item label="检定验收时间" prop="acceptTime" isRequired isLink>
                    <uni-date-picker v-model="item.acceptTime" fields="second" mode="date"> </uni-date-picker>
                  </uni-form-item>
                  <uni-form-item label="备注" align="right">
                    <textarea v-model.trim="item.remark" :maxlength="-1" placeholder="请输入" auto-height />
                  </uni-form-item>
                </uni-card>
              </uni-form-custom>
            </block>
            <!--鉴定验收中 end-->
          </block>
        </uni-card>
        <!-- 备注信息 start -->
        <view class="btn-wrapper">
          <!--鉴定验收中 start-->
          <button v-if="baseInfo.status === 4" class="button" type="primary" @click="handleReceiveGoods">
            到货确认
          </button>
          <button v-if="baseInfo.status === 5" class="button" type="primary" @click="handleCheckGoods">
            到货确认
          </button>
          <!--鉴定验收中  end-->
        </view>
        <uni-card>
          <uni-form-item label="租赁总押金(￥)" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.totalDeposit }}</view>
          </uni-form-item>
          <uni-form-item label="租赁总租金(￥)" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.totalRent }}</view>
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

        <block v-if="baseInfo.status >= 2">
          <uni-card title="审核结果">
            <uni-form-item label="审核结果" :border="false">
              <view>{{ ['通过', '驳回'][baseInfo.reviewerStatus - 2] }}</view>
              <!--              <view v-if="baseInfo.status">{{ // baseInfo.status===2?:"" }}</view>-->
            </uni-form-item>
            <!--            <uni-form-item label="备注" :border="false">-->
            <!--              <view>{{ baseInfo.taskRemark }}</view>-->
            <!--            </uni-form-item>-->
            <!--            <uni-form-item label="附件" :border="false">-->
            <!--              <uni-attachment v-model="baseInfo.reviewFileId"></uni-attachment>-->
            <!--            </uni-form-item>-->
            <uni-form-item label="审核人" :border="false">{{ baseInfo.reviewerName }}</uni-form-item>
            <uni-form-item label="审核意见">
              <view>{{ baseInfo.optionContent }}</view>
            </uni-form-item>
            <uni-form-item label="审核日期" :border="false">
              <view>{{ baseInfo.reviewerDate | ymd }}</view>
            </uni-form-item>
          </uni-card>
        </block>
        <block v-if="baseInfo.status === 1">
          <uni-form-custom ref="formResult" class="main-body" :model="form" :rules="rules">
            <uni-card isForm>
              <uni-form-item label="审核日期" isLink isRequired prop="reviewerDate">
                <uni-date-picker v-model="form.reviewerDate" fields="day" mode="date"></uni-date-picker>
              </uni-form-item>
              <uni-form-item label="审核人">
                {{ $store.state.user.userName }}
              </uni-form-item>
              <uni-form-item label="审核意见">
                <textarea v-model.trim="form.optionContent" :maxlength="-1" auto-height placeholder="点击输入" />
              </uni-form-item>
              <uni-form-item label="审核结果" isLink isRequired prop="status">
                <!--              <uni-select v-model="form.reviewerStatus" :option="IsCheck"></uni-select>-->
                <view name="IsCheckText" @click="handleResultItemClick">{{ IsCheckText || '点击选择' }}</view>
              </uni-form-item>
              <!--            <uni-form-item label="是否继续审核" isLink prop="inspect">-->
              <!--              &lt;!&ndash;              <uni-select v-model="form.inspect" :option=" IsContinue"></uni-select>&ndash;&gt;-->
              <!--              <view name="IsContinueText" @click="handleIsCheckItemClick">{{ IsContinueText || '点击选择' }}</view>-->
              <!--            </uni-form-item>-->
              <!--            <uni-form-item label="下一审核人/采购人" isLink prop="nextPersonId">-->
              <!--              <uni-select-user v-model="form.nextPersonId" :name.sync="form.nextPerson" placeholder="请选择" />-->
              <!--            </uni-form-item>-->
            </uni-card>
            <!-- 备注和附件信息开始 -->

            <uni-card isForm>
              <uni-form-item label="备注" align="left" type="textarea" class="block-item" prop="remark">
                <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
              </uni-form-item>
              <uni-form-item class="file-item" label="附件" prop="file">
                <uni-attachment v-model="form.file" edit></uni-attachment>
              </uni-form-item>
            </uni-card>
            <view class="btn-wrapper">
              <button class="button" type="primary" @click="handleCheck">
                保存
              </button>
            </view>
          </uni-form-custom>
          <!-- 备注和附件信息结束 -->
        </block>
        <!--到货确认人 start-->
        <uni-card v-if="baseInfo.status >= 5">
          <uni-form-item label="到货确认人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.arrivalPersonName }}</view>
          </uni-form-item>

          <uni-form-item label="到货确认时间" :border="false" align="left">
            <view class="placeholder">{{ (baseInfo.arrivalDate || '') | formatData }}</view>
          </uni-form-item>
        </uni-card>
        <!--到货确认人 end-->
        <!--鉴定验收人 start-->
        <uni-card v-if="baseInfo.status >= 6">
          <uni-form-item label="鉴定验收人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.acceptName }}</view>
          </uni-form-item>

          <uni-form-item label="鉴定验收时间" :border="false" align="left">
            <view class="placeholder">{{ (baseInfo.acceptDate || '') | formatData }}</view>
          </uni-form-item>
        </uni-card>
        <!--鉴定验收人 end-->
        <!--入库人 start-->
        <uni-card v-if="baseInfo.status >= 7">
          <uni-form-item label="入库人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.inventoryPersonName }}</view>
          </uni-form-item>
          <uni-form-item label="入库时间" :border="false" align="left">
            <view class="placeholder">{{ (baseInfo.inventoryDate || '') | formatData }}</view>
          </uni-form-item>
        </uni-card>
        <!--入库人 end-->
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { Api } from '@/api/material/equipment/lease'
import purchaseStatus from './lib/purchaseStatus'
import _ from 'lodash'

export default {
  data() {
    return {
      id: '',
      isDraft: true, //是否草稿

      baseInfo: {},
      purchaseStatus,
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
        { name: '否', value: 2 }
      ],
      IsContinueValue: '',
      form: {
        status: '',
        optionContent: '',
        reviewerName: ''
      },
      // personRules: {
      //   nextPerson: {
      //     required: true
      //   }
      // },
      subRules: {
        arrivalNumber: {
          required: true
        },
        enableInputNumber: {
          required: true
        },
        acceptResult: {
          required: true
        },
        acceptContent: {
          required: true
        },
        acceptTime: {
          required: true
        },
        acceptUnit: {
          required: true
        }
      },
      rules: {
        status: { required: true }
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
      // 通过请求获取材料详情
      Api.getLeaseDetail(this.id).then(res => {
        this.baseInfo = res.data || {}

        //计算采购金额
        let totalPrice = 0
        const base = 1000 //用来避免小数计算产生异常
        if (this.baseInfo) {
          _.forEach(this.baseInfo.details, item => {
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
      await this.$refs.formResult.validate()
      this.form.reviewerName = this.$store.state.user.userName
      console.log(this.form)

      await this.fly.material.post(`equipmentPurchase/updateLease`, { ...this.form, id: this.baseInfo.id })
      // this.form.reviewerStatus === 1
      //   ? await this.fly.material.get(`equipmentLease/throughLease/${this.baseInfo.id}`)
      //   : await this.fly.material.get(`equipmentLease/turnDownLease/${this.baseInfo.id}`)
      this.$utils.showToast('审核完成')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    },
    // 已通过 租赁
    async handlePurchase() {
      // await this.$refs.formPerson.validate()
      this.fly.material.get(`equipmentLease/makeLease/${this.baseInfo.id}`).then(res => {
        this.$utils.showToast('租赁成功')
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
          vm.IsContinueValue = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //采购中 到货确认
    handleReceiveGoods() {
      let list = this.baseInfo.details.map(item => {
        return {
          arrivalNumber: item.arrivalNumber,
          enableInputNumber: item.enableInputNumber,
          id: item.id,
          remark: item.remark
        }
      })
      let obj = {
        id: this.baseInfo.id,
        leaseDetails: list
      }
      Promise.all(
        this.baseInfo.details.map(item => {
          return this.$refs[item.id][0].validate()
        })
      ).then(res => {
        this.fly.material.post(`equipmentLease/arrivalConfirmation`, obj).then(res => {
          this.$utils.showToast('确认收货')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        })
      })
    },
    //鉴定验收中
    handleCheckGoods() {
      console.log(this.baseInfo.details)
      let list = this.baseInfo.details.map(item => {
        return {
          acceptContent: item.acceptContent,
          acceptTime: item.acceptTime,
          acceptResult: item.acceptResult,
          acceptUnit: item.acceptUnit,
          accepter: item.accepter,
          id: item.id,
          remark: item.remark
        }
      })

      let obj = {
        id: this.baseInfo.id,
        leaseDetails: list
      }
      Promise.all(
        this.baseInfo.details.map(item => {
          return this.$refs[item.id][0].validate()
        })
      ).then(res => {
        this.fly.material.post(`equipmentLease/verificationAcceptance`, obj).then(res => {
          this.$utils.showToast('确认收货')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        })
      })
    },
    //待入库 进行入库操作
    handleStorage() {
      let purchaseId = this.baseInfo.id
      this.fly.material.get(`equipmentLease/addInventory/${purchaseId}`).then(res => {
        this.$utils.showToast('入库成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1000)
      })
    },
    //草稿状态下 进行删除
    handleDelete() {
      Api.getLeaseDelete(this.id).then(res => {
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
            this.$utils.toUrl(`/pages/equipment/lease/add?id=${this.id}`)
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
