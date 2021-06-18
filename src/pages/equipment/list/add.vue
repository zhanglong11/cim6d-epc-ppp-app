<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body-details">
        <div v-if="saveTime" class="save-time">实时保存{{ saveTime }}</div>

        <uni-card>
          <uni-form-custom ref="form" :rules="rules" :model="form">
            <uni-form-item label="设备名称" prop="name">
              <input v-model="form.name" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="规格型号" prop="models">
              <input v-model="form.models" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="单位" prop="unit">
              <input v-model="form.unit" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="设备类别" prop="type">
              <uni-select v-model="form.type" :options="equipmentType" />
            </uni-form-item>

            <uni-form-item label="设备来源" prop="source">
              <uni-select v-model="form.source" :options="sourceList" />
            </uni-form-item>

            <uni-form-item label="设备位置" prop="location">
              <input v-model="form.location" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="品牌" prop="brand">
              <input v-model="form.brand" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="供应商" prop="supplier">
              <input v-model="form.supplier" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="生产厂家" prop="manufacturer">
              <input v-model="form.manufacturer" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="使用人" prop="user">
              <uni-select-user
                v-model="form.user"
                :name.sync="form.userName"
                :mobile.sync="form.userPhone"
                placeholder="请选择"
                @change="getUser"
              />
            </uni-form-item>

            <uni-form-item label="责任人" prop="principal">
              <uni-select-user v-model="form.principal" :name.sync="form.principalName" placeholder="请选择" />
            </uni-form-item>

            <uni-form-item label="使用人联系电话" prop="userPhone">
              <input v-model="form.userPhone" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="使用人身份证号" prop="userIdentityCard">
              <input v-model="form.userIdentityCard" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="特种设备使用证号" prop="specialEquipmentCode">
              <input v-model="form.specialEquipmentCode" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="车牌号" prop="plateNumber">
              <input v-model="form.plateNumber" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item label="备注" prop="remark">
              <input v-model="form.remark" placeholder="请输入" />
            </uni-form-item>

            <uni-form-item class="file-item" label="上传附件" prop="fileIds">
              <uni-attachment v-model="form.fileIds" edit></uni-attachment>
            </uni-form-item>
          </uni-form-custom>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="submit()">保存</button>
        </view>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import equipmentStatus from './lib/equipmentStatus'
import equipmentType from './lib/equipmentType'
import sourceList from './lib/sourceList'
export default {
  name: 'Add',
  data() {
    return {
      id: '',
      form: {
        projectId: uni.getStorageSync('projectId')
      },
      userName: '',
      isLoading: false,
      equipmentStatus,
      sourceList,
      equipmentType,
      rules: {
        name: { required: true },
        models: { required: true },
        unit: { required: true },
        useStatus: { required: true },
        type: { required: true },
        source: { required: true },
        location: { required: true },
        supplier: { required: true },
        manufacturer: { required: true }
      }
    }
  },
  computed: {
    // 表单缓存
    formDataTemp() {
      return this.$store.state.addCache.addEquipmentCache
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.addCache.saveTime
    }
  },
  onLoad(option) {
    this.id = option.id
    if (this.id) {
      this.$utils.setTitle('编辑培训')
      this.refresh()
    } else {
      this.autoSave()
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.labourSafety.get('training/get/' + this.id).then(res => {
        this.form = res.data
      })
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('setAddEquipmentCache', this.form)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('clearCompanyTemp', 'addEquipmentCache')
    },
    async getUser(user) {
      // console.log(user)
      const res = await this.fly.system.get(`/cim6d/system/user/get/${user.userId}`)
      // console.log(res)
      this.form = {
        ...this.form,
        ...{
          userIdentityCard: res.data.identityCardNumber
        }
      }
    },
    async submit() {
      await this.$refs.form.validate()
      await this.fly.material.post('equipment/' + (this.id ? 'update' : 'add'), this.form).then()
      this.$utils.showToast('保存成功')
      this.clearCache()
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/common';
.uni-card {
  width: 700px;
}
</style>
