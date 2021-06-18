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
                :maxlength="-1"
                auto-height
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
          <!--整改 填写 end-->

          <view class="card">
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
              <view>{{ itemInfo.requirements }}</view>
            </uni-form-item>
            <uni-form-item label="检查单位">
              <view>{{ itemInfo.checkCompanyName }}</view>
            </uni-form-item>
            <uni-form-item label="受检单位">
              <view>{{ itemInfo.checkedCompanyName }}</view>
            </uni-form-item>
            <uni-form-item label="受检方代表">
              <view>{{ itemInfo.checkedRepresentativeName }}</view>
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
              <view>{{ planDetailList.planStartDate | formatData }}-{{ planDetailList.planEndDate | formatData }}</view>
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
          <!--检查合格的检查结果 start-->
          <view class="card">
            <h4>检查结果</h4>
            <uni-form-item label="检查结果">
              <view>{{ itemInfo.checkResultDTO.checkResult == 1 ? '通过' : '不通过' }}</view>
            </uni-form-item>
            <uni-form-item label="备注">
              <view>{{ itemInfo.checkResultDTO.remark }}</view>
            </uni-form-item>
            <uni-form-item label="附件">
              <uni-attachment v-model="itemInfo.checkResultDTO.files"></uni-attachment>
            </uni-form-item>
            <view class="line"></view>
            <uni-form-item label="检查人">
              <view>{{ itemInfo.checkResultDTO.checkPersonName }}</view>
            </uni-form-item>
            <uni-form-item label="抄送">
              <view>{{ itemInfo.checkResultDTO.carbonCopies }}</view>
            </uni-form-item>
            <uni-form-item label="检查日期">
              <view>{{ itemInfo.checkResultDTO.checkDate | formatData }}</view>
            </uni-form-item>
          </view>
          <!--检查合格的检查结果 end-->
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
      planId: '',
      itemInfo: {
        checkResultDTO: {}
      }, //当前检查项的信息
      /* 安全计划详情*/
      planDetailList: [],
      /*整改信息详情*/
      rectificationDetailList: [],
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
      this.queryItemInfo(this.status)
      this.safePlanInfo()
    },

    // 初始化步骤条信息
    initStepsInfoList(status) {
      if (status == 0) {
        /*不合格 检查*/
        this.$utils.setTitle('安全整改')
        this.activeID = 1
        this.stepsOptions = [...this.steps]
      } else {
        /*合格 检查*/
        this.activeID = 1
        this.stepsOptions = [...this.passSteps]
      }
    },
    // 获取检查项信息
    async queryItemInfo() {
      let res = await safeApi.queryCheckItemInfo(this.recordId)
      if (res.code == 200) {
        this.itemInfo = res.data || {}
        if (!res.data.rectificationResult) {
          return
        }
        this.form.checkId = res.data.rectificationResult.checkId
        this.form.id = res.data.rectificationResult.id
        this.form.safetySourceId = res.data.rectificationResult.safetySourceId
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
