<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!-- 实际退场信息 start -->
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="退场负责人" isRequired isLink prop="exitPrincipalId">
              <uni-select-user
                v-model="form.exitPrincipalId"
                :name.sync="form.exitPrincipalName"
                placeholder="请选择"
              />
            </uni-form-item>
            <uni-form-item label="退场日期" isRequired prop="realExitTime">
              <uni-date-picker v-model="form.realExitTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
          </uni-card>

          <uni-card isForm class="attachmentInfo">
            <uni-form-item label="备注">
              <textarea v-model.trim="form.exitRemark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
            <uni-form-item class="file-item" label="附件">
              <uni-attachment v-model="form.exitFileIds" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <!-- 退场信息 end -->
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleSubmit">保 存</button>
        </view>
        <!--  -->

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

        <!-- 实际进场信息 start -->
        <uni-card>
          <uni-form-item label="进场负责人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.enterPrincipalName }}</view>
          </uni-form-item>

          <uni-form-item label="进场时间" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.enterTime | ymd }}</view>
          </uni-form-item>
        </uni-card>

        <!-- 实际进场信息 end -->
        <!-- 附件信息 start -->
        <uni-card class="attachmentInfo">
          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.enterRemark }}</view>
          </uni-form-item>

          <uni-form-item label="附件" :border="false" align="left">
            <uni-attachment v-if="baseInfo.enterFileIds" v-model="baseInfo.enterFileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 附件信息 end -->
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
      baseInfo: {},
      form: {
        // 退场测试数据
        // exitPrincipalId: '471600',
        // exitPrincipalName: '洛阳市'
      },
      rules: {
        exitPrincipalId: {
          required: true
        },
        realExitTime: {
          required: true
        }
      }
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
      this.form.id = this.equipmentId
      let result = await this.fly.material.get(`equipmentEnterExit/get/${this.equipmentId}`)
      if (result.code === 200) {
        this.baseInfo = result.data || {}
      }
    },
    async handleSubmit() {
      await this.$refs.form.validate()
      let params = _.cloneDeep(this.form)
      params.realExitTime = `${params.realExitTime} 00:00:00`
      let result = await this.fly.material.post('/equipmentEnterExit/exitEquipment', params)
      if (result.code === 200) {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          this.$utils.goBack(2)
        }, 1500)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.uni-card {
  width: 700px;
  &.attachmentInfo {
    .form-item {
      /deep/ .form-label {
        min-width: 120rpx;
      }
    }
  }
}
.main {
  padding-bottom: 30px;
}
.placeholder {
  color: @placeholderColor;
}
</style>
