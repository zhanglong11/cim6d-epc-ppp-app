<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="设备名称" isLink isRequired prop="equipmentId">
              <textarea
                v-model.trim="form.equipmentName"
                readonly
                disabled
                auto-height
                placeholder="点击选择设备"
                @click="handleEquipmentItemClick"
              />
            </uni-form-item>
            <uni-form-item label="使用位置" isRequired prop="location">
              <textarea v-model.trim="form.location" placeholder="请输入使用位置" auto-height />
            </uni-form-item>
            <uni-form-item label="计划退场时间" prop="planExitTime">
              <uni-date-picker v-model="form.planExitTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
          </uni-card>

          <!-- 实际进场信息 start -->
          <uni-card isForm>
            <uni-form-item label="进场负责人" isRequired isLink prop="enterPrincipalId">
              <uni-select-user
                v-model="form.enterPrincipalId"
                :name.sync="form.enterPrincipalName"
                placeholder="请选择"
              />
            </uni-form-item>
            <!-- <uni-select-user
              v-model="form.consigneeId"
              :roles="['收货人']"
              :name.sync="form.consigneeName"
              :mobile.sync="form.consigneeMobile"
            ></uni-select-user> -->
            <uni-form-item label="进场时间" isRequired prop="enterTime">
              <uni-date-picker v-model="form.enterTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
          </uni-card>

          <!-- 实际进场信息 end -->
          <!-- 附件信息 start -->
          <uni-card isForm class="attachmentInfo">
            <uni-form-item label="备注">
              <textarea v-model.trim="form.enterRemark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
            </uni-form-item>

            <uni-form-item class="file-item" label="附件">
              <uni-attachment v-model="form.enterFileIds" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <!-- 附件信息 end -->
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleSubmit">保存</button>
        </view>
      </view>
    </scroll-view>
    <!-- 设备列表start -->
    <uni-drawer ref="equipmentList" :width="750" mode="right">
      <select-equipment :status="0" @selected="handleEquipmentSelect"></select-equipment>
    </uni-drawer>
    <!-- 设备列表end -->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import SelectEquipment from '../select-equipment/select-equipment'
export default {
  components: {
    SelectEquipment
  },

  data() {
    return {
      loading: false,
      form: {
        projectId: wx.getStorageSync('projectId'),
        equipmentName: ''
      },
      rules: {
        equipmentId: {
          required: true
        },
        location: {
          required: true
        },
        planExitTime: {
          required: true
        },
        enterPrincipalId: {
          required: true
        },
        enterTime: {
          required: true
        }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  methods: {
    // 选择设备
    handleEquipmentItemClick() {
      this.$refs.equipmentList.open()
    },
    // 选中设备的回调
    handleEquipmentSelect(data) {
      this.$refs.equipmentList.close()
      if (!data) return
      Object.assign(this.form, data)
    },
    async handleSubmit() {
      await this.$refs.form.validate()
      let params = _.cloneDeep(this.form)
      params.planExitTime = `${params.planExitTime} 00:00:00`
      params.enterTime = `${params.enterTime} 00:00:00`
      let result = await this.fly.material.post('/equipmentEnterExit/add', params)

      if (result.code === 200) {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1500)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('enter.less');
</style>
