<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="租赁单编号" prop="receiptNo">
              <textarea v-model.trim="form.code" auto-height disabled placeholder="自动生成" />
            </uni-form-item>
            <uni-form-item label="申请部门" prop="applyDepartmentName" isRequired isLink>
              <uni-department-select
                v-model="form.applyDepartmentId"
                :name.sync="form.applyDepartmentName"
              ></uni-department-select>
            </uni-form-item>
            <uni-form-item label="申请原因" prop="applyReason" isRequired>
              <textarea v-model.trim="form.applyReason" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="设备使用位置" prop="usePart" isRequired>
              <textarea v-model.trim="form.usePart" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="设备使用人" isLink isRequired prop="userName">
              <uni-select-user v-model="form.userId" :name.sync="form.userName" placeholder="请选择" />
            </uni-form-item>
            <uni-form-item label="设备使用单位" prop="useCompanyName" isRequired isLink>
              <uni-department-select v-model="form.useCompany" :name.sync="form.useCompanyName"></uni-department-select>
            </uni-form-item>
            <uni-form-item label="租赁单位" prop="leaseCompany" isRequired>
              <textarea v-model.trim="form.leaseCompany" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="租赁人" prop="leaseUserName" isRequired>
              <!--              <uni-select-user v-model="form.userId" :name.sync="form.leaseUserName" placeholder="请选择" />-->
              <textarea v-model.trim="form.leaseUserName" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="租赁人联系方式" prop="leaseUserPhone" isRequired>
              <textarea v-model.trim="form.leaseUserPhone" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="租赁开始时间" prop="leaseStartTime" isRequired isLink>
              <uni-date-picker
                v-model="form.leaseStartTime"
                fields="second"
                mode="date"
                @input="bindStartDateChange"
              ></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="租赁结束时间" prop="leaseEndTime" isRequired isLink>
              <uni-date-picker
                v-model="form.leaseEndTime"
                fields="second"
                mode="date"
                @input="bindEndDateChange"
              ></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="租赁总期限(几天几小时)" prop="leasePeriod" isRequired>
              <view>{{ form.leasePeriod || null }}</view>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <view class="card-title-outer">
          <view class="title">
            <view>租赁明细</view>
            <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleOpenDrawer"></uni-icons>
          </view>
        </view>
        <block v-if="list.length">
          <block v-for="(item, index) in list" :key="index">
            <uni-form-custom :ref="index" :model="item" :rules="subRules" class="border-top">
              <uni-card v-if="!item.id">
                <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />
                <uni-form-item label="序号">
                  <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                </uni-form-item>
                <uni-form-item label="设备名称">
                  <input v-model="item.name" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="规格型号">
                  <input v-model="item.models" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="单位">
                  <input v-model="item.unit" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="设备类别">
                  <uni-select v-model="item.type" :options="equitmentType"></uni-select>
                </uni-form-item>
                <uni-form-item label="生产厂家">
                  <input v-model="item.manufacturer" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="供应商">
                  <input v-model="item.supplier" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="租赁数量">
                  <input v-model="item.number" class="uni-input" placeholder="请输入" />
                </uni-form-item>

                <uni-form-item label="租赁押金" isRequired prop="rentDeposit">
                  <input
                    v-model.number="item.rentDeposit"
                    class="uni-input"
                    placeholder="点击输入"
                    @change="handleDepositPrice(item)"
                  />
                </uni-form-item>
                <uni-form-item label="租赁期限" isRequired prop="rentTime">
                  <input v-model="item.rentTime" class="uni-input" placeholder="点击输入（几天几小时）" />
                </uni-form-item>
                <uni-form-item label="租赁租金">
                  <!--                  <view>{{ item.combinedPrice || null }}</view>-->
                  <input
                    v-model.number="item.rentReprises"
                    class="uni-input"
                    placeholder="点击输入"
                    @change="handleRentPrice(item)"
                  />
                </uni-form-item>
              </uni-card>
              <uni-card v-if="item.id">
                <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />

                <uni-form-item label="序号">
                  <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                </uni-form-item>
                <uni-form-item label="设备名称">
                  <view>{{ item.name }}</view>
                </uni-form-item>
                <!--              <uni-form-item label="设备类型">-->
                <!--                <view>{{ item.name }}</view>-->
                <!--              </uni-form-item>-->
                <uni-form-item label="规格型号">
                  <view>{{ item.models }}</view>
                </uni-form-item>
                <uni-form-item label="单位">
                  <view>{{ item.unit }}</view>
                </uni-form-item>
                <uni-form-item label="设备类别">
                  <!--                <view>{{ item.brand }}</view>-->
                  <view>{{
                    ['特种设备', '监测设备', '起重机械', '基础设备', '办公设备', '其他'][Number(item.type) + 1]
                  }}</view>
                </uni-form-item>
                <uni-form-item label="生产厂家">
                  <view>{{ item.manufacturer }}</view>
                </uni-form-item>
                <uni-form-item label="供应商">
                  <view>{{ item.supplier }}</view>
                </uni-form-item>
                <!--              <uni-form-custom :ref="item.id" :model="item" :rules="subRules" class="border-top">-->
                <uni-form-item label="租赁数量" isRequired>
                  <input v-model="item.number" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="租赁押金(￥)" isRequired prop="rentDeposit">
                  <input
                    v-model.number="item.rentDeposit"
                    class="uni-input"
                    placeholder="点击输入"
                    @change="handleDepositPrice(item)"
                  />
                </uni-form-item>
                <uni-form-item label="租赁期限" isRequired prop="rentTime">
                  <input v-model="item.rentTime" class="uni-input" placeholder="点击输入（几天几小时）" />
                </uni-form-item>
                <uni-form-item label="租赁租金(￥)" prop="rentReprises">
                  <!--                  <view>{{ item.combinedPrice || null }}</view>-->
                  <input
                    v-model.number="item.rentReprises"
                    class="uni-input"
                    placeholder="点击输入"
                    @change="handleRentPrice(item)"
                  />
                </uni-form-item>
                <!--              </uni-form-custom>-->
              </uni-card>
            </uni-form-custom>
          </block>

          <!-- 备注信息开始 -->
          <uni-card isForm>
            <uni-form-item label="租赁总押金">
              <view>{{ form.totalDeposit }}</view>
            </uni-form-item>
            <uni-form-item label="租赁总租金">
              <view>{{ form.totalRent }}</view>
            </uni-form-item>
            <uni-form-item label="申请人">
              <view>{{ $store.state.user.userName }}</view>
            </uni-form-item>
            <!--            <uni-form-item label="申请时间" prop="endTime" isRequired isLink>-->
            <!--              <uni-date-picker-->
            <!--                v-model="form.applyTime"-->
            <!--                fields="second"-->
            <!--                mode="date"-->
            <!--                @input="bindEndDateChange"-->
            <!--              ></uni-date-picker>-->
            <!--            </uni-form-item>-->
            <uni-form-item label="备注" prop="receiptNo">
              <textarea v-model.trim="form.remark" :maxlength="-1" auto-height placeholder="请输入" />
            </uni-form-item>
          </uni-card>
          <!-- 备注信息结束 -->
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit(2)">提 交</button>
          </view>
        </block>
      </view>
    </scroll-view>
    <uni-drawer ref="productList" :width="750" mode="right">
      <inventory-select :checked="checkedValue" @selected="handleInventorySelected"></inventory-select>
    </uni-drawer>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import InventorySelect from './inventory'
