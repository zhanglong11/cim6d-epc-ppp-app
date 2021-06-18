<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <!-- <uni-form-item label="入库单编号" prop="stockCode">
            <textarea v-model.trim="form.stockCode" auto-height disabled />
          </uni-form-item> -->
            <uni-form-item label="入库类型" prop="type" isRequired isLink>
              <view :class="{ placeholder: !form.type }" @click="handleReceiptModeClick">
                {{ form.typeText || '请选择入库类型' }}
              </view>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>

        <view class="card-title-outer">
          <view class="title">
            <view>入库明细</view>
            <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleOpenDrawer"></uni-icons>
          </view>
        </view>
        <block v-if="list.length">
          <uni-card v-for="(item, index) in list" :key="item.id">
            <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />
            <uni-form-item label="序号">
              <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
            </uni-form-item>
            <uni-form-item label="材料编码">
              <view>{{ item.code }}</view>
            </uni-form-item>
            <uni-form-item label="材料名称">
              <view>{{ item.name }}</view>
            </uni-form-item>
            <uni-form-item label="规格型号">
              <view>{{ item.models }}</view>
            </uni-form-item>
            <uni-form-item label="单位">
              <view>{{ item.unit }}</view>
            </uni-form-item>
            <uni-form-item label="品牌">
              <view>{{ item.brand }}</view>
            </uni-form-item>
            <uni-form-item label="供应商">
              <view>{{ item.supplier }}</view>
            </uni-form-item>
            <uni-form-item label="库存量">
              <view>{{ item.inventoryNumber }}</view>
            </uni-form-item>
            <uni-form-custom :ref="item.id" :model="item" :rules="subRules" class="border-top">
              <uni-form-item label="入库数量" isRequired prop="number">
                <input
                  v-model.number="item.number"
                  class="uni-input"
                  placeholder="请输入入库数量"
                  type="number"
                  @change="handleCalSingleCost(item)"
                />
              </uni-form-item>
              <uni-form-item label="单价(￥)" isRequired prop="univalence">
                <input
                  v-model.number="item.univalence"
                  type="number"
                  class="uni-input"
                  placeholder="请输入材料单价"
                  @change="handleCalSingleCost(item)"
                />
              </uni-form-item>
              <uni-form-item label="合价(￥)">
                <view>{{ isNaN(Number(item.combinedPrice)) ? '' : Number(item.combinedPrice).toFixed(2) }}</view>
              </uni-form-item>
            </uni-form-custom>
          </uni-card>
          <!-- 备注信息开始 -->
          <uni-card isForm>
            <uni-form-item label="入库金额">
              <view>{{ isNaN(Number(form.money)) ? '' : Number(form.money).toFixed(2) }}</view>
            </uni-form-item>
            <uni-form-item label="备注" align="rihgt" type="textarea">
              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
          </uni-card>
          <!-- 备注信息结束 -->
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit">保存</button>
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
import receiptType from './lib/receiptType'
import InventorySelect from './inventory'

export default {
  components: {
    InventorySelect
  },
  data() {
    return {
      loading: false,
      form: {
        projectId: wx.getStorageSync('projectId'),
        type: null,
        typeText: '',
        remark: '',
        money: null
      },
      rules: {
        stockCode: {
          required: true
        },
        type: {
          required: true
        }
      },
      subRules: {
        number: {
          required: true
        },
        univalence: {
          required: true
        }
      },
      receiptType,
      list: [], //选中的材料
      checkedValue: [] //选中的 材料的id
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  methods: {
    // 选择入库类型
    handleReceiptModeClick() {
      let vm = this
      uni.showActionSheet({
        itemList: _.map(
          _.filter(vm.receiptType, function(o) {
            return o.value
          }),
          'label'
        ),
        success: function(res) {
          let selectItem = vm.receiptType[res.tapIndex] || {}
          vm.form.type = selectItem.value
          vm.form.typeText = selectItem.label
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //删除选中的入库产品
    handleDeleteItem(index) {
      this.list.splice(index, 1)
      this.checkedValue.splice(index, 1)
      this.handleTotalPriceCal()
      this.$utils.showToast('删除成功')
    },
    // 点击保存按钮
    async handleSubmit() {
      // 开启表单验证,分为两项验证：入库类型验证和入库价格，数量验证
      await this.$refs.form.validate()
      Promise.all(
        this.list.map(item => {
          return this.$refs[item.id][0].validate()
        })
      ).then(res => {
        let data = _.cloneDeep(this.form)
        data.materialInputDetails = this.list.map(item => {
          return {
            combinedPrice: item.combinedPrice,
            materialId: item.id,
            number: item.number,
            univalence: item.univalence
          }
        })
        this.fly.material
          .post('materialInput/add', data, {
            isLoading: true
          })
          .then(res => {
            this.$utils.showToast('操作成功')
            setTimeout(() => {
              this.$utils.goBack()
            }, 1500)
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
      let deleteItems = _.differenceBy(this.list, checked, 'id')
      let newItems = _.differenceBy(checked, this.list, 'id')
      _.pull(this.list, ...deleteItems)
      newItems.forEach(item => {
        this.list.push(
          Object.assign(item, {
            number: null,
            univalence: null,
            combinedPrice: null
          })
        )
      })
      this.checkedValue = _.map(this.list, 'id')
      this.$refs.productList.close()
      this.handleTotalPriceCal() //针对选中材料后取消材料的情况
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
        this.form.money = totalPrice / base / base
      }
    },
    // 计算单个物料的总价
    handleCalSingleCost(item) {
      if (!(item.number && item.univalence)) return
      let base = 1000
      item.combinedPrice = (item.number * base * (item.univalence * base)) / base / base
      this.handleTotalPriceCal()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
