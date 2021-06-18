<template>
  <view class="main">
    <div class="main-header">
      <uni-steps :options="stepsOptions" :active="activeID"></uni-steps>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view>
          <!--复检填写 start-->
          <view v-if="status == 0" class="card">
            <uni-form-item label="复检日期" isLink isRequired>
              <picker
                mode="date"
                :value="planStartDate"
                :start="startDate"
                :end="endDate"
                @change="bindUpdateDateChange"
              >
                <view class="uni-input align-right">{{ planStartDate || '请选择时间' }}</view>
              </picker>
            </uni-form-item>

            <uni-form-item label="检查人" isLink isRequired>
              <uni-select-user
                v-model.trim="form.recheckerName"
                class="align-right"
                placeholder="请输入"
                name="principalName"
              />
            </uni-form-item>
            <uni-form-item label="抄送" isLink>
              <uni-select-user
                v-model.trim="form.carbonCopyNames"
                class="align-right"
                placeholder="请输入"
                name="principalName"
              />
            </uni-form-item>
            <uni-form-item label="复检结果" isLink isRequired>
              <view class="align-right" name="checkResultName" @click="handleResultItemClick">{{
                checkResultName || '点击选择'
              }}</view>
            </uni-form-item>
            <!--如果不合格显示如下内容 start-->
            <view v-if="form.checkResult == 0">
              <uni-form-item label="问题描述" isRequired isLink>
                <textarea auto-height :maxlength="-1" class="align-right" placeholder="点击输入问题描述" />
              </uni-form-item>
              <!--                            <uni-form-item label="整改期限" isLink isRequired>-->
              <!--                                <picker-->
              <!--                                        mode="date"-->
              <!--                                        :value="updateDate"-->
              <!--                                        :start="startDate"-->
              <!--                                        :end="endDate"-->
              <!--                                        @change="bindrectificationTimeChange"-->
              <!--                                >-->
              <!--                                    <view class="uni-input align-right">{{ updateDate || '点击选择' }}</view>-->
              <!--                                </picker>-->
              <!--                            </uni-form-item>-->
            </view>
            <!--如果不合格显示如下内容 end-->
            <uni-form-item label="备注" isLink>
              <textarea
                v-model.trim="form.remark"
                class="align-right"
                auto-height
                placeholder="点击输入备注信息"
                name="recordPersonName"
                :maxlength="-1"
              />
            </uni-form-item>
            <uni-form-item class="file-item" label="上传附件">
              <uni-attachment v-model="form.files" edit></uni-attachment>
            </uni-form-item>
          </view>
          <!--复检填写 end-->
          <view v-if="rectificationDetailList" class="card">
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
              <view>{{ rectificationDetailList.checkDTO.requirements }}</view>
            </uni-form-item>
            <uni-form-item label="检查单位">
              <view>{{ rectificationDetailList.checkDTO.checkCompanyName }}</view>
            </uni-form-item>
            <uni-form-item label="受检单位">
              <view>{{ rectificationDetailList.checkDTO.checkedCompanyName }}</view>
            </uni-form-item>
            <uni-form-item label="受检方代表">
              <view>{{ rectificationDetailList.checkDTO.checkedRepresentativeName }}</view>
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
          <view v-if="rectificationDetailList" class="card">
            <h4>检查结果</h4>
            <uni-form-item label="检查结果">
              <view>{{ rectificationDetailList.checkDTO.checkResultDTO.checkResult == 1 ? '合格' : '不合格' }}</view>
            </uni-form-item>
            <block v-if="rectificationDetailList.checkDTO.checkResultDTO.checkResult != 1">
              <uni-form-item label="问题描述">
                <view>{{ rectificationDetailList.checkDTO.checkResultDTO.describes }}</view>
              </uni-form-item>
              <uni-form-item label="问题等级">
                <view v-if="rectificationDetailList.checkDTO.checkResultDTO.levels == 1">一级</view>
                <view v-else-if="rectificationDetailList.checkDTO.checkResultDTO.levels == 2">二级</view>
                <view v-else-if="rectificationDetailList.checkDTO.checkResultDTO.levels == 3">三级</view>
                <view v-else-if="rectificationDetailList.checkDTO.checkResultDTO.levels == 4">四级</view>
              </uni-form-item>
              <uni-form-item label="紧急程度">
                <view v-if="rectificationDetailList.checkDTO.checkResultDTO.urgency == 1">一般隐患</view>
                <view v-else-if="rectificationDetailList.checkDTO.checkResultDTO.urgency == 2">较大隐患</view>
                <view v-else-if="rectificationDetailList.checkDTO.checkResultDTO.urgency == 3">严重隐患</view>
                <view v-else-if="rectificationDetailList.checkDTO.checkResultDTO.urgency == 4">重大隐患</view>
              </uni-form-item>
              <uni-form-item label="整改要求">
                <view>{{ rectificationDetailList.checkDTO.checkResultDTO.rectificationRequire }}</view>
              </uni-form-item>
              <uni-form-item label="整改期限">
                <view>{{ rectificationDetailList.rectificationPeriodTime | formatData }}</view>
              </uni-form-item>
              <uni-form-item label="整改人">
                <view>{{ rectificationDetailList.checkDTO.checkResultDTO.rectificationerName }}</view>
              </uni-form-item>
            </block>
            <uni-form-item label="备注">
              <view>{{ rectificationDetailList.checkDTO.checkResultDTO.remark }}</view>
            </uni-form-item>
            <uni-form-item label="附件">
              <uni-attachment v-model="rectificationDetailList.checkDTO.checkResultDTO.files"></uni-attachment>
            </uni-form-item>
            <view class="line"></view>
            <uni-form-item label="检查人">
              <view>{{ rectificationDetailList.checkPersonName }}</view>
            </uni-form-item>
            <uni-form-item label="抄送">
              <view>{{ rectificationDetailList.checkDTO.checkResultDTO.carbonCopies }}</view>
            </uni-form-item>
            <uni-form-item label="检查日期">
              <view>{{ rectificationDetailList.checkDTO.checkResultDTO.checkDate | formatData }}</view>
            </uni-form-item>
          </view>
          <!--整改合格的检查结果 end-->
          <!--整改信息 start-->
          <view v-if="rectificationDetailList" class="card">
            <h4>整改信息</h4>
            <uni-form-item label="整改状态">
              <!--                            <view>{{ rectificationDetailList.rectificationStatus }}</view>-->
              <span>{{ ['未整改', '整改'][Number(rectificationDetailList.rectificationStatus)] }}</span>
            </uni-form-item>
            <uni-form-item label="整改内容">
              <view>{{ rectificationDetailList.rectificationContent | formatData }}</view>
            </uni-form-item>
            <uni-form-item label="备注">
              <view>{{ rectificationDetailList.remark }}</view>
            </uni-form-item>
            <uni-form-item label="附件">
              <uni-attachment v-model="rectificationDetailList.rectificationResult[0].files"></uni-attachment>
            </uni-form-item>
            <view class="line"></view>
            <uni-form-item label="整改人">
              <view>{{ rectificationDetailList.rectificationerName }}</view>
            </uni-form-item>
            <uni-form-item label="抄送">
              <view>{{ rectificationDetailList.rectificationResult[0].carbonCopies }}</view>
            </uni-form-item>
            <uni-form-item label="整改时间">
              <view>{{ rectificationDetailList.rectificationResult[0].rectificationTime | formatData }}</view>
            </uni-form-item>
          </view>
          <!--整改信息 end-->
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
        carbonCopyIds: '',
        carbonCopyNames: '',
        checkId: '',
        checkResult: 1,
        files: '',
        id: '',
        projectId: '',
        rechecker: '',
        recheckerName: '',
        rectificationTime: '',
        remark: '',
        safetySourceId: ''
      },
      checkResultName: '',
      date: null,
      planStartDate: null,
      updateDate: null,
      isLoading: false,
      status: 0,
      activeID: 2,
      stepsOptions: [],
      passSteps: [{ title: '检查计划' }, { title: '检查通过' }],
      steps: [{ title: '检查计划' }, { title: '检查未通过' }, { title: '整改' }, { title: '复检' }],
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
      /*整改信息详情*/
      rectificationDetailList: '',
      recordId: [],
      /*信息验证*/
      rule: [
        {
          name: 'recheckerName',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择检查人'
        },
        {
          name: 'rectificationTime',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择整改时间'
        },
        {
          name: 'rectificationTime',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择复查结果'
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
      console.log(this.recordId)
      this.status = options.status || ''
      this.planId = options.planId || ''
      this.initStepsInfoList(this.status)
      this.getRectificationInfo()
      this.safePlanInfo()
      // this.initStepsInfo(this.status)
    },

    // 初始化步骤条信息
    initStepsInfoList(status) {
      if (status == 0) {
        /*不合格 检查*/
        // this.$utils.setTitle('安全整改')
        this.activeID = 1
        this.stepsOptions = [...this.steps]
        this.stepsOptions[2].title = '已整改'
        this.activeID = 2
      } else {
        /*合格 检查*/
        this.activeID = 1
        this.stepsOptions = [...this.steps]
        this.stepsOptions[2].title = '已整改'
        this.activeID = 2
      }
    },

    /*整改人详情*/
    async getRectificationInfo() {
      let res = await safeApi.getRectificationInfo(this.recordId)
      if (res.code == 200) {
        this.rectificationDetailList = res.data || {}
        if (!res.data.recheckResult) {
          return
        }
        this.form.checkId = es.data.recheckResult.checkId
        this.form.id = res.data.recheckResult.id
        this.form.safetySourceId = res.data.recheckResult.safetySourceId
      }
    },
    /*安全计划详情*/
    async safePlanInfo() {
      let planData = await safeApi.queryPlanItemInfo(this.planId)
      this.planDetailList = planData.data
    },
    /*整改日期*/
    bindrectificationTimeChange: function(e) {
      this.form.rectificationTime = e.target.value
    },
    /*复检日期*/
    bindUpdateDateChange: function(e) {
      this.planStartDate = e.target.value
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
    async handleLogSubmit() {
      // 验证通过，开始提交表单
      let valid = this.handleFormValid()
      if (!valid) return
      this.form.fillInDate = this.date + ' 00:00:00'
      let res = await safeApi.recheckFormSubmit(this.form)
      if (res.code == 200) {
        this.$utils.showToast('添加成功')
        this.handleInitForm()
        this.$utils.goBack()
      }
      // let result = await logApi.editLogItem(this.form)
    },
    //选择复检检查结果
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
          vm.form.checkResult = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 添加成功后清空表单内容
    handleInitForm() {
      this.form = {
        carbonCopyIds: '',
        carbonCopyNames: '',
        checkId: '',
        checkResult: 1,
        files: '',
        id: '',
        projectId: '',
        rechecker: '',
        recheckerName: '',
        rectificationTime: '',
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
