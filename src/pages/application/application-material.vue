<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card v-if="type !== '2'" :title="type === '0' ? '材料管理' : ''" :hideTitle="type != '0'">
          <ul class="list">
            <li v-if="$hasPower('InventoryList')" @click="$utils.toUrl('/pages/material/inventory/index')">
              <image class="list-icon" src="@/static/images/application/InventoryList.png"></image>
              <p>材料库存</p>
            </li>
            <li v-if="$hasPower('InWarehouse')" @click="$utils.toUrl('/pages/material/receipt/list')">
              <image class="list-icon" src="@/static/images/application/InWarehouse.png"></image>
              <p>入库单</p>
            </li>
            <li v-if="$hasPower('OutWarehouse')" @click="$utils.toUrl(`/pages/material/stockOut/list`)">
              <image class="list-icon" src="@/static/images/application/OutWarehouse.png"></image>
              <p>出库单</p>
            </li>
            <li v-if="$hasPower('Procurement')" @click="$utils.toUrl('/pages/material/purchaseOrder/list')">
              <image class="list-icon" src="@/static/images/application/Procurement.png"></image>
              <p>采购单</p>
            </li>
            <li @click="$utils.toUrl('/pages/material/materialUse/list')">
              <image class="list-icon" src="/static/images/application/Procurement.png"></image>
              <p>材料使用申请</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="type !== '1'" :title="type === '0' ? '设备管理' : ''" :hideTitle="type != '0'">
          <ul v-if="$hasPower('EquipmentList')" class="list">
            <li @click="$utils.toUrl('/pages/equipment/list/index')">
              <image class="list-icon" src="@/static/images/application/EquipmentList.png"></image>
              <p>设备台账</p>
            </li>
            <li v-if="$hasPower('EnterAndExit')" @click="$utils.toUrl('/pages/equipment/enterAndExit/index')">
              <image class="list-icon" src="@/static/images/application/EnterAndExit.png"></image>
              <p>设备进退场</p>
            </li>
            <li v-if="$hasPower('EquipmentMaintenance')" @click="$utils.toUrl('/pages/equipment/maintenance/index')">
              <image class="list-icon" src="@/static/images/application/EquipmentMaintenance.png"></image>
              <p>设备保养</p>
            </li>

            <li v-if="$hasPower('PurchaseList')" @click="$utils.toUrl('/pages/equipment/purchase/list')">
              <image class="list-icon" src="@/static/images/application/PurchaseList.png"></image>
              <p>设备采购</p>
            </li>
            <li v-if="$hasPower('EquipmentRent')" @click="$utils.toUrl('/pages/equipment/lease/list')">
              <image class="list-icon" src="@/static/images/application/EquipmentRent.png"></image>
              <p>设备租赁</p>
            </li>
            <li v-if="$hasPower('EquipmentRepair')" @click="$utils.toUrl('/pages/equipment/Troubleshooting/index')">
              <image class="list-icon" src="@/static/images/application/EquipmentRepair.png"></image>
              <p>设备故障维修</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'ApplicationMaterial',
  data() {
    return {
      type: 0
    }
  },
  onLoad(options) {
    this.init(options)
  },
  methods: {
    // 初始化
    init(options) {
      this.type = options.type || '0'
      this.setTitle()
    },
    // 设置标题栏
    setTitle() {
      let title = '物资设备'
      let type = this.type
      switch (type) {
        case '0':
          title = '物资设备'
          break
        case '1':
          title = '材料管理'
          break
        case '2':
          title = '设备管理'
          break
      }
      console.log(111, type, title)
      this.$utils.setTitle(title)
    },
    // 跳转路由
    toUrl(url) {
      this.$utils.toUrl(url)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
