<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view>
          <uni-card isForm>
            <uni-form-item label="检查计划" isRequired>
              <view>{{ planInfo.civilizationNumber }}-{{ planInfo.civilizationName }}</view>
            </uni-form-item>
            <uni-form-item label="计划编号" align="left">
              <view>{{ planInfo.civilizationNumber }}</view>
            </uni-form-item>
            <!-- 暂不显示,请勿删除 -->
            <uni-form-item label="单体名称" :border="false" align="left">
              <view>{{ planInfo.checkPersonName }}</view>
            </uni-form-item>
            <uni-form-item label="楼层名称" :border="false" align="left">
              <view>{{ planInfo.checkPersonName }}</view>
            </uni-form-item>
            <uni-form-item label="工序名称" :border="false" align="left">
              <view>{{ planInfo.checkPersonName }}</view>
            </uni-form-item>
            <uni-form-item label="负责人" align="left">
              <view>{{ planInfo.principalName }}</view>
            </uni-form-item>
            <uni-form-item label="负责人联系方式" align="left">
              <view>{{ planInfo.principalContact }}</view>
            </uni-form-item>
            <uni-form-item label="验收要求" align="left">
              <view>{{ planInfo.requirements }}</view>
            </uni-form-item>
            <uni-form-item label="安全文明管理目标" align="left">
              <view>{{ planInfo.civilizationTarget }}</view>
            </uni-form-item>
            <uni-form-item label="检查单位" :border="false" align="left">
              <view>{{ planInfo.checkCompanyName }}</view>
            </uni-form-item>
            <uni-form-item label="受检单位" :border="false" align="left">
              <view>{{ planInfo.checkedCompanyName }}</view>
            </uni-form-item>
            <uni-form-item label="受检方代表" :border="false" align="left">
              <view>{{ planInfo.checkedRepresentativeName }}</view>
            </uni-form-item>
          </uni-card>
          <uni-card isForm>
            <uni-form-item label="检查日期" isLink isRequired>
              <picker
                mode="date"
                name="checkDate"
                :value="checkDate"
                :start="startDate"
                :end="endDate"
                @change="bindCheckDateChange"
              >
                <view>{{ checkDate || '请选择时间' }}</view>
              </picker>
            </uni-form-item>
            <uni-form-item label="检查人" isLink isRequired>
              <uni-select-user
                v-model="form.checkPerson"
                name="checkPerson"
                placeholder="点击选择"
                @change="handleCheckPersonSelect"
              ></uni-select-user>
            </uni-form-item>
            <uni-form-item label="抄送人" isLink>
              <uni-select-user v-model="form.copyManIds" multiple @change="copyManSelected"></uni-select-user>
            </uni-form-item>
            <uni-form-item label="检查结果" isRequired isLink>
              <view name="checkResultText" @click="handleResultItemClick">{{
                resultInfo.checkResultText || '点击选择'
              }}</view>
            </uni-form-item>
          </uni-card>
          <!--不合格显示以下模块-->
          <uni-card v-if="resultInfo.checkResult == 0" isForm>
            <uni-form-item label="问题描述" isRequired>
              <textarea
                v-model.trim="resultInfo.describes"
                :maxlength="-1"
                auto-height
                placeholder="点击输入问题描述"
                name="describes"
              />
            </uni-form-item>
            <uni-form-item label="问题等级" isRequired isLink>
              <view name="levelsName" @click="handleFailLevelItemClick">{{ resultInfo.levelsName || '点击选择' }}</view>
            </uni-form-item>
            <uni-form-item label="紧急程度" isRequired isLink>
              <view name="urgency" @click="handleFailUrgencyItemClick">{{ resultInfo.urgencyName || '点击选择' }}</view>
            </uni-form-item>
            <uni-form-item label="整改要求" isRequired>
              <textarea
                v-model="resultInfo.rectificationRequire"
                :maxlength="-1"
                auto-height
                placeholder="点击输入整改要求"
                name="rectificationRequire"
              />
            </uni-form-item>
            <uni-form-item label="整改期限" isLink isRequired>
              <picker
                mode="date"
                name="rectificationTime"
                :value="rectificationTime"
                :start="startDate"
                :end="endDate"
                @change="bindRectificationTimeChange"
              >
                <view class="uni-input align-right">{{ resultInfo.rectificationTime || '点击选择' }}</view>
              </picker>
            </uni-form-item>
            <uni-form-item label="整改人" isRequired isLink>
              <uni-select-user
                v-model="resultInfo.rectificationer"
                placeholder="点击选择"
                name="rectificationer"
                @change="handleRectificationerSelect"
              />
            </uni-form-item>
          </uni-card>
          <!-- 附件上传 -->
          <view class="card-body">
            <uni-form-item label="备注" type="textarea" align="left">
              <textarea v-model.trim="resultInfo.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height
            /></uni-form-item>
            <uni-form-item class="file-item" label="上传附件">
              <uni-attachment v-model="resultInfo.files" edit></uni-attachment>
            </uni-form-item>
          </view>
        </view>
      </view>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSubmit">保存</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
