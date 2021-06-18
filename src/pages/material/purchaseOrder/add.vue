<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="采购单编号" prop="receiptNo">
              <textarea v-model.trim="form.code" auto-height disabled placeholder="自动生成" />
            </uni-form-item>
            <uni-form-item label="申请部门" prop="applyDepartmentName" isRequired isLink>
              <uni-department-select
                v-model="form.applyDepartmentId"
                :name.sync="form.applyDepartmentName"
              ></uni-department-select>
            </uni-form-item>
            <uni-form-item label="申请到货时间" prop="appyArrivalTime" isRequired isLink>
              <uni-date-picker v-model="form.appyArrivalTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="申请原因" prop="applyReason">
              <textarea v-model.trim="form.applyReason" auto-height placeholder="请输入" />
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
            <uni-form-custom :ref="index" :model="item" :rules="subRules" class="border-top mt20">
              <uni-card v-if="!item.id">
                <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />
                <uni-form-item label="序号">
                  <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                </uni-form-item>
                <uni-form-item v-if="item.code" label="材料编码" isRequired prop="number">
                  <input v-model="item.code" class="uni-input" placeholder="自动填写" disabled />
                </uni-form-item>
                <uni-form-item label="材料名称" isRequired prop="name">
                  <input v-model="item.name" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="规格型号" isRequired prop="models">
                  <input v-model="item.models" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="单位" isRequired prop="unit">
                  <input v-model="item.unit" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="品牌" isRequired prop="brand">
                  <input v-model="item.brand" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="供应商" isRequired prop="supplier">
                  <input v-model="item.supplier" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="库存量">
                  <input v-model="item.inventoryNumber" class="uni-input" placeholder="0" disabled />
                </uni-form-item>

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
              </uni-card>
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
              </uni-card>
            </uni-form-custom>
          </block>

          <!-- 备注信息开始 -->
          <uni-card isForm>
            <uni-form-item label="采购金额">
              <view>{{ totalPrice }}</view>
            </uni-form-item>
            <uni-form-item label="申请人">
              <view>{{ $store.state.user.userName }}</view>
            </uni-form-item>
            <uni-form-item label="备注" align="right">
              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入" auto-height />
            </uni-form-item>
          </uni-card>
          <!-- 备注信息结束 -->
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit()">提 交</button>
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
import { Api } from '@/api/material/purchaseOrder'
export default {
  components: {
    InventorySelect
  },
  data() {
    return {
      //申请到货日期
      checkDate: '',
      id: '',
      form: {
        projectId: wx.getStorageSync('projectId'),
        applyDepartmentId: '',
        applyDepartmentName: '',
        applicantId: '',
        applicantName: '',
        applyReason: '',
        appyArrivalTime: null,
        code: ''
      },
      rules: {
        // applicantName: { required: true },
        applyDepartmentName: { required: true },
        appyArrivalTime: { required: true },
        applyReason: { required: true }
      },
      subRules: {
        name: {
          required: true
        },
        models: {
          required: true
        },
        unit: {
          required: true
        },
        brand: {
          required: true
        },
        supplier: {
          required: true
        },
        number: {
          required: true
        },
        univalence: {
          required: true
        }
      },
      list: [], //选中的材料
      checkedValue: [], //选中的 材料的id
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
      this.handleSubmit(1)
    }
  },
  methods: {
    //获得详情
    getDetail() {
      Api.getPurchaseOrderDetail(this.id).then(res => {
        this.form = res.data || {}
        this.list = [...this.form.detailList]
        console.log('获得详情', this.list)
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

        data.detailAddList = this.list.map(item => {
          return {
            materialBrand: item.materialBrand || item.brand,
            materialCode: item.materialCode || item.code,
            materialModels: item.materialModels || item.models,
            materialName: item.materialName || item.name,
            materialRemark: item.remark,
            materialSupplier: item.materialSupplier || item.supplier,
            materialUnit: item.materialUnit || item.unit,
            combinedPrice: item.combinedPrice,
            materialId: item.materialId,
            number: item.number,
            univalence: item.univalence
          }
        })
        let num = this.id ? 2 : 1
        if (type === 1) {
          Api.getPurchaseOrderAdd(data).then(res => {
            this.$utils.showToast('已保存草稿')
            setTimeout(() => {
              this.$utils.goBack(num)
            }, 1000)
          })
        } else {
          Api.getPurchaseOrderSubmit(data).then(res => {
            this.$utils.showToast('保存成功')
            setTimeout(() => {
              this.$utils.goBack(num)
            }, 1000)
          })
        }
      })
    },
    // 打开物料选择框
    handleOpenDrawer() {
      let that = this
      uni.showActionSheet({
        itemList: ['库存选择', '添加新材料'],
        success: function(res) {
          if (res.tapIndex === 0) {
            that.$refs.productList.open()
          } else if (res.tapIndex === 1) {
            let obj = {
              checked: false,
              count: null,
              createTime: '',
              creator: '',
              // id: '',
              materialBrand: '',
              materialCode: '',
              materialModels: '',
              materialName: '',
              materialRemark: '',
              materialSupplier: '',
              materialUnit: '',
              combinedPrice: '',
              materialId: '',
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
      // this.$refs.productList.open()
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
      console.log('选中材料', this.list)
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
    // 计算单个物料的总价
    handleCalcombinedPrice(item) {
      if (!(item.number && item.univalence)) return
      // console.log('计算单个物料的总价', item)
      let base = 1000
      item.combinedPrice = (item.number * base * (item.univalence * base)) / base / base
      this.handleTotalPriceCal()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
.mt20 + .mt20 {
  margin-top: 50rpx;
}
</style>
