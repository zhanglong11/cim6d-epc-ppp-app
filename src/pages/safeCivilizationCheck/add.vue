<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!-- 选择工序组件 start -->
        <uni-select-procedure @change="changeProcedure" />
        <!-- 选择工序组件 end -->

        <uni-card isForm>
          <uni-form-item label="安全文明管理名称" isRequired>
            <label>
              <input v-model="form.civilizationName" class="align-right" placeholder="请输入" />
            </label>
          </uni-form-item>
          <uni-form-item label="安全文明管理内容" isRequired>
            <label>
              <textarea
                v-model="form.civilizationContent"
                :maxlength="-1"
                auto-height
                class="align-right"
                placeholder="请输入"
              />
            </label>
          </uni-form-item>
          <uni-form-item label="负责人" isLink isRequired>
            <uni-select-user v-model="form.principal" @change="principleSelected"></uni-select-user>
          </uni-form-item>
          <uni-form-item label="负责人联系方式" isRequired>
            <label>
              <input v-model.number="form.principalContact" class="align-right" type="number" placeholder="请输入" />
            </label>
          </uni-form-item>
          <uni-form-item label="计划开始日期" isLink isRequired>
            <picker
              mode="date"
              :value="form.planStartDate"
              :start="startDate"
              :end="endDate"
              @change="planStartDateChange"
            >
              <view class="uni-input align-right">{{ form.planStartDate || '请选择时间' }}</view>
            </picker>
          </uni-form-item>
          <uni-form-item label="计划结束日期" isLinkisRequired>
            <picker mode="date" :value="form.planEndDate" :start="startDate" :end="endDate" @change="planEndDateChange">
              <view class="uni-input align-right">{{ form.planEndDate || '请选择时间' }}</view>
            </picker>
          </uni-form-item>
          <uni-form-item label="安全文明管理目标" isRequired>
            <label>
              <textarea
                v-model="form.civilizationTarget"
                :maxlength="-1"
                auto-height
                class="align-right"
                placeholder="请输入"
              />
            </label>
          </uni-form-item>
          <uni-form-item label="验收要求" isRequired>
            <label>
              <input v-model.trim="form.requirements" class="align-right" placeholder="请输入" name="requirements" />
            </label>
          </uni-form-item>
          <uni-form-item label="检查单位" isLink isRequired>
            <uni-department-select v-model="form.checkCompany" class="align-right" @change="checkCompanySelected" />
          </uni-form-item>
          <uni-form-item label="受检单位" isLink isRequired>
            <uni-department-select v-model="form.checkedCompany" class="align-right" @change="checkedCompanySelected" />
          </uni-form-item>
          <uni-form-item label="受检方代表" isLink isRequired>
            <uni-select-user
              v-model="form.checkedRepresentative"
              @change="checkedRepresentativeSelected"
            ></uni-select-user>
          </uni-form-item>
        </uni-card>

        <uni-card isForm>
          <uni-form-item label="检查日期" isLink isRequired>
            <picker mode="date" :value="form.checkDate" :start="startDate" :end="endDate" @change="bindDateChange">
              <view class="uni-input align-right">{{ form.checkDate || '请选择时间' }}</view>
            </picker>
          </uni-form-item>
          <uni-form-item label="检查人" isLink isRequired>
            <uni-select-user v-model="form.checkPerson" @change="handleCheckPersonSelected"></uni-select-user>
          </uni-form-item>
          <uni-form-item label="检查部位" isRequired>
            <label>
              <input v-model.trim="form.placeName" class="align-right" placeholder="请输入" name="placeName" />
            </label>
          </uni-form-item>
          <uni-form-item label="抄送" isLink>
            <uni-select-user v-model="form.copyManIds" multiple @change="copyManSelected"></uni-select-user>
          </uni-form-item>
          <uni-form-item label="检查结果" isRequired isLink>
            <view class="align-right" @click="handleResultItemClick">{{ checkResultName || '点击选择' }}</view>
          </uni-form-item>
        </uni-card>

        <!--不合格显示以下模块-->
        <uni-card v-if="form.resultAddDTO.checkResult === 0" isForm>
          <uni-form-item label="问题描述" isRequired>
            <textarea
              v-model="form.resultAddDTO.describes"
              class="align-right"
              :maxlength="-1"
              placeholder="点击输入问题描述"
              name="describes"
            />
          </uni-form-item>
          <uni-form-item label="问题等级" isRequired isLink>
            <view class="align-right" name="levels" @click="handleClassItemClick">{{ levelsName || '点击选择' }}</view>
          </uni-form-item>
          <uni-form-item label="紧急程度" isRequired isLink>
            <view class="align-right" name="urgency" @click="handleUrgencyItemClick">{{
              urgencyName || '点击选择'
            }}</view>
          </uni-form-item>
          <uni-form-item label="整改要求" isRequired>
            <textarea
              v-model="form.resultAddDTO.rectificationRequire"
              :maxlength="-1"
              auto-height
              class="align-right"
              placeholder="点击输入整改要求"
              name="rectificationRequire"
            />
          </uni-form-item>
          <uni-form-item label="整改期限" isLink isRequired>
            <picker
              mode="date"
              :value="form.resultAddDTO.rectificationTime"
              :start="startDate"
              :end="endDate"
              @change="bindrectificationTimeChange"
            >
              <view class="uni-input align-right">{{ form.resultAddDTO.rectificationTime || '点击选择' }}</view>
            </picker>
          </uni-form-item>
          <uni-form-item label="整改人" isRequired isLink>
            <uni-select-user
              v-model="form.resultAddDTO.rectificationer"
              class="align-right"
              placeholder="点击选择"
              @change="rectificationerSelectedChange"
            />
          </uni-form-item>
        </uni-card>
        <!-- 附件上传 -->
        <uni-card isForm>
          <uni-form-item label="备注" align="left" type="textarea" class="block-item">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="上传附件">
            <uni-attachment v-model="form.files" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </view>
      <view class="btn-wrapper">
        <button class="button" type="primary" :loading="isLoading" @click="handleLogSubmit">保存</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
