<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
        <div v-if="saveTime" class="save-time">实时保存{{ saveTime }}</div>
        <!-- 选择工序组件 start -->
        <!--        <uni-select-procedure @change="changeProcedure" />-->
        <!-- 选择工序组件 end -->

        <!--        单体-->
        <!--        单元-->
        <!--        楼层-->
        <!--        户型-->
        <!--        工序-->
        <!-- 计划检查项目开始 -->
        <uni-card v-if="!id" isForm>
          <uni-form-item label="检查名称" prop="planName">
            <textarea v-model.trim="form.planName" auto-height placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="检查性质" isLink prop="planNature" disabled>
            <uni-select v-model="form.planNature" :options="planNatureList"></uni-select>
          </uni-form-item>
          <!-- <uni-form-item label="检查项目" prop="inspectItem">
            <textarea v-model.trim="form.inspectItem" auto-height placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="检查部位" prop="inspectArea">
            <textarea v-model.trim="form.inspectArea" auto-height placeholder="请输入内容" />
          </uni-form-item> -->
          <uni-form-item label="检查内容" prop="inspectContent">
            <textarea v-model.trim="form.inspectContent" auto-height placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="检查数量" prop="inspectNum">
            <input v-model.number="form.inspectNum" type="number" placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="允许偏差" prop="allowableDeviation">
            <input v-model.trim="form.allowableDeviation" placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="检查要求" prop="inspectRequirements">
            <textarea v-model.trim="form.inspectRequirements" auto-height placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="受检部门" isLink prop="beInspectedDeptId">
            <uni-department-select
              v-model="form.beInspectedDeptId"
              :multiple="false"
              :name.sync="form.beInspectedDeptName"
            ></uni-department-select>
          </uni-form-item>
          <uni-form-item label="受检负责人" isLink prop="beInspectedPrincipal">
            <uni-select-user
              v-model="form.beInspectedPrincipal"
              :disabledUserIds="[$store.state.user.userId]"
              :name.sync="form.beInspectedPrincipalName"
              placeholder="请选择"
            />
          </uni-form-item>
        </uni-card>

        <uni-card v-if="id">
          <uni-form-item align="left" label="检查计划名称">
            <view>{{ form.planName }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="计划检查日期">
            <view>{{ form.planInspectTime | ymd }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="检查性质">
            <view>{{ $getLabel(planNatureList, form.planNature) }}</view>
          </uni-form-item>
          <!-- <uni-form-item align="left" label="检查项目">
            <view>{{ form.inspectItem }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="检查部位">
            <view>{{ form.inspectArea }}</view>
          </uni-form-item> -->
          <uni-form-item align="left" label="检查内容">
            <view>{{ form.inspectContent }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="检查数量">
            <view>{{ form.inspectNum }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="允许偏差">
            <view>{{ form.allowableDeviation }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="检查要求">
            <view>{{ form.inspectRequirements }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="检查部门">
            <view>{{ form.inspectDeptName }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="受检部门">
            <view>{{ form.beInspectedDeptName }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="受检负责人">
            <view>{{ form.beInspectedPrincipalName }}</view>
          </uni-form-item>
          <uni-form-item align="left" label="备注">
            <view>{{ form.planRemark }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="form.planFileId"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 计划检查项目结束 -->
        <!-- 实际检查结果开始 -->
        <uni-card isForm>
          <uni-form-item label="检查日期" isLink prop="actualInspectTime">
            <uni-date-picker v-model="form.actualInspectTime" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item v-if="form.planNature >= 4" label="检查人" isRequired>
            {{ $store.state.user.userName }}
          </uni-form-item>
          <uni-form-item v-if="form.planNature <= 3" label="检查负责人" isRequired>
            {{ form.inspectPrincipalName }}
          </uni-form-item>
          <uni-form-item v-if="form.planNature <= 3" label="检查执行人" isRequired>
            {{ form.inspectExecutorName }}
          </uni-form-item>
          <uni-form-item label="检查结果" isLink prop="inspectStatus">
            <uni-select
              v-model="form.inspectStatus"
              :option="[
                { label: '合格', value: 1 },
                { label: '不合格', value: 2 }
              ]"
            ></uni-select>
          </uni-form-item>
        </uni-card>
        <!-- 实际检查结果结束 -->
        <!-- 检查结果为不合格时开始，此时显示原因描述 -->
        <uni-select-entity v-if="form.inspectStatus === 2" :uUid="uUid" @change="changeProcedure" />
        <uni-card v-if="form.inspectStatus === 2" isForm>
          <uni-form-item label="问题描述" prop="issueDescription">
            <textarea v-model.trim="form.issueDescription" :maxlength="-1" auto-height placeholder="点击输入问题描述" />
          </uni-form-item>
          <uni-form-item label="紧急程度" isLink prop="emergencyLevel">
            <uni-select v-model="form.emergencyLevel" :options="emergencyLevelList"></uni-select>
          </uni-form-item>
          <uni-form-item label="问题等级" isLink prop="issueLevel">
            <uni-select v-model="form.issueLevel" :options="issueLevelList"></uni-select>
          </uni-form-item>
        </uni-card>
        <!-- 检查结果为不合格时结束 -->
        <!-- 备注和附件信息开始 -->
        <uni-card isForm>
          <uni-form-item label="备注" align="left" type="textarea" class="block-item" prop="taskRemark">
            <textarea v-model.trim="form.taskRemark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="现场照片" prop="taskFileId">
            <uni-attachment v-model="form.taskFileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息结束 -->
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleLogSubmit">保存</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

import planNatureList from './lib/planNatureList'
import issueLevelList from './lib/issueLevelList'
import emergencyLevelList from './lib/emergencyLevelList'
import _ from 'lodash'

export default {
  name: 'Quality',
  data() {
    return {
      planNatureList,
      issueLevelList,
      emergencyLevelList,
      id: null,
      form: {
        projectId: wx.getStorageSync('projectId'),
        actualInspectTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        planType: 1,
        planNature: 4,
        bindDTOList: [] // bim问题关联DTO
        // 必选项校验参数
      },
      rules: {
        planName: { required: true },
        planNature: { required: true },
        // inspectItem: { required: true },
        // inspectArea: { required: true },
        inspectContent: { required: true },
        inspectNum: { type: 'number', min: 1, message: '请输入正确的检查数量' },
        inspectRequirements: { required: true },
        beInspectedDeptId: { required: true },
        beInspectedPrincipal: { required: true },
        actualInspectTime: { required: true },
        inspectStatus: { required: true },
        issueDescription: { required: true },
        issueLevel: { required: true },
        emergencyLevel: { required: true },
        taskFileId: { required: true }
      },
      uUid: this.$utils.getUuid() || '' // 接收选择的构件或其他服务使用
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    bindDTOList() {
      return this.$store.state.bim.selectGuid
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.addCache.saveTime
    },
    // 表单缓存
    formDataTemp() {
      return this.$store.state.addCache.addInspectCache
    }
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.refresh()
    } else {
      this.autoSave()
    }
  },
  beforeDestroy() {
    // 关闭自动缓存定时器
    this.$store.commit('closeCacheTimer')
  },
  methods: {
    refresh() {
      this.fly.safety.get('inspect/get/' + this.id).then(res => {
        res.data.actualInspectTime = moment().format('YYYY-MM-DD HH:mm:ss')
        this.form = res.data
      })
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('setAddInspectCache', this.form)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('clearCompanyTemp', 'addInspectCache')
    },
    // 点击保存按钮
    async handleLogSubmit() {
      // 开启表单验证
      await this.$refs.form.validate()
      let bindDTOList = []
      if (this.id) {
        await this.fly.safety.post(
          'inspect/submit',
          {
            inspectTaskId: this.id,
            ..._.pick(this.form, [
              'inspectStatus',
              'actualInspectTime',
              'issueDescription',
              'issueLevel',
              'emergencyLevel',
              'taskFileId'
            ])
          },
          { isLoading: true }
        )
      } else {
        this.bindDTOList.map(e => {
          let item = Object.assign({}, e, {
            componentIdList: _.map(e.componentIdList, 'guid')
          })
          bindDTOList.push(item)
        })
        this.form.bindDTOList = bindDTOList
        await this.fly.safety.post('inspect/interim/add', this.form, { isLoading: true })
      }
      this.$utils.showToast('操作成功')
      // 删除guid缓存
      this.$store.dispatch('clearGuidCache', this.uUid)
      if (!this.id) this.clearCache()
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    },
    // 选择工序回传事件
    changeProcedure(array) {
      // console.log('选择工序回传事件', array)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
.primary-link {
  text-align: right;
  color: @mainColor;
}
</style>