var graceChecker = require('../../utils/graceChecker.js')
import Api from '../../api/safeCivilizationCheck'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      planInfo: {},
      planId: '',
      form: {
        checkCompany: '',
        checkCompanyName: '',
        checkDate: '',
        checkPerson: '',
        checkPersonName: '',
        checkedCompany: '',
        checkedCompanyName: '',
        checkedRepresentative: '',
        checkedRepresentativeName: '',
        files: '',
        id: '',
        projectId: '',
        remark: '',
        requirements: '',
        safetyPlanId: '',
        safetyPlanNum: ''
      },
      resultInfo: {
        checkPerson: '',
        checkPersonName: '',
        checkResult: null,
        checkResultText: '',
        describes: '',
        files: '',
        rectificationRequire: '',
        rectificationTime: '',
        rectificationer: '',
        rectificationerName: '',
        remark: '',
        levels: null,
        levelsName: '',
        urgency: '',
        urgencyName: ''
      },
      checkDate: null,
      rectificationTime: null, //整改时限
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
          name: 'checkDate',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择检查日期'
        },
        {
          name: 'checkPerson',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择检查人'
        }
      ],
      resultRules: [
        {
          name: 'checkResultText',
          checkType: 'in',
          checkRule: '合格,不合格',
          errorMsg: '请输入检查结果'
        }
      ],
      subRules: [
        {
          name: 'describes',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入问题描述'
        },
        {
          name: 'levelsName',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入问题等级'
        },
        {
          name: 'urgencyName',
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
          name: 'rectificationTime',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择整改期限'
        },
        {
          name: 'rectificationer',
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
  onLoad(options) {
    this.init(options)
    this.form.projectId = this.projectId
  },
  onShow() {
    this.checkPlanItemInfo(this.planId)
  },
  methods: {
    init(options) {
      this.planId = options.id
      this.form.projectId = this.projectId
      this.checkDate = moment().format('YYYY-MM-DD')
      this.form.checkDate = `${moment().format('YYYY-MM-DD')} 00:00:00`
    },
    // 选中收件单位
    checkDepartmentSelected(data) {
      this.form.checkedCompany = (data.ids || []).join(',')
      this.form.checkedCompanyName = (data.name || []).join(',')
    },
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
          vm.resultInfo.levelsName = selectItem.name
          vm.resultInfo.levels = selectItem.value
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
          vm.resultInfo.urgencyName = selectItem.name
          vm.resultInfo.urgency = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
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
          vm.resultInfo.checkResultText = selectItem.name
          vm.resultInfo.checkResult = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //选中检查人
    handleCheckPersonSelect(data) {
      this.form.checkPerson = data.userId
      this.form.checkPersonName = data.userName
    },
    // 选中抄送人
    /*抄送*/
    copyManSelected(e) {
      this.form.copyManIds = e.userId
      this.form.copyManNames = e.userName
    },
    // 选中整改人
    handleRectificationerSelect(data) {
      this.resultInfo.rectificationer = data.userId
      this.resultInfo.checkedRepresentativeName = data.userName
    },
    // 选中受检方代表
    handleRepresentativeSelect(data) {
      this.form.checkedRepresentative = data.userId
      this.form.rectificationerName = data.userName
    },
    //检查日期
    bindCheckDateChange(e) {
      this.checkDate = e.target.value
      this.form.checkDate = `${e.target.value} 00:00:00`
    },
    // 选中整改期限
    bindRectificationTimeChange(e) {
      this.rectificationTime = e.target.value
      this.resultInfo.rectificationTime = `${e.target.value} 00:00:00`
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
      let msg
      if (!this.form.projectId.trim()) {
        msg = '您还没有选择了项目'
        isValid = false
      } else {
        let representRes = graceChecker.check(this.form, this.rules)
        if (!representRes) {
          msg = graceChecker.error
          isValid = false
        } else {
          let resultStatus = graceChecker.check(this.resultInfo, this.resultRules)
          if (!resultStatus) {
            msg = graceChecker.error
            isValid = false
          } else if (this.resultInfo.checkResult === 0) {
            let subRes = graceChecker.check(this.resultInfo, this.subRules)
            if (!subRes) {
              msg = graceChecker.error
              isValid = false
            }
          }
        }
      }
      if (!isValid) {
        this.$utils.showToast(msg)
      }
      return isValid
    },
    /*选择计划列表查看*/
    async checkPlanItemInfo(id) {
      let res = await Api.queryPlanItemInfo(id)
      this.planInfo = res.data || {}
      this.form.safetyPlanId = this.planId
      this.form.safetyPlanNum = this.planInfo.planNumber
    },
    // 添加数据
    async handleSubmit() {
      // 验证通过，开始提交表单
      let valid = this.handleFormValid()
      if (!valid) return
      this.form.resultAddDTO = this.resultInfo
      let result = await Api.handleSubmitCheckedInfo(this.form)
      if (result.code === 200) {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          uni.navigateBack({ delta: 2 })
        }, 500)
      }
    },
    // 添加成功后清空表单内容
    handleInitForm() {
      this.form = {}
      this.form.projectId = this.projectId
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../styles/common.less');
@import url('../../styles/main.less');
.main {
  padding: 20px 25px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  box-sizing: border-box;
  position: relative;
  .card-body {
    width: 700px;
    line-height: 48px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(11, 75, 159, 0.13);
    border-radius: 10px;
    &:not(:first-child) {
      margin-top: 30px;
    }
    .form-item {
      position: relative;
    }
    .uni-input {
      color: #1670e1;
    }
  }
}
</style>
