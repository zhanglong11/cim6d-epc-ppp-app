<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!-- 计划检查内容开始 -->
        <uni-card isForm>
          <uni-form-item label="检查计划" align="left" isRequired class="border-bottom">
            <view v-if="itemInfo.checkPlanNumber">{{ itemInfo.checkPlanNumber }}-{{ itemInfo.checkPlanName }}</view>
          </uni-form-item>
          <view class="info-list">
            <uni-form-item label="检查计划" :border="false" align="left">
              <view class="placeholder">{{ itemInfo.checkPlanName }}</view>
            </uni-form-item>
            <uni-form-item label="计划编号" :border="false" align="left">
              <view class="placeholder">{{ itemInfo.checkPlanNumber }}</view>
            </uni-form-item>
            <uni-form-item label="检查部位" :border="false" align="left">
              <view class="placeholder">{{ (itemInfo.point && itemInfo.point.checkPoint) || '' }}</view>
            </uni-form-item>
            <uni-form-item label="检查项目" :border="false" align="left">
              <view class="placeholder">{{ (itemInfo.point && itemInfo.point.checkItem) || '' }}</view>
            </uni-form-item>
            <uni-form-item label="检查方式" :border="false" align="left">
              <view class="placeholder">{{ (itemInfo.point && itemInfo.point.checkWay) || '' }}</view>
            </uni-form-item>
            <uni-form-item label="检查数量" :border="false" align="left">
              <view class="placeholder">{{ (itemInfo.point && itemInfo.point.checkAmount) || '' }}</view>
            </uni-form-item>
            <uni-form-item label="允许偏差" :border="false" align="left">
              <view class="placeholder">{{ (itemInfo.point && itemInfo.point.allowableDeviation) || '' }}</view>
            </uni-form-item>
            <uni-form-item label="计划日期" :border="false" align="left">
              <view class="placeholder">{{ itemInfo.planTime | formatData }}</view>
            </uni-form-item>
            <uni-form-item label="验收要求" :border="false" align="left">
              <view class="placeholder">{{ itemInfo.acceptanceRequire }}</view>
            </uni-form-item>
          </view>
        </uni-card>
        <!-- 计划检查内容结束 -->
        <!-- 实际检查结果开始 -->
        <uni-card isForm>
          <uni-form-item label="检查日期" isRequired isLink>
            <picker
              mode="date"
              :value="checkTime"
              :start="startDate"
              :end="endDate"
              name="checkTime"
              @change="bindCheckTimeChange"
            >
              <view :class="[checkTime.trim() ? '' : 'placeholder']">{{ checkTime || '点击选择' }}</view>
            </picker>
          </uni-form-item>
          <uni-form-item label="检查人" isRequired isLink>
            <uni-select-user
              v-model.trim="form.checkManId"
              name="checkManName"
              placeholder="点击选择"
              @change="hanldeCheckManSelected"
            />
          </uni-form-item>
          <uni-form-item label="抄送" isLink>
            <uni-select-user
              v-model="form.copyManIds"
              multiple
              placeholder="点击选择"
              @change="handleCopyManSelected"
            />
          </uni-form-item>
          <uni-form-item label="检查结果" isRequired isLink>
            <view
              name="isPassText"
              :class="[form.isPassText.trim() ? '' : 'placeholder']"
              @click="handleResultItemClick"
              >{{ form.isPassText || '点击选择' }}</view
            >
          </uni-form-item>
        </uni-card>
        <!-- 实际检查结果结束 -->
        <!-- 检查结果未不合格时开始，此时显示原因描述 -->
        <!-- 检查结果未不合格时结束 -->
        <block v-if="form.isPass == 0">
          <uni-card isForm>
            <uni-form-item label="问题描述" isRequired>
              <textarea
                v-model.trim="noPassForm.problemDesc"
                :maxlength="-1"
                auto-height
                name="problemDesc"
                placeholder="点击输入问题描述"
              />
            </uni-form-item>
            <uni-form-item label="问题等级" isRequired isLink>
              <view
                :class="[noPassForm.problemGradeText.trim() ? '' : 'placeholder']"
                name="problemGradeText"
                @click="handleFailLevelItemClick"
                >{{ noPassForm.problemGradeText || '点击选择' }}</view
              >
            </uni-form-item>
            <uni-form-item label="紧急程度" isRequired isLink>
              <view
                :class="[noPassForm.urgencyDegreeText.trim() ? '' : 'placeholder']"
                name="urgencyDegreeText"
                @click="handleFailUrgencyItemClick"
                >{{ noPassForm.urgencyDegreeText || '点击选择' }}</view
              >
            </uni-form-item>
            <uni-form-item label="整改要求" isRequired>
              <textarea
                v-model.trim="noPassForm.rectificationRequire"
                :maxlength="-1"
                auto-height
                name="rectificationRequire"
                placeholder="点击输入整改要求"
              />
            </uni-form-item>
            <uni-form-item label="整改期限" isLink isRequired>
              <picker
                mode="date"
                :value="rectificationTimeLimit"
                :start="startDate"
                :end="endDate"
                name="rectificationTimeLimit"
                @change="bindRectificationTimeLimitChange"
              >
                <view class="uni-input " :class="[rectificationTimeLimit.trim() ? '' : 'placeholder']">{{
                  rectificationTimeLimit || '点击选择'
                }}</view>
              </picker>
            </uni-form-item>
            <uni-form-item label="整改人" isRequired isLink>
              <uni-select-user
                v-model="noPassForm.rectificationManId"
                name="rectificationManName"
                placeholder="点击选择"
                @change="handleRectificationManSelected"
              />
            </uni-form-item>
          </uni-card>
        </block>
        <!-- 备注和附件信息开始 -->

        <uni-card isForm>
          <uni-form-item label="备注" type="textarea" align="left">
            <textarea v-model.trim="form.remark" :maxlength="-1" auto-height placeholder="请输入备注内容" />
          </uni-form-item>
          <uni-form-item label="上传附件" isLink>
            <!-- <view class="placeholder" @click="handleFilesItemClick">选择附件</view> -->
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
        </uni-card>

        <!-- 备注和附件信息结束 -->
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleSubmitCheckResult">保存</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { inspectApi } from '../../api/inspect'
import moment from 'moment'
import { mapGetters } from 'vuex'
var graceChecker = require('../../utils/graceChecker.js')
export default {
  data() {
    return {
      itemInfo: {},
      itemId: '',
      form: {
        checkManId: '',
        checkManName: '',
        checkPlanId: '',
        checkTime: '',
        copyManIds: '',
        copyManNames: '',
        fileIds: '',
        isPass: null, //合格--1，不合格--0
        isPassText: '',
        // noPassDTO: {
        //   problemDesc: '',
        //   problemGrade: null,
        //   problemGradeText: '',
        //   rectificationManId: '',
        //   rectificationManName: '',
        //   rectificationRequire: '',
        //   rectificationTimeLimit: '',
        //   urgencyDegree: null,
        //   urgencyDegreeText: ''
        // },
        projectId: '',
        remark: ''
      },
      noPassForm: {
        problemDesc: '',
        problemGrade: null,
        problemGradeText: '',
        rectificationManId: '',
        rectificationManName: '',
        rectificationRequire: '',
        rectificationTimeLimit: '',
        urgencyDegree: null,
        urgencyDegreeText: ''
      },
      rectificationTimeLimit: '',
      checkTime: '',
      inspectList: [
        {
          name: '合格',
          value: 1
        },
        {
          name: '不合格',
          value: 0
        }
      ],
      failLevelList: [
        {
          name: '一级',
          value: 1
        },
        {
          name: '二级',
          value: 2
        },
        {
          name: '三级',
          value: 3
        },
        {
          name: '四级',
          value: 4
        }
      ],
      failUrgencyList: [
        {
          name: '一般隐患',
          value: 1
        },
        {
          name: '较大隐患',
          value: 2
        },
        {
          name: '严重隐患',
          value: 3
        },
        {
          name: '重大隐患',
          value: 4
        }
      ],
      rules: [
        {
          name: 'checkTime',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择检查日期'
        },
        {
          name: 'checkManName',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择检查人'
        },
        {
          name: 'isPassText',
          checkType: 'in',
          checkRule: '合格,不合格',
          errorMsg: '请输入检查结果'
        }
      ],
      subRules: [
        {
          name: 'problemDesc',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入问题描述'
        },
        {
          name: 'problemGradeText',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入问题等级'
        },
        {
          name: 'urgencyDegreeText',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入紧急程度'
        },
        {
          name: 'rectificationRequire',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入整改要求'
        },
        {
          name: 'rectificationTimeLimit',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择整改期限'
        },
        {
          name: 'rectificationManName',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择整改人'
        }
      ]
    }
  },
  computed: {
    startDate() {
      return this.getDate('start')
    },
    endDate() {
      return this.getDate('end')
    },
    ...mapGetters(['projectId'])
  },
  onLoad(option) {
    this.init(option)
  },
  onShow() {},
  methods: {
    // 初始化页面类型
    init(option) {
      this.form.projectId = this.projectId
      this.itemId = option.id || ''
      this.form.checkPlanId = this.itemId
      this.checkTime = moment().format('YYYY-MM-DD')
      this.form.checkTime = moment().format('YYYY-MM-DD') + ' 00:00:00'
      this.handleQueryPlanInfo()
    },
    // 获取安全检查计划详情
    async handleQueryPlanInfo() {
      let result = await inspectApi.queryPlanItemInfo(this.itemId)
      this.itemInfo = result.data || {}
    },
    //选中实际检查日期
    bindCheckTimeChange: function(e) {
      this.checkTime = e.target.value
      this.form.checkTime = `${e.target.value} 00:00:00`
    },
    //选中整改期限
    bindRectificationTimeLimitChange(e) {
      this.rectificationTimeLimit = e.target.value
      this.noPassForm.rectificationTimeLimit = `${e.target.value} 00:00:00`
    },
    //选择检查结果
    handleResultItemClick() {
      let vm = this
      let itemList = (this.inspectList || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.inspectList[res.tapIndex] || {}
          vm.form.isPassText = selectItem.name
          vm.form.isPass = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 设置日期控件的起止日期
    getDate(type) {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      if (type === 'start') {
        year = year - 60
      } else if (type === 'end') {
        year = year + 2
      }
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      return `${year}-${month}-${day}`
    },
    // 点击选择附件
    handleFilesItemClick() {},
    // 不合格时选择问题等级
    handleFailLevelItemClick() {
      let vm = this
      let itemList = (this.failLevelList || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.failLevelList[res.tapIndex] || {}
          vm.noPassForm.problemGradeText = selectItem.name
          vm.noPassForm.problemGrade = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 不合格时选择问题紧急程度
    handleFailUrgencyItemClick() {
      let vm = this
      let itemList = (this.failUrgencyList || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.failUrgencyList[res.tapIndex] || {}
          vm.noPassForm.urgencyDegreeText = selectItem.name
          vm.noPassForm.urgencyDegree = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //选中检查人
    hanldeCheckManSelected(data) {
      this.form.checkManId = data.userId
      this.form.checkManName = data.userName
    },
    //选中抄送人
    handleCopyManSelected(data) {
      this.form.copyManIds = data.userId
      this.form.copyManNames = data.userName
    },
    //选中整改人
    handleRectificationManSelected(data) {
      this.noPassForm.rectificationManId = data.userId
      this.noPassForm.rectificationManName = data.userName
    },
    //提交验证
    handleFormValid() {
      // 表单验证,检查数量验证是不是整数，项目Id及其他必选参数
      let isValid = true
      if (!this.form.projectId.trim()) {
        this.$utils.showToast('您还没有选择了项目')
        isValid = false
      } else {
        let checkRes = graceChecker.check(this.form, this.rules)
        if (!checkRes) {
          //未通过验证时无需验证检查结果不合格时的必填项
          this.$utils.showToast(graceChecker.error)
          isValid = false
        } else if (this.form.isPass == 0) {
          let subInfo = this.noPassForm || {}
          let subCheckResult = graceChecker.check(subInfo, this.subRules)
          if (!subCheckResult) {
            this.$utils.showToast(graceChecker.error)
            isValid = false
          }
        }
      }

      return isValid
    },
    async handleSubmitCheckResult() {
      let valid = this.handleFormValid()
      if (!valid) return
      // 验证通过，开始提交表单：当检查结果为合格时，删除noPassDTO字段，后端设置了检验规则
      if (this.form.isPass === 0) {
        this.form.noPassDTO = this.noPassForm
      }
      let result = await inspectApi.submitCheckInfo(this.form)
      if (result.code === 200) {
        let vm = this
        vm.$utils.showToast('操作成功')
        // this.handleInitForm()
        setTimeout(() => {
          vm.$utils.goBack(2)
        }, 1500)
      }
    },
    handleInitForm() {
      this.form = {
        checkManId: '',
        checkManName: '',
        checkPlanId: '',
        checkTime: '',
        copyManIds: '',
        copyManNames: '',
        fileIds: '',
        isPass: null, //合格--1，不合格--0
        isPassText: '',
        // noPassDTO: {
        //   problemDesc: '',
        //   problemGrade: null,
        //   problemGradeText: '',
        //   rectificationManId: '',
        //   rectificationManName: '',
        //   rectificationRequire: '',
        //   rectificationTimeLimit: '',
        //   urgencyDegree: null,
        //   urgencyDegreeText: ''
        // },
        projectId: '',
        remark: ''
      }
      this.noPassForm = {
        problemDesc: '',
        problemGrade: null,
        problemGradeText: '',
        rectificationManId: '',
        rectificationManName: '',
        rectificationRequire: '',
        rectificationTimeLimit: '',
        urgencyDegree: null,
        urgencyDegreeText: ''
      }
      this.rectificationTimeLimit = ''
      this.checkTime = ''
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./plan.less');
</style>