import moment from 'moment'
import { Api } from '@/api/material/equipment/lease'
export default {
  components: {
    InventorySelect
  },
  data() {
    return {
      //start时期
      startDate: '',
      endDate: '',
      id: '',
      form: {
        projectId: wx.getStorageSync('projectId'),
        applicantId: '',
        applicantName: '',
        applyDepartmentName: '',
        applyReason: '',
        // applyTime: '2020-06-29 00:00:00',
        leaseCompany: '',
        leaseEndTime: '',
        leasePeriod: '',
        leaseStartTime: '',
        leaseUserId: '',
        leaseUserName: '',
        leaseUserPhone: '',
        remark: '',
        status: '',
        totalDeposit: 0,
        totalRent: 0,
        useCompany: '',
        useCompanyName: '',
        usePart: '',
        userId: '',
        userName: '',
        code: ''
      },
      rules: {
        applyDepartmentName: { required: true },
        applyReason: { required: true },
        usePart: { required: true },
        userName: { required: true },
        useCompanyName: { required: true },
        leaseCompany: { required: true },
        leaseUserName: { required: true },
        leaseUserPhone: { required: true },
        leaseStartTime: { required: true },
        leaseEndTime: { required: true }
      },
      subRules: {
        number: {
          required: true
        },
        rentReprises: {
          required: true
        },
        rentTime: {
          required: true
        },
        rentDeposit: {
          required: true
        }
      },
      equitmentType: [
        { label: '特种设备', value: 1 },
        { label: '监测设备', value: 2 },
        { label: '起重机械', value: 3 },
        { label: '基础设备 ', value: 4 },
        { label: '办公设备', value: 5 },
        { label: '其他', value: 6 }
      ],
      //检查结果是否合格
      equitmentTypeText: '',
      list: [], //选中的材料
      checkedValue: [], //选中的 材料的id
      totalDeposit: '', //租赁押金
      totalRent: '' //租赁租金
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.form.applicantId = this.$store.state.user.userId
    this.form.applicantName = this.$store.state.user.userName
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑租赁单')
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'draft') {
      this.handleSubmit(1)
    }
  },
  methods: {
    getDetail() {
      Api.getLeaseDetail(this.id).then(res => {
        this.form = res.data || {}
        this.list = [...this.form.details]
        console.log(this.form)
      })
    },
    //租赁开始时间
    bindStartDateChange(e) {
      this.startDate = e
      this.form.leasePeriod = this.getAllDate(this.startDate, this.endDate)
    },
    //租赁结束时间
    bindEndDateChange(e) {
      this.endDate = e
      this.form.leasePeriod = this.getAllDate(this.startDate, this.endDate)
    },
    getAllDate(start, end) {
      // let startData = new Date(start).getTime()
      // let endData = new Date(end).getTime()
      // let diff = endData - startData

      if (end && start) {
        let diff = moment(end).unix() - moment(start).unix()
        // console.log(diff)
        // this.$utils.showToast(String(diff))
        //计算出相差天数
        let days = Math.floor(diff / (24 * 3600))
        // this.$utils.showToast(`diff${days}`)
        let returnStr
        //计算出小时数
        let leave1 = diff % (24 * 3600) //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / 3600)
        if (hours > 0) {
          returnStr = hours + '小时'
        } else {
          returnStr = ''
        }
        if (days > 0) {
          returnStr = days + '天' + returnStr
        }
        return returnStr
      }
    },

    //删除选中的采购产品
    handleDeleteItem(index) {
      this.list.splice(index, 1)
    },
    //选择设备类别
    handleResultItemClick() {
      let vm = this
      let itemList = (this.equitmentType || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.equitmentType[res.tapIndex] || {}
          vm.equitmentTypeText = selectItem.name
          vm.form.type = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },

    // 点击保存按钮
    async handleSubmit(type) {
      await this.$refs.form.validate()
      Promise.all(
        this.list.map((item, index) => {
          return this.$refs[index][0].validate()
        })
      ).then(res => {
        let data = _.cloneDeep(this.form)
        // console.log('list', this.list)
        data.details = this.list.map(item => {
          return {
            name: item.name,
            manufacturer: item.manufacturer,
            models: item.models,
            supplier: item.supplier,
            unit: item.unit,
            combinedPrice: item.combinedPrice,
            id: item.id,
            type: 1,
            rentDeposit: item.rentDeposit,
            rentReprises: item.rentReprises,
            rentTime: item.rentTime,
            number: item.number
          }
        })
        let num = this.id ? 2 : 1
        if (type === 1) {
          if (this.id) {
            Api.getLeaseAdd({ ...data, status: 0, projectId: this.projectId }).then(res => {
              this.$utils.showToast('已保存草稿')
              setTimeout(() => {
                this.$utils.goBack(num)
              }, 1000)
            })
          } else {
            Api.getLeaseSubmit({ ...data, status: 0, projectId: this.projectId }).then(res => {
              this.$utils.showToast('已保存草稿')
              setTimeout(() => {
                this.$utils.goBack(num)
              }, 1000)
            })
          }
        } else {
          if (this.id) {
            Api.getLeaseAdd({ ...data, status: 1, projectId: this.projectId }).then(res => {
              this.$utils.showToast('保存成功')
              setTimeout(() => {
                this.$utils.goBack(num)
              }, 1000)
            })
          } else {
            Api.getLeaseSubmit({ ...data, status: 1, projectId: this.projectId }).then(res => {
              this.$utils.showToast('保存成功')
              setTimeout(() => {
                this.$utils.goBack(num)
              }, 1000)
            })
          }
        }
      })
    },
    // 打开物料选择框
    handleOpenDrawer() {
      let that = this
      uni.showActionSheet({
        itemList: ['库存选择', '添加新设备'],
        success: function(res) {
          if (res.tapIndex === 0) {
            that.$refs.productList.open()
          } else if (res.tapIndex === 1) {
            let obj = {
              models: '',
              supplier: '',
              unit: '',
              combinedPrice: '',
              id: '',
              rentDeposit: '',
              univalence: '',
              type: '',
              rentTime: '',
              number: ''
            }
            that.list.push(obj)
          }
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
      // this.$refs.productList.open()
    },

    // 选中物料后数据回传处理
    handleInventorySelected(data) {
      // console.log('list', this.list)
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
    },
    // 计算总价
    // handleTotalPriceCal() {
    //   let totalPrice = 0
    //   const base = 1000 //用来避免小数计算产生异常
    //   if (this.list.length) {
    //     _.forEach(this.list, item => {
    //       if (item.univalence && item.number) {
    //         totalPrice += item.univalence * base * (item.number * base)
    //       }
    //     })
    //     this.totalPrice = totalPrice / base / base
    //   }
    // },
    //计算押金总价
    handleDepositPrice() {
      let totalPrice = 0
      const base = 1000 //用来避免小数计算产生异常
      if (this.list.length) {
        _.forEach(this.list, item => {
          totalPrice += item.rentDeposit * base
        })
        this.form.totalDeposit = Number(totalPrice / base)
      }
    },
    // 计算租金总价
    handleRentPrice(item) {
      let totalPrice = 0
      const base = 1000 //用来避免小数计算产生异常
      if (this.list.length) {
        _.forEach(this.list, item => {
          totalPrice += item.rentReprises * base
        })
        this.form.totalRent = Number(totalPrice / base)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
