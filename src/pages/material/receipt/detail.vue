<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item label="入库单编号" :border="false" align="left">
            <view>{{ baseInfo.code }}</view>
          </uni-form-item>
          <uni-form-item label="入库类型" :border="false" align="left">
            <view class="placeholder">{{ $getLabel(receiptType, baseInfo.type) }}</view>
          </uni-form-item>
        </uni-card>
        <view class="card-title-outer">
          <view class="title">入库明细</view>
        </view>
        <uni-card v-if="baseInfo.materialInputDetailResult && baseInfo.materialInputDetailResult.length">
          <block v-for="(item, index) in baseInfo.materialInputDetailResult" :key="item.materialId">
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
            <uni-form-item label="入库数量" :border="false" align="left">
              <view class="placeholder">{{ item.number }}</view>
            </uni-form-item>
            <uni-form-item label="单价" :border="false" align="left">
              <view class="placeholder">
                {{ isNaN(Number(item.univalence)) ? '' : Number(item.univalence).toFixed(2) }}
              </view>
            </uni-form-item>
            <uni-form-item label="合价" :border="false" align="left">
              <view class="placeholder">
                {{ isNaN(Number(item.combinedPrice)) ? '' : Number(item.combinedPrice).toFixed(2) }}
              </view>
            </uni-form-item>
          </block>
        </uni-card>
        <!-- 备注信息 start -->
        <uni-card>
          <uni-form-item label="入库金额(￥)" :border="false" align="left">
            <view class="placeholder">
              {{ isNaN(Number(baseInfo.money)) ? '' : Number(baseInfo.money).toFixed(2) }}</view
            >
          </uni-form-item>

          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.remark }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 入库人信息 start -->
        <uni-card>
          <uni-form-item label="入库人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.creatorName }}</view>
          </uni-form-item>

          <uni-form-item label="入库日期" :border="false" align="left">
            <view class="placeholder">{{ (baseInfo.createTime || '') | formatDataTime }}</view>
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import receiptType from './lib/receiptType'

export default {
  data() {
    return {
      id: '',
      baseInfo: {},
      receiptType
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
      this.fly.material.get(`materialInput/get/${this.id}`, {}, { isLoading: true }).then(res => {
        if (res.code === 200) {
          this.baseInfo = res.data || {}
        }
      })

      // this.baseInfo = {
      //   creator: '王强',
      //   createTime: '2020-06-15 14:55:00',
      // }
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
