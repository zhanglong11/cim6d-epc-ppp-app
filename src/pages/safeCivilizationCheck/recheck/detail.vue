<template>
  <view class="main">
    <div class="main-header">
      <uni-steps :options="stepsOptions" :active="activeID"></uni-steps>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view>
          <!--整改填写 start-->
          <view v-if="status == 0" class="card">
            <uni-form-item label="整改人" isLink isRequired>
              <uni-select-user
                v-model="form.rectificationer"
                class="align-right"
                placeholder="点击选择"
                @change="rectificationerSelectedChange"
              />
            </uni-form-item>
            <uni-form-item label="整改内容" isLink isRequired>
              <textarea
                v-model.trim="form.rectificationContent"
                auto-height
                :maxlength="-1"
                class="align-right"
                placeholder="请输入"
                name="rectificationContent"
              />
            </uni-form-item>
            <uni-form-item label="抄送" isLink>
              <uni-select-user
                v-model.trim="form.copyManNames"
                class="align-right"
                placeholder="请输入"
                name="principalName"
              />
            </uni-form-item>
            <uni-form-item label="整改时间" isLink isRequired>
              <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindUpdateDateChange">
                <view class="uni-input align-right">{{ date || '请选择时间' }}</view>
              </picker>
            </uni-form-item>
            <uni-form-item label="备注" isLink>
              <textarea
                v-model.trim="form.recordPersonName"
                class="align-right"
                placeholder="点击输入备注信息"
                name="recordPersonName"
                :maxlength="-1"
                auto-height
              />
            </uni-form-item>
            <uni-form-item class="file-item" label="上传附件">
              <uni-attachment v-model="form.files" edit></uni-attachment>
            </uni-form-item>
          </view>
          <!--整改 填写 end-->
          <view v-if="recheckDetailList" class="card">
            <h4>检查计划信息</h4>
            <uni-form-item label="检查计划">
              <view>{{ planDetailList.planName }}</view>
            </uni-form-item>
            <uni-form-item label="计划编号">
              <view>{{ planDetailList.planNumber }}</view>
            </uni-form-item>
            <uni-form-item label="检查性质">
              <span>{{
                ['临时检查', '一般检查', '阶段性检查', '专项检查'][Number(planDetailList.checkNature) - 1]
              }}</span>
              <!--                            <view v-if="planDetailList.checkNature == 1">临时检查</view>-->
              <!--                            <view v-if="planDetailList.checkNature == 2">一般检查</view>-->
              <!--                            <view v-if="planDetailList.checkNature == 3">阶段性检查</view>-->
              <!--                            <view v-if="planDetailList.checkNature == 4">专业性检查</view>-->
            </uni-form-item>
            <!--                        <uni-form-item label="单体名称">-->
            <!--                            <view>{{ itemInfo.checkPersonName }}</view>-->
            <!--                        </uni-form-item>-->
            <!--                        <uni-form-item label="楼层名称">-->
            <!--                            <view>{{ itemInfo.checkPersonName }}</view>-->
            <!--                        </uni-form-item>-->
            <!--                        <uni-form-item label="工序名称">-->
            <!--                            <view>{{ itemInfo.checkPersonName }}</view>-->
            <!--                        </uni-form-item>-->
            <uni-form-item label="验收要求">
              <view>{{ recheckDetailList.checkDTO.requirements }}</view>
            </uni-form-item>
            <uni-form-item label="检查单位">
              <view>{{ recheckDetailList.checkDTO.checkCompanyName }}</view>
            </uni-form-item>
            <uni-form-item label="受检单位">
              <view>{{ recheckDetailList.checkDTO.checkedCompanyName }}</view>
            </uni-form-item>
            <uni-form-item label="受检方代表">
              <view>{{ recheckDetailList.checkDTO.checkedRepresentativeName }}</view>
            </uni-form-item>
            <uni-form-item label="危险源">
              <view>{{ planDetailList.dangerSourceNames }}</view>
            </uni-form-item>

            <uni-form-item label="通知人">
              <view>{{ planDetailList.notificationPersonNames }}</view>
            </uni-form-item>
            <uni-form-item label="通知手机号">
              <view>{{ planDetailList.notificationPersonPhones }}</view>
            </uni-form-item>
            <uni-form-item label="计划日期">
              <view
                >{{ planDetailList.planStartDate | formatData }} - {{ planDetailList.planEndDate | formatData }}</view
              >
            </uni-form-item>
            <uni-form-item label="备注">
              <view>{{ planDetailList.remark }}</view>
            </uni-form-item>
            <uni-form-item label="附件">
              <uni-form-item label="附件" :border="false" align="left">
                <uni-attachment v-if="planDetailList.files" v-model="planDetailList.files"></uni-attachment>
              </uni-form-item>
            </uni-form-item>
          </view>

          <!--整改合格的检查结果 start-->
          <view v-if="recheckDetailList" class="card">
            <h4>检查结果</h4>
            <uni-form-item label="检查结果">
              <view>{{ recheckDetailList.checkDTO.checkStatus == 1 ? '合格' : '不合格' }}</view>
            </uni-form-item>
            <block v-if="recheckDetailList.checkDTO.checkResult != 1">
              <uni-form-item label="问题描述">
                <view>{{ recheckDetailList.checkDTO.checkResultDTO.describes }}</view>
              </uni-form-item>
              <uni-form-item label="问题等级">
                <view v-if="recheckDetailList.checkDTO.checkResultDTO.levels == 1">一级</view>
                <view v-else-if="recheckDetailList.checkDTO.checkResultDTO.levels == 2">二级</view>
                <view v-else-if="recheckDetailList.checkDTO.checkResultDTO.levels == 3">三级</view>
                <view v-else-if="recheckDetailList.checkDTO.checkResultDTO.levels == 4">四级</view>
              </uni-form-item>
              <uni-form-item label="紧急程度">
                <view v-if="recheckDetailList.checkDTO.checkResultDTO.urgency == 1">一般隐患</view>
                <view v-else-if="recheckDetailList.checkDTO.checkResultDTO.urgency == 2">较大隐患</view>
                <view v-else-if="recheckDetailList.checkDTO.checkResultDTO.urgency == 3">严重隐患</view>
                <view v-else-if="recheckDetailList.checkDTO.checkResultDTO.urgency == 4">重大隐患</view>
              </uni-form-item>
              <uni-form-item label="整改要求">
                <view>{{ recheckDetailList.checkDTO.checkResultDTO.rectificationRequire }}</view>
              </uni-form-item>
              <uni-form-item label="整改期限">
                <view>{{ recheckDetailList.rectificationPeriodTime | formatData }}</view>
              </uni-form-item>
              <uni-form-item label="整改人">
                <view>{{ recheckDetailList.checkDTO.checkResultDTO.rectificationerName }}</view>
              </uni-form-item>
            </block>
            <uni-form-item label="备注">
              <view>{{ recheckDetailList.checkDTO.checkResultDTO.remark }}</view>
            </uni-form-item>
            <uni-form-item label="附件">
              <uni-attachment v-model="recheckDetailList.checkDTO.checkResultDTO.files"></uni-attachment>
            </uni-form-item>
            <view class="line"></view>
            <uni-form-item label="检查人">
              <view>{{ recheckDetailList.checkDTO.checkResultDTO.checkPersonName }}</view>
            </uni-form-item>
            <uni-form-item label="抄送">
              <view>{{ recheckDetailList.checkDTO.checkResultDTO.carbonCopies }}</view>
            </uni-form-item>
            <uni-form-item label="检查日期">
              <view>{{ recheckDetailList.checkDTO.checkResultDTO.checkDate | formatData }}</view>
            </uni-form-item>
          </view>
          <!--整改合格的检查结果 end-->
          <!--整改信息 start-->
          <view v-if="recheckDetailList" class="card">
            <h4>整改信息</h4>
            <uni-form-item label="整改状态">
              <span>{{ ['未整改', '整改'][Number(recheckDetailList.rectificationStatus)] }}</span>
            </uni-form-item>
            <uni-form-item label="整改内容">
              <view>{{ recheckDetailList.rectificationContent }}</view>
            </uni-form-item>
            <uni-form-item label="备注">
              <view>{{ recheckDetailList.rectificationResult[0].remark }}</view>
            </uni-form-item>
            <uni-form-item label="附件">
              <uni-attachment v-model="recheckDetailList.rectificationResult[0].files"></uni-attachment>
            </uni-form-item>
            <view class="line"></view>
            <uni-form-item label="整改人">
              <view>{{ recheckDetailList.rectificationResult[0].rectificationerName }}</view>
            </uni-form-item>
            <uni-form-item label="抄送">
              <view>{{ recheckDetailList.rectificationResult[0].carbonCopies }}</view>
            </uni-form-item>
            <uni-form-item label="整改时间">
              <view>{{ recheckDetailList.rectificationResult[0].rectificationTime | formatData }}</view>
            </uni-form-item>
          </view>
          <!--整改信息 end-->
          <!--复查信息详情 start-->
          <view v-if="recheckDetailList" class="card">
            <h4>复查结果</h4>
            <uni-form-item label="检查结果">
              <view>{{ ['不合格', '合格'][Number(recheckDetailList.recheckResult[0].checkResult)] }}</view>
            </uni-form-item>
            <uni-form-item label="问题描述">
              <view>{{ recheckDetailList.recheckResult[0].describes }}</view>
            </uni-form-item>
            <uni-form-item label="整改期限">
              <view>{{ recheckDetailList.recheckResult[0].rectificationTime | formatData }}</view>
            </uni-form-item>
            <view class="line"></view>
            <uni-form-item label="整改人">
              <view>{{ recheckDetailList.recheckResult[0].rectificationerName }}</view>
            </uni-form-item>
            <uni-form-item label="备注">
              <view>{{ recheckDetailList.recheckResult[0].remark }}</view>
            </uni-form-item>
            <uni-form-item label="附件">
              <uni-attachment v-model="recheckDetailList.recheckResult[0].files"></uni-attachment>
            </uni-form-item>
            <view class="line"></view>
            <uni-form-item label="检查人">
              <view>{{ recheckDetailList.checkPersonName }}</view>
            </uni-form-item>

            <uni-form-item label="抄送">
              <view>{{ recheckDetailList.recheckResult[0].carbonCopies }}</view>
            </uni-form-item>
            <uni-form-item label="检查日期">
              <view>{{ recheckDetailList.recheckResult[0].checkDate | formatData }}</view>
            </uni-form-item>
          </view>
          <!--复查信息详情 end-->
        </view>

        <view class="btn-wrapper">
          <button v-if="status == 0" class="button" type="primary" :loading="isLoading" @click="handleLogSubmit()">
            保存
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
var graceChecker = require('@/utils/graceChecker.js')
import { safeApi } from '@/api/safe'
import uniSteps from '@/components/uni-steps/uni-steps'
import { mapGetters } from 'vuex'
export default {
  components: {
    uniSteps
  },
  data() {
    return {
      form: {
        checkId: '',
        checkResult: 0,
        files: '',
        id: '',
        projectId: '',
        rectificationTime: '',
        rectificationer: '',
        rectificationerName: '',
        remark: '',
        safetySourceId: ''
      },
      date: null,
      isLoading: false,
      status: 0,
      activeID: 1,
      stepsOptions: [],
      passSteps: [{ title: '检查计划' }, { title: '检查通过' }],
      steps: [{ title: '检查计划' }, { title: '检查未通过' }, { title: '整改' }, { title: '复检' }],
      recheckSteps: [
        { title: '检查计划' },
        { title: '检查未通过' },
        { title: '整改' },
        { title: '复检未通过' },
        { title: '整改' },
        { title: '复检' }
      ],
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
      itemID: '', //当前检查项的Id
      /* 安全计划详情*/
      planDetailList: [],
      /*安全复检详情*/
      recheckDetailList: '',
      /*信息验证*/
      rule: [
        {
          name: 'rectificationer',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择整改人'
        },
        {
          name: 'rectificationTime',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择整改时间'
        },
        {
          name: 'rectificationContent',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入整改内容'
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
    let params = JSON.parse(options.obj)
    this.init(params)
    // this.init(options)
  },
  onShow() {},
  mounted() {
    this.form.projectId = this.projectId
  },
  methods: {
    //初始化页面参数
    init(options) {
      this.itemID = options.id || ''
      this.recordId = options.recordId || ''
      this.status = options.status || ''
      this.planId = options.planId || ''
      this.initStepsInfoList(this.status)
      this.queryRecheckInfo()
      this.safePlanInfo()

      // this.initStepsInfo(this.status)
    },

    // 初始化步骤条信息
    initStepsInfoList(status) {
      if (status == 0) {
        /*不合格 检查*/
        this.activeID = 3
        this.stepsOptions = [...this.recheckSteps]
      } else {
        /*合格 检查*/
        this.activeID = 1
        this.stepsOptions = [...this.steps]
        this.stepsOptions[2].title = '已整改'
        this.stepsOptions[2].title = '复检通过'
        this.activeID = 3
      }
    },
    // 获取检查项信息

    /*复检详情*/
    async queryRecheckInfo() {
      let res = await safeApi.queryRecheckItemInfo(this.recordId)
      if (res.code == 200) {
        this.recheckDetailList = res.data
        if (!res.data.rectificationResult) {
          return
        }
        this.form.checkId = res.data.rectificationResult.checkId
        this.form.id = res.data.rectificationResult.id
        this.form.safetySourceId = res.data.rectificationResult.safetySourceId
      } else {
        this.$utils.showToast(res.message())
      }
    },
    /*安全计划详情*/
    async safePlanInfo() {
      let planData = await safeApi.queryPlanItemInfo(this.planId)
      this.planDetailList = planData.data
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
          vm.form.inspectText = selectItem.name
          vm.form.inspectValue = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选择整改人
    rectificationerSelectedChange(e) {
      this.form.rectificationer = e.userId
      this.form.rectificationerName = e.userName
    },
    /*整改日期*/
    bindUpdateDateChange: function(e) {
      this.date = e.target.value
      this.form.rectificationTime = e.target.value + ' 00:00:00'
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
      var checkRes = graceChecker.check(this.form, this.rule)
      if (!checkRes) {
        this.$utils.showToast(graceChecker.error)
        isValid = false
      }
      return isValid
    },
    // 添加数据
    // 添加数据
    async handleLogSubmit() {
      // 验证通过，开始提交表单
      let valid = this.handleFormValid()
      if (!valid) return
      let res = await safeApi.rectificationFormSubmit(this.form)

      if (res.code == 200) {
        this.$utils.showToast('添加成功')
        this.handleInitForm()
        this.$utils.goBack()
      }
    },
    // 添加成功后清空表单内容
    handleInitForm() {
      this.form = {
        checkId: '',
        checkResult: 0,
        files: '',
        id: '',
        projectId: '',
        rectificationTime: '',
        rectificationer: '',
        rectificationerName: '',
        remark: '',
        safetySourceId: ''
      }
      this.form.projectId = this.projectId
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../detail.less');
</style>
