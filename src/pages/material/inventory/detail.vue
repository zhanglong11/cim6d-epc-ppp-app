<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item label="材料编码" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.code }}</view>
          </uni-form-item>
          <uni-form-item label="材料名称" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.name }}</view>
          </uni-form-item>
          <uni-form-item label="规格型号" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.models }}</view>
          </uni-form-item>
          <uni-form-item label="单位" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.unit }}</view>
          </uni-form-item>
          <uni-form-item label="品牌" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.brand }}</view>
          </uni-form-item>
          <uni-form-item label="供应商" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.supplier }}</view>
          </uni-form-item>
          <uni-form-item label="库存量" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.inventoryNumber }}</view>
          </uni-form-item>
          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.remark }}</view>
          </uni-form-item>
        </uni-card>

        <!-- 创建人信息 start -->
        <uni-card>
          <uni-form-item label="创建人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.creatorName }}</view>
          </uni-form-item>

          <uni-form-item label="创建日期" :border="false" align="left">
            <view class="placeholder">{{ (baseInfo.createTime || '') | formatDataTime }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 出入库记录存在时不可删除 start -->
        <view class="btn-wrapper">
          <button
            class="button"
            type="primary"
            @click="$utils.toUrl(`/pages/material/inventory/record?id=${materialId}`)"
          >
            出入库记录
          </button>
        </view>
        <!-- 出入库记录存在时不可删除 end -->
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
      materialId: '',
      baseInfo: {}
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.materialId = options.id
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.type === 'menu') {
      this.showMenu()
    }
  },
  methods: {
    async init() {
      let result = await this.fly.material.get(`material/get/${this.materialId}`)
      if (result.code === 200) {
        this.baseInfo = result.data || {}
      }
    },
    // 删除操作
    async handleDelete() {
      let result = await this.fly.material.post(`material/delete/${this.materialId}`)
      if (result.code === 200) {
        this.$utils.showToast('删除成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1500)
      }
    },
    // 展示更多操作：编辑和删除
    showMenu() {
      uni.showActionSheet({
        itemList: ['编辑', '删除'],
        success: res => {
          let index = res.tapIndex
          if (index === 1) {
            this.handleDelete()
          } else if (index === 0) {
            this.$utils.toUrl(`/pages/material/inventory/add?id=${this.materialId}`)
          }
        }
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
</style>
