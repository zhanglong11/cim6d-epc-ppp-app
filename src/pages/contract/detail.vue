<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!-- 合同基本信息 start -->
        <uni-card>
          <uni-form-item label="合同名称" isCell align="left">
            {{ form.name }}
          </uni-form-item>
          <uni-form-item label="状态" isCell align="left">
            <uni-status :options="contractStatusList" :value="form.status"></uni-status>
          </uni-form-item>
          <uni-form-item label="合同类型" isCell align="left">
            {{ _.find(contractType, { value: form.type }) && _.find(contractType, { value: form.type }).label }}
          </uni-form-item>
          <uni-form-item label="合同编号" isCell align="left">
            {{ form.code }}
          </uni-form-item>
          <uni-form-item label="合同金额" isCell align="left">
            {{ (form.amount / 10000) | formatMoney }} 万元
          </uni-form-item>
          <uni-form-item label="签订日期" isCell align="left">
            {{ form.signDate | formatData }}
          </uni-form-item>
          <uni-form-item label="招采方式" isCell align="left">
            {{ form.purchaseMode == 1 ? '招标' : '非招标' }}
          </uni-form-item>
          <uni-form-item label="合同工期" isCell align="left"> {{ form.duration }} 天 </uni-form-item>
          <uni-form-item label="开工日期" isCell align="left">
            {{ form.startDate | formatData }}
          </uni-form-item>
          <uni-form-item label="竣工日期" isCell align="left">
            {{ form.endDate | formatData }}
          </uni-form-item>
          <uni-form-item label="质保期" isCell align="left"> {{ form.guaranteePeriod }} 月 </uni-form-item>
          <uni-form-item label="工程类型" isCell align="left">
            {{ $getLabelFromArg('engineeringType', form.engineeringType + '') }}
          </uni-form-item>
          <uni-form-item label="投资类型" isCell align="left">
            {{ $getLabelFromArg('investmentType', form.investmentType + '') }}
          </uni-form-item>
          <uni-form-item label="甲方名称" isCell align="left">
            {{ form.firstParty }}
          </uni-form-item>
          <uni-form-item label="甲方联系人" isCell align="left">
            {{ form.firstPartyLinkman }}
          </uni-form-item>
          <uni-form-item label="甲方联系电话" isCell align="left">
            {{ form.firstPartyMobile }}
          </uni-form-item>
          <uni-form-item label="乙方名称" isCell align="left">
            {{ form.secondParty }}
          </uni-form-item>
          <uni-form-item label="乙方联系人" isCell align="left">
            {{ form.secondPartyLinkman }}
          </uni-form-item>
          <uni-form-item label="乙方联系电话" isCell align="left">
            {{ form.secondPartyMobile }}
          </uni-form-item>
          <uni-form-item label="合同价款形式" isCell align="left">
            {{ $getLabelFromArg('priceForm', form.priceForm) }}
          </uni-form-item>
        </uni-card>
        <!-- 合同基本信息 end -->
        <!-- 合同附件信息 start -->
        <view class="card-title">合同附件信息</view>
        <uni-card>
          <uni-form-item label="电子版合同" isCell align="left" class="file">
            <uni-attachment v-model="form.electronicContractFileIds"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="纸质版合同" isCell align="left" class="file">
            <uni-attachment v-model="form.paperContractFileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 合同附件信息end -->

        <view class="card-title">合同清单信息</view>
        <view class="table-wrapper">
          <scroll-view scroll-x>
            <wTable headbBackground="#EEEEEE" :columns="columns" :data="tableData" border />
          </scroll-view>
        </view>
        <!-- 创建人 start -->
        <uni-card>
          <uni-form-item label="创建人" isCell align="left">
            {{ form.creatorName }}
          </uni-form-item>
          <uni-form-item label="创建时间" isCell align="left">
            {{ form.createTime }}
          </uni-form-item>
        </uni-card>
        <!-- 创建人 end -->
        <uni-card>
          <uni-form-item label="备注" isCell align="left" type="textarea">
            {{ form.remark }}
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import arg from './arg'
import Api from '@/api/contract'
import wTable from '@/components/wTable/wTable.vue'
export default {
  components: {
    wTable
  },
  data() {
    return {
      form: {},
      tableData: [],
      contractStatusList: [],
      columns: [
        {
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '名称',
          key: 'itemName',
          align: 'center'
        },
        {
          title: '规格型号',
          key: 'specifications',
          width: 360,
          align: 'center'
        },
        {
          title: '单位',
          key: 'unit',
          width: 140,
          align: 'center'
        },
        {
          title: '数量',
          key: 'quantity',
          width: 120,
          align: 'center'
        },
        {
          title: '单价',
          key: 'unitPrice',
          width: 120,
          align: 'center'
        },
        {
          title: '合价',
          key: 'combinedPrice',
          align: 'center'
        }
      ],
      // 合同类型
      contractType: arg.contractType,
      // 合同状态
      contractStatus: this.$getArgList('contractStatus')
    }
  },
  onLoad(options) {
    this.contractId = options.contractId
  },
  onShow() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getContractDetail()
      this.getTableData()
      this.getContractStatusList()
    },
    // 获取合同状态
    getContractStatusList() {
      let list = []
      let colors = arg.statusColors
      this.contractStatus.map((e, i) => {
        list.push({
          label: e.label,
          value: parseInt(e.value),
          color: colors[i]
        })
      })
      this.contractStatusList = list
    },
    //合同详情
    async getContractDetail() {
      let res = await Api.getContractById(this.contractId)
      this.form = { ...res.data }
    },
    async getTableData() {
      let res = await Api.getContractInventoryPurchase({ contractId: this.contractId })
      this.tableData = res.data.records
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./detail.less');
</style>
