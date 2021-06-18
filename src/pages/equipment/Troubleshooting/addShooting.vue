<template>
  <view class="main">
    <view class="main-body">
      <!-- 设备维修信息Start  -->
      <block>
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="故障原因" isRequired isLink prop="faultReason">
              <view :class="{ placeholder: !Boolean(form.faultReason) }" @click="handleReasonSelected">
                {{ form.faultReason ? $getLabel(troubleReasonList, form.faultReason) : '点击选择' }}
              </view>
            </uni-form-item>
            <uni-form-item label="维修班组" isLink isRequired prop="teamId">
              <uni-department-select
                v-model="form.teamId"
                :multiple="false"
                :name.sync="form.team"
              ></uni-department-select>
            </uni-form-item>
            <uni-form-item label="维修级别" isRequired isLink prop="level">
              <view :class="{ placeholder: !Boolean(form.level) }" @click="handleLevelSelected">
                {{ form.level ? $getLabel(repairLevelList, form.level) : '点击选择' }}
              </view>
            </uni-form-item>
            <uni-form-item label="维修类别" isRequired isLink prop="type">
              <view :class="{ placeholder: !Boolean(form.type) }" @click="handleCategorySelected">
                {{ form.type ? $getLabel(repairCategoryList, form.type) : '点击选择' }}
              </view>
            </uni-form-item>
            <uni-form-item label="紧急程度" isRequired isLink prop="urgency">
              <view :class="{ placeholder: !Boolean(form.urgency) }" @click="handleUrgencySelected">
                {{ form.urgency ? $getLabel(urgencyList, form.urgency) : '点击选择紧急程度' }}
              </view>
            </uni-form-item>
            <uni-form-item label="是否停机" isRequired isLink prop="isClose">
              <view :class="{ placeholder: !Boolean(form.isClose) }" @click="handleStopSelected">
                {{ form.isClose ? $getLabel(isStopList, form.isClose) : '点击选择' }}
              </view>
            </uni-form-item>
            <uni-form-item label="停机时长(分)" isRequired prop="downTime">
              <textarea v-model.number="form.downTime" placeholder="请输入停机时长" auto-height  />
            </uni-form-item>
            <uni-form-item label="维修开始时间" isLink isRequired prop="startTime">
              <uni-date-picker
                v-model="form.startTime"
                fields="minute"
                mode="date"
                @input="handleTimeSelected"
              ></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="维修结束时间" isLink isRequired prop="endTime">
              <uni-date-picker
                v-model="form.endTime"
                fields="minute"
                mode="date"
                @input="handleTimeSelected"
              ></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="维修用时" isRequired prop="useTime">
              <view v-if="form.useTime">{{ form.useTime | formatTimeText }}</view>
              <view v-else class="placeholder">请选择维修时间</view>
            </uni-form-item>
            <uni-form-item label="维修费用(￥)" isRequired prop="repairMoney">
              <textarea v-model.number="form.repairMoney" placeholder="请输入维修费用" auto-height/>
            </uni-form-item>
            <uni-form-item label="是否外委" isRequired isLink prop="isOutsource">
              <view :class="{ placeholder: !Boolean(form.isOutsource) }" @click="handleOutsourceSelected">
                {{ form.isOutsource ? $getLabel(isOutsourceList, form.isOutsource) : '点击选择' }}
              </view>
            </uni-form-item>
            <uni-form-item v-if="form.isOutsource === 1" label="外委单位">
              <textarea v-model="form.outCompany" placeholder="请输入外委单位" auto-height />
            </uni-form-item>
            <uni-form-item label="工作描述" isRequired>
              <textarea v-model="form.describeInfo" placeholder="请输入工作描述" auto-height />
            </uni-form-item>
          </uni-card>
          <uni-card isForm>
            <uni-form-item label="创建人" isRequired>
              <view>{{ userName }}</view>
            </uni-form-item>
            <uni-form-item label="创建时间" isRequired>
              <view>{{ createTime }}</view>
            </uni-form-item>
          </uni-card>
          <!-- 附件信息 start -->
          <uni-card isForm class="attachmentInfo">
            <uni-form-item label="备注">
              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
            </uni-form-item>

            <uni-form-item class="file-item" label="附件">
              <uni-attachment v-model="form.fileIds" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit">提 交</button>
          </view>
        </uni-form-custom>
      </block>
      <!-- 设备维修信息end  -->
      <!--  -->
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
      <!--  -->
      <!-- 维修和验收基本信息Start -->
      <template v-if="repairInfo.length">
        <block v-for="item in repairInfo" :key="item.createTime">
          <!-- 维修信息 start -->
          <template v-if="item.modelType === 1">
            <uni-card>
              <uni-form-item label="故障原因" :border="false" align="left">
                <view class="placeholder">
                  {{ $getLabel(troubleReasonList, item.faultReason) }}
                </view>
              </uni-form-item>
              <uni-form-item label="维修班组" :border="false" align="left">
                <view class="placeholder">
                  {{ item.team }}
                </view>
              </uni-form-item>
              <uni-form-item label="维修级别" :border="false" align="left">
                <view class="placeholder">
                  {{ $getLabel(repairLevelList, item.level) }}
                </view>
              </uni-form-item>
              <uni-form-item label="维修类别" :border="false" align="left">
                <view class="placeholder">
                  {{ $getLabel(repairCategoryList, item.type) }}
                </view>
              </uni-form-item>
              <uni-form-item label="紧急程度" :border="false" align="left">
                <view class="placeholder">
                  {{ $getLabel(urgencyList, item.urgency) }}
                </view>
              </uni-form-item>
              <uni-form-item label="是否停机" :border="false" align="left">
                <view class="placeholder">
                  {{ $getLabel(isStopList, item.isClose) }}
                </view>
              </uni-form-item>
              <uni-form-item label="停机时长" :border="false" align="left">
                <view class="placeholder">
                  {{ item.downTime | formatTimeText }}
                </view>
              </uni-form-item>
              <uni-form-item label="维修开始时间" :border="false" align="left">
                <view class="placeholder">
                  {{ item.startTime }}
                </view>
              </uni-form-item>
              <uni-form-item label="维修结束时间" :border="false" align="left">
                <view class="placeholder">
                  {{ item.endTime }}
                </view>
              </uni-form-item>
              <uni-form-item label="维修用时" :border="false" align="left">
                <view class="placeholder">
                  {{ item.useTime | formatTimeText }}
                </view>
              </uni-form-item>
              <uni-form-item label="维修费用(￥)" :border="false" align="left">
                <view class="placeholder">
                  {{ item.repairMoney }}
                </view>
              </uni-form-item>
              <uni-form-item label="是否外委" :border="false" align="left">
                <view class="placeholder">
                  {{ $getLabel(isOutsourceList, item.isOutsource) }}
                </view>
              </uni-form-item>
              <uni-form-item v-if="item.isOutsource === 1" label="外委单位" :border="false" align="left">
                <view class="placeholder">
                  {{ item.outCompany }}
                </view>
              </uni-form-item>
              <uni-form-item label="工作描述" :border="false" align="left">
                <view class="placeholder">
                  {{ item.describeInfo }}
                </view>
              </uni-form-item>
            </uni-card>
            <uni-card>
              <uni-form-item label="创建人" :border="false" align="left">
                <view class="placeholder"> {{ item.creatorName }}</view>
              </uni-form-item>

              <uni-form-item label="创建时间" :border="false" align="left">
                <view class="placeholder">{{ item.createTime | ymd }}</view>
              </uni-form-item>
            </uni-card>

            <uni-card class="attachmentInfo">
              <uni-form-item label="备注" :border="false" align="left">
                <view class="placeholder"> {{ item.remark }}</view>
              </uni-form-item>

              <uni-form-item label="附件" :border="false" align="left">
                <uni-attachment v-if="item.fileIds" v-model="item.fileIds"></uni-attachment>
              </uni-form-item>
            </uni-card>
          </template>
          <!-- 维修信息 end -->
          <!--  -->
          <!-- 验收信息start -->
          <template v-else-if="item.modelType === 2">
            <uni-card>
              <uni-form-item label="验收结果" :border="false" align="left">
                <view class="placeholder"> {{ $getLabel(repairResult, item.acceptState) }}</view>
              </uni-form-item>

              <uni-form-item label="验收内容" :border="false" align="left">
                <view class="placeholder">{{ item.acceptResult }}</view>
              </uni-form-item>
              <uni-form-item label="验收人" :border="false" align="left">
                <view class="placeholder"> {{ item.creatorName }}</view>
              </uni-form-item>

              <uni-form-item label="验收时间" :border="false" align="left">
                <view class="placeholder">{{ item.createTime | ymd }}</view>
              </uni-form-item>
            </uni-card>
          </template>
          <!-- 维修信息 start -->
        </block>
      </template>
      <!-- 维修基本信息end -->
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
import troubleReasonList from './lib/troubleReasonList'
import repairCategoryList from './lib/repairCategoryList'
import repairLevelList from './lib/repairLevelList'

