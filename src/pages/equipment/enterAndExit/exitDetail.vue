<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!-- 进场信息 start  -->
        <uni-card class="baseInfo">
          <uni-form-item label="设备名称">
            <view class="placeholder">{{ baseInfo.equipmentName }}</view>
          </uni-form-item>

          <uni-form-item label="设备编码" align="left">
            <view class="placeholder">{{ baseInfo.equipmentCode }}</view>
          </uni-form-item>

          <uni-form-item label="使用位置" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.location }}</view>
          </uni-form-item>
          <uni-form-item label="计划退场时间" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.planExitTime | ymd }}</view>
          </uni-form-item>
        </uni-card>

        <uni-card>
          <uni-form-item label="进场负责人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.enterPrincipalName }}</view>
          </uni-form-item>

          <uni-form-item label="进场时间" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.enterTime | ymd }}</view>
          </uni-form-item>
        </uni-card>

        <uni-card class="attachmentInfo">
          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.enterRemark }}</view>
          </uni-form-item>

          <uni-form-item label="附件" :border="false" align="left">
            <uni-attachment v-if="baseInfo.enterFileIds" v-model="baseInfo.enterFileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 进场信息 end  -->
        <!-- 
         -->
        <!-- 退场信息 start -->
        <uni-card>
          <uni-form-item label="退场负责人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.exitPrincipalName }}</view>
          </uni-form-item>

          <uni-form-item label="退场日期" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.realExitTime | ymd }}</view>
          </uni-form-item>
        </uni-card>

        <uni-card class="attachmentInfo">
          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.exitRemark }}</view>
          </uni-form-item>

          <uni-form-item label="附件" :border="false" align="left">
            <uni-attachment v-if="baseInfo.exitFileIds" v-model="baseInfo.exitFileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 退场信息end -->
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data() {
    return {
      equipmentId: '', //设备ID
      baseInfo: {} //设备基本信息
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.equipmentId = options.id
  },
  onShow() {
    this.init()
  },

  methods: {
    async init() {
      let result = await this.fly.material.get(`equipmentEnterExit/get/${this.equipmentId}`)
      if (result.code === 200) {
        this.baseInfo = result.data || {}
      }
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
</style>
