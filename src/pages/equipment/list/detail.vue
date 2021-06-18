<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item label="设备名称" :border="false" align="left">{{ baseInfo.name }}</uni-form-item>
          <uni-form-item label="设备编码" :border="false" align="left">{{ baseInfo.code }}</uni-form-item>
          <uni-form-item label="规格型号" :border="false" align="left">{{ baseInfo.models }}</uni-form-item>
          <uni-form-item label="设备类别" :border="false" align="left">
            {{ $getLabel(equipmentType, baseInfo.type) }}</uni-form-item
          >
          <uni-form-item label="单位" :border="false" align="left">{{ baseInfo.unit }}</uni-form-item>
          <uni-form-item label="使用状态" :border="false" align="left">
            {{ $getLabel(equipmentStatus, baseInfo.useStatus) }}
          </uni-form-item>
          <uni-form-item label="设备来源" :border="false" align="left">
            {{ $getLabel(sourceList, baseInfo.source) }}</uni-form-item
          >
          <uni-form-item label="设备位置" :border="false" align="left">{{ baseInfo.location }}</uni-form-item>
          <uni-form-item label="品牌" :border="false" align="left">{{ baseInfo.brand }}</uni-form-item>
          <uni-form-item label="供应商" :border="false" align="left">{{ baseInfo.supplier }}</uni-form-item>
          <uni-form-item label="生产厂家" :border="false" align="left">{{ baseInfo.manufacturer }}</uni-form-item>
          <uni-form-item label="使用人" :border="false" align="left">{{ baseInfo.userName }}</uni-form-item>
          <uni-form-item label="责任人" :border="false" align="left">{{ baseInfo.principalName }}</uni-form-item>
          <uni-form-item label="使用人联系电话" :border="false" align="left">{{ baseInfo.userPhone }}</uni-form-item>
          <uni-form-item label="使用人身份证号" :border="false" align="left">{{
            baseInfo.userIdentityCard
          }}</uni-form-item>
          <uni-form-item label="特种设备使用证号" :border="false" align="left">{{
            baseInfo.specialEquipmentCode
          }}</uni-form-item>
          <uni-form-item label="车牌号" :border="false" align="left">{{ baseInfo.plateNumber }}</uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item label="创建人" :border="false" align="left">{{ baseInfo.creatorName }}</uni-form-item>
          <uni-form-item label="创建时间" :border="false" align="left">{{ baseInfo.createTime }}</uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item label="备注" :border="false" align="left">{{ baseInfo.remark }}</uni-form-item>
          <uni-form-item label="附件">
            <uni-attachment v-model="baseInfo.fileIds" />
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/material/equipment'
import equipmentType from './lib/equipmentType'
import equipmentStatus from './lib/equipmentStatus'
import sourceList from './lib/sourceList'
export default {
  data() {
    return {
      id: '',
      baseInfo: {},
      equipmentType,
      equipmentStatus,
      sourceList
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
    this.init()
  },
  methods: {
    init() {
      // 通过请求获取材料详情
      Api.detail(this.id).then(res => {
        console.log(res)
        this.baseInfo = res.data || {}
      })
    }
  }
}
</script>

<style scoped lang="less">
@import './detail.less';
</style>