var graceChecker = require('../../utils/graceChecker.js')

import Api from '../../api/safeCivilizationCheck'
import { mapGetters } from 'vuex'
export default {
  data() {
    const form = {
      civilizationName: '', //安全文明管理名称
      civilizationContent: '', //安全文明管理内容
      civilizationTarget: '', //安全文明管理目标
      principal: '',
      principalName: '',
      principalContact: '', //负责任联系方式
      planEndDate: '',
      planStartDate: '',
      requirements: '', //验收要求
      checkCompany: '',
      checkCompanyName: '',
      checkedCompany: '',
      checkedCompanyName: '',
      checkedRepresentative: '', //受检代表
      checkedRepresentativeName: '',
      checkDate: '',
      placeName: '',
      checkPerson: '',
      checkPersonName: '', //检查人
      copyManIds: '', //抄送人
      copyManNames: '',
      files: '',
      remark: '',
      floorScheduleList: [
        {
          configId: '',
          entityId: '',
          floorId: '',
          floorNum: 0,
          floorScheduleId: '',
          projectId: '',
          targetId: '',
          type: 0
        }
      ],
      projectId: '',
      resultAddDTO: {
        checkDate: '',
        checkPerson: '',
        checkPersonName: '',
        checkResult: 1,
        describes: '',
        files: '',
        levels: 0,
        rectificationRequire: '',
        rectificationTime: '',
        rectificationer: '',
        rectificationerName: '',
        remark: '',
        urgency: 0
      },
      floorScheduleList: []
    }
    return {
      form: form,
      checkResultName: null,
      levelsName: null,
      urgencyName: null,
      isLoading: false,
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
      levels: [
        {
          name: '一级',
          value: 0
        },
        {
          name: '二级',
          value: 1
        },
        {
          name: '三级',
          value: 2
        },
        {
          name: '四级',
          value: 3
        }
      ],
      urgency: [
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
      sourceList: [
        {
          name: '打桩时未使用相适应的桩帽和垫子',
          value: 1
        },
        {
          name: '悬挂振动桩锤的起重机吊钩上无防松脱的保护装置',
          value: 2
        },
        {
          name: '泥浆水排放未按有关规定做好相应的措施',
          value: 3
        },
        ,
        {
          name: '深基坑工程专项安全施工方案，未按专家组论证审...',
          value: 4
        }
      ],
      rule: [
        {
          name: 'floorScheduleList',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择工序'
        },
        {
          name: 'civilizationName',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '安全文明管理名称不能为空'
        },
        {
          name: 'civilizationContent',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '安全文明管理内容不能为空'
        },
        {
          name: 'principal',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择负责人'
        },
        {
          name: 'principalContact',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择负责人联系方式'
        },
        {
          name: 'planStartDate',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择计划开始日期'
        },
        {
          name: 'planEndDate',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择计划结束日期'
        },
        {
          name: 'civilizationTarget',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '安全文明管理目标不能为空'
        },
        {
          name: 'requirements',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '验收要求不能为空'
        },
        {
          name: 'requirements',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请填写验收要求'
        },
        {
          name: 'checkCompany',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择检查单位'
        },
        {
          name: 'checkedCompany',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择受检单位'
        },
        {
          name: 'checkedRepresentative',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择受检方代表'
        },
        {
          name: 'checkDate',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择检查日期'
        },
        {
          name: 'placeName',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入检查部位'
        },
        {
          name: 'checkPerson',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择检查人'
        }
      ],
      /*不合格时校验*/
      resultRule: [
        {
          name: 'describes',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入问题描述'
        },
        {
          name: 'levels',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入问题等级'
        },
        {
          name: 'urgency',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择紧急程度'
        },
        {
          name: 'rectificationRequire',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入整改要求'
        },
        {
          name: 'rectificationTime',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择整改期限'
        },
        {
          name: 'rectificationer',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入整改人'
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
  mounted() {
    this.form.projectId = this.projectId
  },
  methods: {
    //负责人改变
    principleSelected(e) {
      this.form.principal = e.userId
      this.form.principalName = e.userName
    },
    /*选择部门*/
    checkDepartmentSelected(e) {
      console.log('选择部门', e)
      //this.form.checkDepartmentId = e.ids
      this.form.checkDepartmentName = e.name.join(',')
    },
    /*检查单位*/
    checkCompanySelected(e) {
      console.log(e)
      this.form.checkCompany = e.ids.join(',')
      this.form.checkCompanyName = e.name.join(',')
    },
    /*受检单位*/
    checkedCompanySelected(e) {
      this.form.checkedCompany = e.ids.join(',')
      this.form.checkedCompanyName = e.name.join(',')
    },
    /*选择通知人*/
    notificationPersonSelected(e) {
      this.form.notificationPersonIds = e.userId
      this.form.notificationPersonNames = e.userName
    },

    /*受检方代表*/
    checkedRepresentativeSelected(e) {
      this.form.checkedRepresentative = e.userId
      this.form.checkedRepresentativeName = e.userName
    },
    //选中检查人
    handleCheckPersonSelected(e) {
      this.form.checkPerson = e.userId
      this.form.checkPersonName = e.userName
    },
    /*抄送*/
    copyManSelected(e) {
      this.form.copyManIds = e.userId
      this.form.copyManNames = e.userName
    },
    // 选择整改人
    rectificationerSelectedChange(e) {
      this.form.resultAddDTO.rectificationer = e.userId
      this.form.resultAddDTO.rectificationerName = e.userName
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
          vm.checkResultName = selectItem.name
          vm.form.resultAddDTO.checkResult = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    /*等级选择*/
    handleClassItemClick() {
      let vm = this
      let itemList = (this.levels || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.levels[res.tapIndex] || {}
          vm.levelsName = selectItem.name
          vm.form.resultAddDTO.levels = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    /*紧急程度*/
    handleUrgencyItemClick() {
      let vm = this
      let itemList = (this.urgency || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.urgency[res.tapIndex] || {}
          vm.urgencyName = selectItem.name
          vm.form.resultAddDTO.urgency = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    /*危险源选择*/
    handleSourceItemClick() {
      let vm = this
      let itemList = (this.sourceList || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function(res) {
          let selectItem = vm.sourceList[res.tapIndex] || {}
          console.log(selectItem)
          vm.form.dangerSourceNames = selectItem.name
          vm.form.dangerSourceIds = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },

    //检查日期
    bindDateChange: function(e) {
      this.form.checkDate = e.target.value
    },
    /*整改日期*/
    bindrectificationTimeChange: function(e) {
      this.form.resultAddDTO.rectificationTime = e.target.value
    },
    //计划开始日期
    planStartDateChange: function(e) {
      this.form.planStartDate = e.target.value
    },
    //计划结束日期
    planEndDateChange: function(e) {
      this.form.planEndDate = e.target.value
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
    handleFormValid() {
      // 表单验证,施工人数验证是不是整数，项目Id及其他必选参数
      let isValid = true
      let reg = /^1[3456789]\d{9}$/
      if (!this.form.projectId.trim()) {
        this.$utils.showToast('您还没有选择了项目')
        return false
      }
      if (this.form.floorScheduleList.length === 0) {
        this.$utils.showToast('您还没有选择工序')
        return false
      }
      if (this.form.principalContact && !reg.test(this.form.principalContact)) {
        this.$utils.showToast('请输入正确的联系方式')
        isValid = false
      } else if (this.form.resultAddDTO.checkResult === 0) {
        let subInfo = this.form.resultAddDTO || {}
        let subCheckResult = graceChecker.check(subInfo, this.resultRule)
        if (!subCheckResult) {
          this.$utils.showToast(graceChecker.error)
          isValid = false
        }
      } else {
        var checkRes = graceChecker.check(this.form, this.rule)
        if (!checkRes) {
          this.$utils.showToast(graceChecker.error)
          isValid = false
        }
      }

      return isValid
    },
    // 添加数据
    async handleLogSubmit() {
      //    console.log(this.form)
      // return
      // 验证通过，开始提交表单
      let valid = this.handleFormValid()
      if (!valid) return
      let res = await Api.addSafeCivilizationCheck(this.form)
      if (res.code === 200) {
        this.$utils.showToast('添加成功')
        this.handleInitForm()
        this.$utils.goBack()
      }
    },
    // 添加成功后清空表单内容
    handleInitForm() {
      this.form = {
        checkCompany: '',
        checkCompanyName: '',
        checkDate: '',
        checkDays: 0,
        checkDepartmentId: '',
        checkDepartmentName: '',
        checkPerson: '',
        checkPersonName: '',
        checkedCompany: '',
        checkedCompanyName: '',
        checkedRepresentative: '',
        checkedRepresentativeName: '',
        copyManIds: '',
        copyManNames: '',
        dangerSourceIds: '',
        dangerSourceNames: '',
        files: '',
        floorScheduleList: [
          {
            configId: '',
            entityId: '',
            floorId: '',
            floorNum: 0,
            floorScheduleId: '',
            projectId: '',
            targetId: '',
            type: 0
          }
        ],
        notificationPersonIds: '',
        notificationPersonNames: '',
        notificationPersonPhones: '',
        planEndDate: '',
        planStartDate: '',
        projectId: '',
        remark: '',
        requirements: '',
        resultAddDTO: {
          checkDate: '',
          checkPerson: '',
          checkPersonName: '',
          checkResult: 0,
          describes: '',
          files: '',
          levels: 0,
          rectificationRequire: '',
          rectificationTime: '',
          rectificationer: '',
          rectificationerName: '',
          remark: '',
          urgency: 0
        }
      }
      this.form.projectId = this.projectId
    },
    // 选择工序回传事件
    changeProcedure(array) {
      this.form.floorScheduleList = array.filter(item => item)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./add.less');
</style>
