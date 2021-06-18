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
        <uni-card isForm>
          <div>
            <uni-form-item :label="id ? '检查计划名称' : '检查名称'" prop="planName">
              <textarea v-model.trim="form.planName" auto-height placeholder="请输入内容" name="planName" />
            </uni-form-item>
            <uni-form-item label="安全检查类型" isLink prop="planType">
              <uni-select v-model="form.planType" :options="safeCheckTypeList"></uni-select>
            </uni-form-item>
            <uni-form-item label="检查性质" disabled prop="planNature">
              <uni-select v-model="form.planNature" :options="planNatureList"></uni-select>
            </uni-form-item>
            <uni-form-item v-if="form.planNature === 5" label="危险源" isLink prop="dangerSource">
              <SelectDangerSource @change="dangerSourceChange">
                {{ form.dangerSource || '请选择' }}
              </SelectDangerSource>
            </uni-form-item>
            <uni-form-item v-if="form.planNature === 5" label="关键部位" prop="placeName">
              <view>{{ form.placeName || '无' }}</view>
            </uni-form-item>
<!--            <uni-form-item v-if="form.planNature === 4" label="检查项目" prop="inspectItem">-->
<!--              <textarea v-model.trim="form.inspectItem" auto-height placeholder="请输入内容" />-->
<!--            </uni-form-item>-->
<!--            <uni-form-item v-if="form.planNature === 4" label="检查部位" prop="inspectArea">-->
<!--              <textarea v-model.trim="form.inspectArea" auto-height placeholder="请输入内容" name="inspectArea" />-->
<!--            </uni-form-item>-->
            <uni-form-item label="检查内容" prop="inspectContent">
              <textarea v-model.trim="form.inspectContent" auto-height placeholder="请输入内容" name="inspectContent" />
            </uni-form-item>
            <uni-form-item label="检查要求" prop="inspectRequirements">
              <textarea
                v-model.trim="form.inspectRequirements"
                auto-height
                placeholder="请输入内容"
                name="inspectRequirements"
              />
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
            /></uni-form-item>
          </div>
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

import graceChecker from '@/utils/graceChecker'
import planNatureList from './lib/planNatureList'
import issueLevelList from './lib/issueLevelList'
import emergencyLevelList from './lib/emergencyLevelList'
import safeCheckTypeList from './lib/safeCheckTypeList'
import SelectDangerSource from './components/SelectDangerSource'
import _ from 'lodash'

export default {
  name: 'Safe',
  components: {
    SelectDangerSource
  },
  data() {
    return {
      planNatureList,
      issueLevelList,
      emergencyLevelList,
      safeCheckTypeList,
      id: null,
      form: {
        projectId: wx.getStorageSync('projectId'),
        actualInspectTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        planType: 2,
        dangerSource: '',
        placeName: '',
        taskFileId: '',
        bindDTOList: [] // bim问题关联DTO
        // 必选项校验参数
      },
      rules: {
        planName: { required: true },
        planType: { required: true },
        planNature: { required: true },
        dangerSource: { required: true },
        placeName: { required: true },
        inspectItem: { required: true },
        inspectArea: { required: true },
        inspectContent: { required: true },
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
    // 表单缓存
    formDataTemp() {
      return this.$store.state.addCache.addSafeCache
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.addCache.saveTime
    }
  },
  onLoad(options) {
    this.id = options.id
    this.form.planType = +options.planType
    this.form.planNature = +options.planNature
    this.$utils.setTitle(this.form.planNature === 4 ? '新建检查' : '新建定点巡视')
    if (this.id) {
      this.refresh()
    } else {
      this.autoSave()
    }
  },
  methods: {
    refresh() {
      this.fly.safety.get('inspect/get/' + this.id).then(res => {
        res.data.actualInspectTime = moment().format('YYYY-MM-DD HH:mm:ss')
        res.data.inspectStatus = res.data.inspectStatus || null
        this.form = res.data
      })
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('setAddSafeCache', this.form)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('clearCompanyTemp', 'addSafeCache')
    },
    // 点击保存按钮
    async handleLogSubmit() {
      await this.$refs.form.validate()
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
        if (this.form.inspectStatus === 2) {
          let bindDTOList = []
          this.bindDTOList.map(e => {
            let item = Object.assign({}, e, {
              componentIdList: _.map(e.componentIdList, 'guid')
            })
            bindDTOList.push(item)
          })
          this.form.bindDTOList = bindDTOList
        }

        await this.fly.safety.post('inspect/interim/add', this.form, { isLoading: true })
      }
      this.$utils.showToast('操作成功')
      if (!this.id) this.clearCache()
      // 删除guid缓存
      this.$store.dispatch('clearGuidCache', this.uUid)
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    },
    // 选择工序回传事件
    changeProcedure(array) {
      // console.log('选择工序回传事件', array)
    },
    dangerSourceChange(item) {
      console.log(item)
      this.form.placeName = item.placeName
      this.form.hazardId = item.id
      this.form.dangerSource = item.dangerSource
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
