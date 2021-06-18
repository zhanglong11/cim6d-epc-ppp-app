<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item label="出库单编号" :border="false" align="left">
            <view>{{ baseInfo.code }}</view>
          </uni-form-item>
          <uni-form-item label="领用人" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.recipientName }}</view>
          </uni-form-item>
          <uni-form-item label="领用单位" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.recipientCompanyName }}</view>
          </uni-form-item>
        </uni-card>
        <view class="card-title-outer">
          <view class="title">出库明细</view>
        </view>
        <uni-card>
          <block v-for="(item, index) in baseInfo.materialOutputDetailResultDTOS || []" :key="index">
            <view v-if="index > 0" class="line"></view>
            <uni-form-item label="序号" :border="false" align="left">
              <view class="placeholder">{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
            </uni-form-item>
            <uni-form-item label="材料编码" :border="false" align="left">
              <view class="placeholder">{{ item.code }}</view>
            </uni-form-item>
            <uni-form-item label="材料名称" :border="false" align="left">
              <view class="placeholder">{{ item.name }}</view>
            </uni-form-item>
            <uni-form-item label="规格型号" :border="false" align="left">
              <view class="placeholder">{{ item.models }}</view>
            </uni-form-item>
            <uni-form-item label="单位" :border="false" align="left">
              <view class="placeholder">{{ item.unit }}</view>
            </uni-form-item>
            <uni-form-item label="品牌" :border="false" align="left">
              <view class="placeholder">{{ item.brand }}</view>
            </uni-form-item>
            <uni-form-item label="供应商" :border="false" align="left">
              <view class="placeholder">{{ item.supplier }}</view>
            </uni-form-item>
            <uni-form-item label="库存量" :border="false" align="left">
              <view class="placeholder">{{ item.inventoryNumber }}</view>
            </uni-form-item>
            <uni-form-item label="出库数量" :border="false" align="left">
              <view class="placeholder">{{ item.number }}</view>
            </uni-form-item>
            <uni-form-item label="使用部位" :border="false" align="left">
              <view class="placeholder">{{ item.usePart }}</view>
            </uni-form-item>
          </block>
        </uni-card>
        <!-- 备注信息 start -->
        <uni-card>
          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.remark }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 入库人信息 start -->
        <uni-card>
          <uni-form-item label="出库人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.creatorName }}</view>
          </uni-form-item>

          <uni-form-item label="出库日期" :border="false" align="left">
            <view class="placeholder">{{ (baseInfo.createTime || '') | formatDataTime }}</view>
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { Api } from '@/api/material/stockOut'

export default {
  data() {
    return {
      id: '',
      baseInfo: {}
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
      Api.getStackOutDetail(this.id).then(res => {
        this.baseInfo = res.data || {}
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.uni-card {
  width: 700px;
}
.main {
  padding-bottom: 30px;
}
.placeholder {
  color: @placeholderColor;
}
.btn-wrapper {
  width: 680px;
}
.line {
  margin: 30rpx 20rpx;
  height: 2rpx;
  background-color: @line;
}
.card-title-outer {
  width: 700rpx;
  margin: 0 auto;
  .title {
    padding-top: 20rpx;
    padding-left: 25rpx;
  }
}
</style>
