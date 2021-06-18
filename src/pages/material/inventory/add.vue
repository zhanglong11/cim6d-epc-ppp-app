<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item v-if="form.id" label="材料编码">
            <textarea v-model.trim="form.code" disabled auto-height placeholder="请输入材料编码" />
          </uni-form-item>
          <uni-form-item label="材料名称" prop="name" isRequired>
            <textarea v-model.trim="form.name" auto-height placeholder="请输入材料名称" />
          </uni-form-item>
          <uni-form-item label="规格型号" prop="models" isRequired>
            <textarea v-model.trim="form.models" auto-height placeholder="请输入规格型号" />
          </uni-form-item>
          <uni-form-item label="单位" prop="unit" isRequired>
            <textarea v-model.trim="form.unit" auto-height placeholder="请输入计量单位" />
          </uni-form-item>
          <uni-form-item label="品牌" prop="brand" isRequired>
            <textarea v-model.trim="form.brand" auto-height placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="供应商" prop="supplier" isRequired>
            <textarea v-model.trim="form.supplier" auto-height placeholder="请输入供应商" />
          </uni-form-item>
        </uni-card>

        <!-- 备注信息开始 -->
        <uni-card isForm>
          <uni-form-item label="备注" align="rihgt" type="textarea" class="block-item">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
        </uni-card>
        <!-- 备注信息结束 -->
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleLogSubmit">保存</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  data() {
    return {
      form: {
        id: '',
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        name: {
          required: true
        },
        models: {
          required: true
        },
        brand: {
          required: true
        },
        unit: {
          required: true
        },
        supplier: {
          required: true
        }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    let id = options.id
    if (!id) return
    this.init(options.id)
  },
  onShow() {
    if (this.form.id) {
      this.getMaterialInfo()
      this.$utils.setTitle('编辑材料信息')
    }
  },
  methods: {
    init(id) {
      //编辑时获取材料信息
      this.form.id = id
    },
    // 获取材料具体信息
    async getMaterialInfo() {
      let result = await this.fly.material.get(`material/get/${this.form.id}`)
      if (result.code === 200) {
        this.form = result.data || {}
      }
    },
    // 点击保存按钮
    async handleLogSubmit() {
      // 开启表单验证
      await this.$refs.form.validate()
      let result
      if (this.form.id) {
        result = await this.fly.material.post('material/update', this.form, {
          isLoading: true
        })
      } else {
        result = await this.fly.material.post('material/add', this.form, {
          isLoading: true
        })
      }
      if (result.code === 200) {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          let delta = this.form.id ? 2 : 1
          this.$utils.goBack(delta)
        }, 1500)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