import moment from 'moment'

export default {
  data() {
    return {
      id: '', //设备ID
      isDraft: true, //是否草稿
      repairStatus: null, //报修单状态
      baseInfo: {}, //设备基本信息
      repairInfo: [], //维修信息
      levelList,
      categoryList,
      urgencyList,
      isStopList,
      isOutsourceList,
      checkResult,
      troubleReasonList,
      repairCategoryList,
      repairLevelList,
      // 报修审核数据
      form: {
        faultReason: null,
        status: null,
        level: null,
        isClose: null,
        isOutsource: null,
        type: null,
        urgency: null,
        useTime: '',
        isOutsource: null
      },
      rules: {
        faultReason: { required: true },
        teamId: { required: true },
        level: { required: true },
        type: { required: true },
        urgency: { required: true },

        startTime: { required: true },
        useTime: { required: true },
        endTime: { required: true },
        repairMoney: { required: true },
      
        describeInfo: { required: true },
        isOutsource: { required: true },
        isClose: { required: true },
        downTime: {
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
    this.form.repairId = this.id = options.id
  },
  onShow() {
    this.init()
  },

  methods: {
    async init() {
      let result = await this.fly.material.get(`equipmentRepair/get/${this.id}`)
      this.baseInfo = result.data || {}
      this.repairInfo = this.baseInfo.details || []
    },
    // 选择故障原因
    handleReasonSelected() {
      uni.showActionSheet({
        itemList: _.map(this.troubleReasonList, 'label'),
        success: res => {
          let selectItem = this.troubleReasonList[res.tapIndex] || {}
          this.form.faultReason = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 数字类型输入时失去焦点
    handleNumberInputBlur(event){
      console.log("bur",event)

    },
    // 选择维修级别
    handleLevelSelected() {
      uni.showActionSheet({
        itemList: _.map(this.repairLevelList, 'label'),
        success: res => {
          let selectItem = this.repairLevelList[res.tapIndex] || {}
          this.form.level = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选择维修类别
    handleCategorySelected() {
      uni.showActionSheet({
        itemList: _.map(this.repairCategoryList, 'label'),
        success: res => {
          let selectItem = this.repairCategoryList[res.tapIndex] || {}
          this.form.type = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选择紧急程度
    handleUrgencySelected() {
      uni.showActionSheet({
        itemList: _.map(this.urgencyList, 'label'),
        success: res => {
          let selectItem = this.urgencyList[res.tapIndex] || {}
          this.form.urgency = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选择是否外委
    handleOutsourceSelected() {
      uni.showActionSheet({
        itemList: _.map(this.isOutsourceList, 'label'),
        success: res => {
          let selectItem = this.isOutsourceList[res.tapIndex] || {}
          this.form.isOutsource = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 选择是否停机
    handleStopSelected() {
      uni.showActionSheet({
        itemList: _.map(this.isStopList, 'label'),
        success: res => {
          let selectItem = this.isStopList[res.tapIndex] || {}
          this.form.isClose = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 计算维修用时
    handleTimeSelected() {
      let { startTime, endTime } = this.form
      if (startTime && endTime) {
        let diff = moment(endTime).unix() - moment(startTime).unix()
        this.form.useTime = Math.round(diff / 60)
      }
    },
    // 提交审核结果
    async handleSubmit() {

      await this.$refs.form.validate()
    let {downTime,repairMoney}=this.form
    if(typeof downTime !=='number'){
        this.$utils.showToast('请填写正确的停机时间')
        return
    }
     if(typeof repairMoney !=='number'){
        this.$utils.showToast('请填写正确的维修费用')
        return
    }
     
      if (this.form.isOutsource === 1 && !this.form.outCompany) {
        this.$utils.showToast('外委单位必填')
        return
      }
      let result = await this.fly.material.post(`/equipmentRepair/beginRepair`, this.form, { isLoading: true })
      if (result.code === 200) {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          let num = this.baseInfo.handleState ? 2 : 1
          this.$utils.goBack(num)
        }, 1000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('detail.less');
</style>
