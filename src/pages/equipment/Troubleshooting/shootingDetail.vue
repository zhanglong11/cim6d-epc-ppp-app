<template>
  <view class="main ">
    <view class="main-body">
      <!-- 报修审核Start  -->
      <block v-if="handleState === 1">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-card isForm>
            <uni-form-item label="验收内容" isRequired prop="acceptResult">
              <textarea v-model.trim="form.acceptResult" auto-height placeholder="请输入审核意见" />
            </uni-form-item>
            <uni-form-item label="验收结果" isRequired isLink prop="acceptState">
              <view :class="{ placeholder: !Boolean(form.acceptState) }" @click="handleStatusSelected">
                {{ form.acceptState ? $getLabel(repairResult, form.acceptState) : '点击选择' }}
              </view>
            </uni-form-item>
            <uni-form-item v-if="form.acceptState === 2" label="不合格原因" isRequired>
              <textarea v-model.trim="form.acceptUnqualifiedReason" auto-height placeholder="请输入不合格原因" />
            </uni-form-item>
          </uni-card>
          <uni-card isForm>
            <uni-form-item label="验收人" isRequired>
              <view>{{ userName }}</view>
            </uni-form-item>
            <uni-form-item label="验收时间" isRequired>
              <view>{{ createTime }}</view>
            </uni-form-item>
          </uni-card>

          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit">提 交</button>
          </view>
        </uni-form-custom>
      </block>
      <!-- 报修审核Start  -->

      <!-- 验收不合格start -->
      <block v-if="handleState === 3">
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="jumpToAddShooting">执行维修</button>
        </view>
      </block>
      <!-- 验收不合格 end -->
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
import repairResult from './lib/repairResult'
import moment from 'moment'

export default {
  data() {
    return {
      id: '', //设备ID
      handleState: null, //维修状态
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
      repairResult,
      // 验收
      form: {
        acceptState: null
      },
      rules: {
        acceptState: {
          required: true
        },
        optionContent: {
          acceptResult: true
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
    this.handleState = Number(options.handleState)
  },
  onShow() {
    this.init()
  },
  methods: {
    async init() {
      let result = await this.fly.material.get(`equipmentRepair/get/${this.id}`)
      this.baseInfo = result.data || {}
      console.log(this.baseInfo)
      this.repairInfo = this.baseInfo.details || []
      console.log('维修信息', this.repairInfo)
    },
    // 选择审核结果
    handleStatusSelected() {
      uni.showActionSheet({
        itemList: this._.map(this.repairResult, 'label'),
        success: res => {
          let index = res.tapIndex
          this.form.acceptState = this.repairResult[res.tapIndex].value
        }
      })
    },
    // 提交审核结果
    async handleSubmit() {
      await this.$refs.form.validate()
      if (this.form.acceptState === 2 && !this.form.acceptUnqualifiedReason) {
        this.$utils.showToast('不合格原因必填')
        return
      }
      let result = await this.fly.material.post(`/equipmentRepair/acceptRepair`, this.form, {
        isLoading: true
      })
      if (result.code === 200) {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1000)
      }
    },
    // 跳转值设备故障维修页面
    jumpToAddShooting() {
      this.$utils.toUrl(`/pages/equipment/Troubleshooting/addShooting?id=${this.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('detail.less');
</style>
