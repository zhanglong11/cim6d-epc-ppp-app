<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body-details">
        <uni-card>
          <view class="title">{{ info.maintenancePlanName }} {{ info.code }}</view>
          <uni-form-custom>
            <uni-form-item label="保养部门">
              <span>{{ info.maintenanceDepartmentName }}</span>
            </uni-form-item>

            <uni-form-item label="上次保养时间">
              <span>{{ info.lastTime }}</span>
            </uni-form-item>
            <uni-form-item label="计划保养时间">
              <span>{{ info.thisTime }}</span>
            </uni-form-item>

            <uni-form-item label="时间间隔">
              <span>{{ info.intervalDays }}</span>
            </uni-form-item>

            <uni-form-item label="循环方式">
              <span>{{ $getLabel(cycle, info.circulationMode) }}</span>
            </uni-form-item>

            <uni-form-item label="保养级别">
              <span>{{ $getLabel(level, info.level) }}</span>
            </uni-form-item>

            <uni-form-item label="保养负责人">
              <span>{{ info.principalName }}</span>
            </uni-form-item>

            <uni-form-item label="计划描述">
              <span>{{ info.description }}</span>
            </uni-form-item>
          </uni-form-custom>
        </uni-card>

        <view v-if="equipmentList.length" class="card-title">
          <view>保养明细</view>
        </view>
        <uni-card v-for="(item, index) in equipmentList" :key="item.id">
          <uni-form-item label="序号" :border="false" align="left">{{ index + 1 }}</uni-form-item>
          <uni-form-item label="设备编码" :border="false" align="left">{{ item.code }}</uni-form-item>
          <uni-form-item label="设备名称" :border="false" align="left">{{ item.name }}</uni-form-item>
          <uni-form-item label="规格型号" :border="false" align="left">{{ item.models }}</uni-form-item>
          <uni-form-item label="单位" :border="false" align="left">{{ item.unit }}</uni-form-item>
          <uni-form-item label="生产厂家" :border="false" align="left">{{ item.manufacturer }}</uni-form-item>
          <uni-form-item label="供应商" :border="false" align="left">{{ item.supplier }}</uni-form-item>
          <uni-form-item label="设备类别" :border="false" align="left">{{
            $getLabel(equipmentType, item.type)
          }}</uni-form-item>
          <uni-form-item label="保养部位" :border="false" align="left">{{ item.maintenanceParts }}</uni-form-item>
          <uni-form-item label="保养开始时间" isLink isRequired prop="maintenanceStartTime">
            <uni-date-picker v-model="item.maintenanceStartTime" fields="second"></uni-date-picker>
          </uni-form-item>
        </uni-card>

        <uni-card>
          <uni-form-item label="创建人" :border="false" align="left">{{ info.creatorName }}</uni-form-item>
          <uni-form-item label="创建时间" :border="false" align="left">{{ info.createTime }}</uni-form-item>
        </uni-card>

        <uni-card>
          <uni-form-item label="备注" :border="false" align="left">{{ info.remark }}</uni-form-item>
          <uni-form-item label="附件">
            <uni-attachment v-model="info.fileIds" />
          </uni-form-item>
        </uni-card>

        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="submit()">保存</button>
        </view>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import equipmentStatus from './lib/maintenanceStatus'
import equipmentType from './lib/equipmentType'
import level from './lib/level'
import cycle from './lib/cycle'
import Api from '@/api/material/equipment/maintenance'
export default {
  name: 'Add',
  data() {
    return {
      id: '',
      form: {
        projectId: uni.getStorageSync('projectId')
      },
      info: {},
      isLoading: false,
      level,
      cycle,
      equipmentStatus,
      equipmentType,
      equipmentList: [],
      rules: {
        trainingTheme: { required: true }
      }
    }
  },
  onLoad(option) {
    this.id = option.id
    if (this.id) {
      this.refresh()
    }
  },
  mounted() {},
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      this.info = res.data
      this.equipmentList = res.data.details
    },
    async getPlan(o) {
      const res = await Api.planDetail(o.id)
      this.info = res.data
      this.equipmentList = res.data.equipments || []
    },
    async submit() {
      await Api.updateStatus({ ...this.form, ...{ details: this.equipmentList, id: this.id, status: 1 } })
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}
</style>
