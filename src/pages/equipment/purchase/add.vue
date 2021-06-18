<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="采购单编号" prop="code">
              <textarea v-model.trim="form.code" auto-height disabled placeholder="自动生成" />
            </uni-form-item>
            <uni-form-item label="申请部门" prop="applyDepartmentName" isRequired isLink>
              <uni-department-select
                v-model="form.applyDepartmentId"
                :name.sync="form.applyDepartmentName"
              ></uni-department-select>
            </uni-form-item>
            <uni-form-item label="申请到货时间" prop="appyArrivalTime" isRequired isLink>
              <!-- <picker mode="date" name="appyArrivalTime" :value="form.appyArrivalTime" @change="bindCheckDateChange">
                <view>{{ checkDate || '请选择时间' }}</view>
              </picker> -->
              <uni-date-picker v-model="form.appyArrivalTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="申请原因" isRequired prop="receiptNo">
              <textarea v-model.trim="form.applyReason" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="使用位置" isRequired prop="usePart">
              <textarea v-model.trim="form.usePart" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="设备使用人" isRequired isLink prop="userId">
              <uni-select-user v-model="form.userId" :name.sync="form.userName" placeholder="请选择" />
            </uni-form-item>

            <uni-form-item label="设备使用单位" isRequired isLink prop="useCompany">
              <uni-department-select v-model="form.useCompany" :name.sync="form.useCompanyName"></uni-department-select>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <view class="card-title-outer">
          <view class="title">
            <view>采购明细</view>
            <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleOpenDrawer"></uni-icons>
          </view>
        </view>
        <block v-if="list.length">
          <block v-for="(item, index) in list" :key="index">
            <uni-card v-if="!item.id">
              <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />
              <uni-form-item label="序号" isRequired>
                <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
              </uni-form-item>
              <uni-form-item label="设备名称" isRequired>
                <input v-model="item.name" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="设备类型" isRequired>
                <uni-select v-model="item.type" :options="equipmentType"></uni-select>
              </uni-form-item>
              <uni-form-item label="规格型号" isRequired>
                <input v-model="item.models" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="单位" isRequired>
                <input v-model="item.unit" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="品牌" isRequired>
                <input v-model="item.brand" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="生产厂家" isRequired>
                <input v-model="item.manufacturer" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="供应商" isRequired>
                <input v-model="item.supplier" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-custom :ref="item.id" :model="item" :rules="subRules" class="border-top">
                <uni-form-item label="申请采购数量" isRequired prop="number">
                  <input
                    v-model.number="item.number"
                    class="uni-input"
                    placeholder="请输入申请采购数量"
                    @change="handleCalcombinedPrice(item)"
                  />
                </uni-form-item>
                <uni-form-item label="单价(￥)" isRequired prop="univalence">
                  <input
                    v-model.number="item.univalence"
                    class="uni-input"
                    placeholder="请输入材料单价"
                    @change="handleCalcombinedPrice(item)"
                  />
                </uni-form-item>
                <uni-form-item label="合价(￥)">
                  <view>{{ item.combinedPrice || null }}</view>
                </uni-form-item>
              </uni-form-custom>
            </uni-card>
            <uni-card v-if="item.id">
              <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />
              <uni-form-item label="序号">
                <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
              </uni-form-item>
              <uni-form-item label="设备名称">
                <view class="placeholder">{{ item.name }}</view>
              </uni-form-item>
              <uni-form-item label="设备类型">
                <view class="placeholder">{{ $getLabel(equipmentType, item.type) }}</view>
              </uni-form-item>
              <uni-form-item label="规格型号">
                <view class="placeholder">{{ item.models }}</view>
              </uni-form-item>
              <uni-form-item label="单位">
                <view class="placeholder">{{ item.unit }}</view>
              </uni-form-item>
              <uni-form-item label="品牌">
                <view class="placeholder">{{ item.brand }}</view>
              </uni-form-item>
              <uni-form-item label="生产厂家">
                <view class="placeholder">{{ item.manufacturer }}</view>
              </uni-form-item>
              <uni-form-item label="供应商">
                <view class="placeholder">{{ item.supplier }}</view>
              </uni-form-item>
              <uni-form-custom :ref="item.id" :model="item" :rules="subRules" class="border-top">
                <uni-form-item label="申请采购数量" isRequired prop="number">
                  <input
                    v-model.number="item.number"
                     type="number"
                    class="uni-input"
                    placeholder="请输入申请采购数量"
                    @change="handleCalcombinedPrice(item)"
                  />
                </uni-form-item>
                <uni-form-item label="单价(￥)" isRequired prop="univalence">
                  <input
                    v-model.number="item.univalence"
                     type="number"
                    class="uni-input"
                    placeholder="请输入材料单价"
                    @change="handleCalcombinedPrice(item)"
                  />
                </uni-form-item>
                <uni-form-item label="合价(￥)">
                  <view>{{ item.combinedPrice || null }}</view>
                </uni-form-item>
              </uni-form-custom>
            </uni-card>
          </block>

          <!-- 备注信息开始 -->
          <uni-card isForm>
            <uni-form-item label="采购金额">
              <view>{{ totalPrice }}</view>
            </uni-form-item>
            <uni-form-item label="申请人">
              <view>{{ $store.state.user.userName }}</view>
            </uni-form-item>
            <uni-form-item label="备注" align="right" type="textarea">
              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入" auto-height />
            </uni-form-item>
          </uni-card>
          <!-- 备注信息结束 -->
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit('submit')">提 交</button>
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
import Api from '@/api/equipmentPurchase'
import equipmentType from './lib/equipmentType'
export default {
  components: {
    InventorySelect
  },
  data() {
    return {
      equipmentType, //设备类型
      id: '', //区分是编辑还是添加
      //申请到货日期
      checkDate: '',
      form: {
        projectId: wx.getStorageSync('projectId'),
        applyDepartmentId: '',
        applyDepartmentName: '',
        applicantId: '',
        applicantName: '',
        applyReason: '',
        appyArrivalTime: null,
        code: '',
        remark: ''
      },
      rules: {
        // applicantName: { required: true },
        applyDepartmentName: { required: true },
        appyArrivalTime: { required: true },
        usePart: { required: true },
        userId: { required: true },
        useCompany: { required: true }
      },
      subRules: {
        number: {
          required: true
        },
        univalence: {
          required: true
        }
      },
      list: [], //选中的设备
      checkedValue: [], //选中的 设备的id
      totalPrice: '' //采购金额
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
      this.$utils.setTitle('编辑采购单')

      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'draft') {
      this.handleSubmit('caogao')
    }
  },
  methods: {
    getDetail() {
      Api.getEquipmentPurchaseOrderDetail(this.id).then(res => {
        this.form = res.data || {}
        //计算采购金额
        let totalPrice = 0
        const base = 1000 //用来避免小数计算产生异常
        if (this.form.purchaseDetails) {
          _.forEach(this.form.purchaseDetails, item => {
            if (item.univalence && item.number) {
              totalPrice += item.univalence * base * (item.number * base)
            }
          })
          this.totalPrice = totalPrice / base / base
        }
        this.list = [...this.form.purchaseDetails]
      })
    },
    //到货时间
    bindCheckDateChange(e) {
      this.checkDate = e.target.value
      this.form.appyArrivalTime = `${e.target.value} 00:00:00`
    },
    //删除选中的采购设备
    handleDeleteItem(index) {
      this.list.splice(index, 1)
    },
    // 点击保存按钮
    async handleSubmit(type = 'submit') {
      await this.$refs.form.validate()
      Promise.all(
        this.list.map(item => {
          return this.$refs[item.id][0].validate()
        })
      ).then(res => {
        let data = _.cloneDeep(this.form)
        data.appyArrivalTime = `${data.appyArrivalTime} 00:00:00`
        data.purchaseDetails = this.list.map(item => {
          return {
            name: item.name,
            models: item.models,
            manufacturer: item.manufacturer,
            number: item.number,
            univalence: item.univalence,
            unit: item.unit,
            type: item.type,
            supplier: item.supplier,
            combinedPrice: item.combinedPrice
          }
        })
        let num = this.id ? 2 : 1
        if (!this.id) {
          Api.addEquipmentPurchaseOrder({ ...data, status: type === 'submit' ? 1 : 0, projectId: this.projectId }).then(
            res => {
              this.$utils.showToast('已保存')
              setTimeout(() => {
                this.$utils.goBack(num)
              }, 1000)
            }
          )
        } else {
          Api.updateEquipmentPurchaseOrder({
            ...data,
            status: type === 'submit' ? 1 : 0,
            projectId: this.projectId
          }).then(res => {
            this.$utils.showToast('已修改')
            setTimeout(() => {
              this.$utils.goBack(num)
            }, 1000)
          })
        }
      })
    },
    // 打开设备选择框
    handleOpenDrawer() {
      this.$refs.productList.open()
      return false
      let that = this
      uni.showActionSheet({
        itemList: ['库存选择', '添加新设备'],
        success: function(res) {
          if (res.tapIndex === 0) {
            that.$refs.productList.open()
          } else if (res.tapIndex === 1) {
            let obj = {
              checked: false,
              createTime: '',
              creator: '',
              id: '',
              code: '',
              type: '',
              models: '',
              name: '',
              supplier: '',
              manufacturer: '',
              unit: '',
              combinedPrice: '',
              number: '',
              univalence: ''
            }
            that.list.push(obj)
          }
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选中设备后数据回传处理
    handleInventorySelected(data) {
      // console.log('list', this.list)
      console.log(data)
      let { checked, checkedValue } = data
      this.checkedValue = checkedValue
      let list = checked.map(item => {
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
    handleTotalPriceCal() {
      let totalPrice = 0
      const base = 1000 //用来避免小数计算产生异常
      if (this.list.length) {
        _.forEach(this.list, item => {
          if (item.univalence && item.number) {
            totalPrice += item.univalence * base * (item.number * base)
          }
        })
        this.totalPrice = totalPrice / base / base
      }
    },
    // 计算单个设备的总价
    handleCalcombinedPrice(item) {
      if (!(item.number && item.univalence)) return
      let base = 1000
      item.combinedPrice = (item.number * base * (item.univalence * base)) / base / base
      this.handleTotalPriceCal()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./add.less');
</style>
