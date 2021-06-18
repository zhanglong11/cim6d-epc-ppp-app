<template>
  <view class="main">
    <view class="main-body">
      <!-- 报修审核Start  -->
      <block v-if="repairStatus === 1">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="审核结果" isRequired isLink prop="status">
              <view :class="{ placeholder: !Boolean(form.status) }" @click="handleStatusSelected">
                {{ form.status ? $getLabel(checkResult, form.status) : '点击选择' }}
              </view>
            </uni-form-item>
            <uni-form-item label="审核意见" isRequired prop="optionContent">
              <textarea v-model.trim="form.optionContent" auto-height placeholder="请输入审核意见" />
            </uni-form-item>
            <uni-form-item label="审核人" isRequired>
              <view>{{ userName }}</view>
            </uni-form-item>
            <uni-form-item label="审核时间" isRequired>
              <view>{{ createTime }}</view>
            </uni-form-item>
          </uni-card>

          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit">提 交</button>
          </view>
        </uni-form-custom>
      </block>
      <!-- 报修审核Start  -->
      <!-- 报修基本信息 start  -->

      <uni-card :title="`${baseInfo.equipmentName || ''}${baseInfo.equipmentCode || ''}` || '设备名称'">
        <uni-form-item label="设备维修编码" align="left">
          <view class="placeholder">{{ baseInfo.code }}</view>
        </uni-form-item>

        <uni-form-item label="规格型号" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.models }}</view>
        </uni-form-item>
        <uni-form-item label="故障发生时间" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.faultTime | formatDataTime }}</view>
        </uni-form-item>
        <uni-form-item label="故障等级" :border="false" align="left">
          <view class="placeholder">{{ $getLabel(levelList, baseInfo.level) }}</view>
        </uni-form-item>
        <uni-form-item label="故障类别" :border="false" align="left">
          <view class="placeholder">{{ $getLabel(categoryList, baseInfo.type) }}</view>
        </uni-form-item>
        <uni-form-item label="故障描述" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.description }}</view>
        </uni-form-item>

        <uni-form-item label="是否外委" :border="false" align="left">
          <view class="placeholder">{{ $getLabel(isOutsourceList, baseInfo.isOutsource) }}</view>
        </uni-form-item>
        <uni-form-item label="操作人员" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.operatorName }}</view>
        </uni-form-item>
        <uni-form-item label="操作人员电话" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.operatorPhone }}</view>
        </uni-form-item>
        <uni-form-item label="维修班组" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.repairDepartmentName }}</view>
        </uni-form-item>
        <uni-form-item label="紧急程度" :border="false" align="left">
          <view class="placeholder">{{ $getLabel(urgencyList, baseInfo.urgency) }}</view>
        </uni-form-item>
        <uni-form-item label="是否停机" :border="false" align="left">
          <view class="placeholder">{{ $getLabel(isStopList, baseInfo.isStop) }}</view>
        </uni-form-item>
      </uni-card>
      <!-- 报修审核结果 start -->
      <block v-if="[2, 3].includes(repairStatus)">
        <uni-card>
          <uni-form-item label="审核结果" :border="false" align="left">
            <view class="placeholder"> {{ $getLabel(checkResult, baseInfo.repairStatus) }}</view>
          </uni-form-item>

          <uni-form-item label="审核意见" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.optionContent }}</view>
          </uni-form-item>
          <uni-form-item label="审核人" :border="false" align="left">
            <view class="placeholder"> {{ baseInfo.reviewerName }}</view>
          </uni-form-item>

          <uni-form-item label="审核时间" :border="false" align="left">
            <view class="placeholder">{{ baseInfo.reviewerTime | ymd }}</view>
          </uni-form-item>
        </uni-card>
      </block>
      <!-- 报修审核结果 end -->
      <uni-card>
        <uni-form-item label="创建人" :border="false" align="left">
          <view class="placeholder"> {{ baseInfo.creatorName }}</view>
        </uni-form-item>

        <uni-form-item label="创建时间" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.createTime | ymd }}</view>
        </uni-form-item>
      </uni-card>

      <uni-card class="attachmentInfo">
        <uni-form-item label="备注" :border="false" align="left">
          <view class="placeholder"> {{ baseInfo.remark }}</view>
        </uni-form-item>

        <uni-form-item label="附件" :border="false" align="left">
          <uni-attachment v-if="baseInfo.fileIds" v-model="baseInfo.fileIds"></uni-attachment>
        </uni-form-item>
      </uni-card>
      <!-- 报修基本信息 end  -->
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import levelList from './lib/levelList'
import categoryList from './lib/categoryList'
import urgencyList from './lib/urgencyList'
import isStopList from './lib/isStopList'
import isOutsourceList from './lib/isOutsourceList'
import checkResult from './lib/checkResult'
import moment from 'moment'

export default {
  data() {
    return {
      id: '', //设备ID
      isDraft: true, //是否草稿
      repairStatus: null, //报修单状态
      baseInfo: {}, //设备基本信息
      levelList,
      categoryList,
      urgencyList,
      isStopList,
      isOutsourceList,
      checkResult,
      // 报修审核数据
      form: {
        status: null
      },
      rules: {
        status: {
          required: true
        },
        optionContent: {
          required: true
        }
      },
      createTime: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userName'])
  },
  onLoad(options) {
    this.form.id = this.id = options.id
    this.repairStatus = Number(options.repairStatus)
    this.isDraft = this.repairStatus === 0
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
      // 非草稿状态隐藏顶部更多操作
      // #ifdef  APP-PLUS
      if (!this.isDraft) {
        let webView = this.$mp.page.$getAppWebview()
        webView.setTitleNViewButtonStyle(0, {
          text: '',
          fontSize: 0
        })
      }
      // #endif
      let result = await this.fly.material.get(`equipmentRepair/get/${this.id}`)
      if (result.code === 200) {
        this.baseInfo = result.data || {}
      }
    },
    // 删除草稿状态的报修项
    async handleDelete() {
      let result = await this.fly.material.get(`/equipmentRepair/delete/${this.id}`)
      if (result.code === 200) {
        this.$utils.showToast('删除成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1500)
      }
    },
    // 草稿状态的报修项展示更多操作：编辑和删除
    showMenu() {
      uni.showActionSheet({
        itemList: ['编辑', '删除'],
        success: res => {
          let index = res.tapIndex
          if (index === 1) {
            this.handleDelete()
          } else if (index === 0) {
            this.$utils.toUrl(`/pages/equipment/Troubleshooting/add?id=${this.id}`)
          }
        }
      })
    },
    // 选择审核结果
    handleStatusSelected() {
      uni.showActionSheet({
        itemList: this._.map(this.checkResult, 'label'),
        success: res => {
          let index = res.tapIndex
          this.form.status = this.checkResult[res.tapIndex].value
        }
      })
    },
    // 提交审核结果
    async handleSubmit() {
      await this.$refs.form.validate()
      let result = await this.fly.material.post(`/equipmentRepair/updateRepair`, this.form, { isLoading: true })
      if (result.code === 200) {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('detail.less');
</style>
