<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <uni-form-custom ref="form" :model="form" :rules="rules" class="main-body">
        <div v-if="saveTime" class="save-time no-padding">实时保存{{ saveTime }}</div>
        <uni-card>
          <uni-form-item label="人员姓名" prop="name">
            <input v-model="form.name" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="身份证号" prop="idCardNum">
            <input v-model="form.idCardNum" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="性别" isLink disabled>
            <uni-select
              v-model="form.gender"
              :options="[
                { label: '男', value: 1 },
                { label: '女', value: 2 }
              ]"
              placeholder="自动设置"
            />
          </uni-form-item>
          <uni-form-item label="出生日期" isLink disabled>
            <uni-date-picker
              v-model="form.birthDate"
              :endYear="new Date().getFullYear()"
              fields="day"
              placeholder="自动设置"
            />
          </uni-form-item>
          <uni-form-item label="电话" prop="mobile">
            <input v-model="form.mobile" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="民族" isLink>
            <uni-select v-model="form.nation" :options="nationList" />
          </uni-form-item>
          <uni-form-item label="籍贯">
            <input v-model="form.nativePlace" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="政治面貌" isLink>
            <uni-select v-model="form.politicsStatus" argGroup="politicsStatus" />
          </uni-form-item>
          <uni-form-item label="婚姻状态" isLink>
            <uni-select v-model="form.maritalStatus" argGroup="maritalStatus" />
          </uni-form-item>
          <uni-form-item label="最高学历" isLink>
            <uni-select v-model="form.highestEducation" argGroup="educationBackground" />
          </uni-form-item>
          <uni-form-item label="毕业院校">
            <input v-model="form.graduateSchool" placeholder="请输入最高毕业院校(没有可不填)" />
          </uni-form-item>
          <uni-form-item label="紧急联系人" prop="emergencyContactor">
            <input v-model="form.emergencyContactor" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="紧急联系人电话">
            <input v-model="form.emergencyContactMobile" placeholder="请输入" type="number" />
          </uni-form-item>
          <uni-form-item class="file-item" label="头像">
            <uni-attachment v-model="form.headImage" uploadType="image" edit />
          </uni-form-item>
          <uni-form-item class="file-item" label="身份证正/反面" prop="idCardFileId">
            <uni-attachment v-model="form.idCardFileId" edit uploadType="image" />
          </uni-form-item>
          <uni-form-item class="file-item" label="资质证件">
            <uni-attachment v-model="form.certificateFileId" edit uploadType="image" />
          </uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item label="所属企业" prop="labourCompanyId" isLink>
            <uni-select v-model="form.labourCompanyId" :options="companyList" />
          </uni-form-item>
          <uni-form-item label="所属班组" isLink :disabled="!form.labourCompanyId">
            <uni-select v-model="form.groupId" :options="teamList" />
          </uni-form-item>
          <uni-form-item label="人员工种" isLink>
            <uni-select v-model="form.workType" argGroup="workType" />
          </uni-form-item>
          <uni-form-item label="考勤规则" isLink>
            <uni-select v-model="form.attendRuleId" :options="attendanceRulesList" />
          </uni-form-item>
          <uni-form-item label="合同编号">
            <input v-model="form.labourContractNum" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item class="file-item" label="合同文件">
            <uni-attachment v-model="form.labourContractFileId" edit uploadType="image,other" />
          </uni-form-item>
          <uni-form-item label="在职状态" isLink>
            <uni-select v-model="form.jobStatus" argGroup="jobStatus" />
          </uni-form-item>
          <uni-form-item label="用工性质" isLink>
            <uni-select v-model="form.staffKind" argGroup="workerProperty" />
          </uni-form-item>
          <uni-form-item label="身份" isLink>
            <uni-select v-model="form.workDuty" argGroup="identity" />
          </uni-form-item>
          <uni-form-item label="作业类别" isLink>
            <uni-select v-model="form.jobClass" argGroup="workCategory" />
          </uni-form-item>
          <uni-form-item label="所属职位" isLink>
            <uni-select v-model="form.position" argGroup="position" />
          </uni-form-item>
          <uni-form-item label="备注" type="textarea" align="left">
            <textarea v-model="form.workRemark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="save()">保存</button>
        </view>
      </uni-form-custom>
    </scroll-view>
  </div>
</template>

<script>
import nationList from './lib/nationList'
import regular from '@/lib/regular'
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'LabourUserEdit',
  data() {
    //这里存放数据
    return {
      form: {
        jobStatus: 'jobStatus_1',
        projectId: uni.getStorageSync('projectId'),
        gender: null,
        birthDate: null
      },
      nationList,
      id: '',
      // 所属企业 - 选择框数据
      companyList: [],
      // 所属班组 - 选择框数据
      teamList: [],
      // 考勤规则 - 选择框数据
      attendanceRulesList: [
        { label: '上下班打卡', value: 1 },
        { label: '弹性', value: 2 }
      ],
      // APP权限 - 选择框数据
      appPowerList: [{ label: '暂无权限', value: 1 }],
      // 所属职位 - 选择框数据
      isLoading: false,
      rules: {
        name: [{ required: true }],
        idCardNum: [{ required: true }, { pattern: regular.idCardNo, message: '身份证号不合法' }],
        labourCompanyId: [{ required: true, message: '请选择企业' }],
        mobile: [{ pattern: regular.phone, message: '手机号不合法' }],
        emergencyContactMobile: [{ pattern: regular.phone, message: '手机号不合法' }],
        idCardFileId: [
          {
            validator(rule, value, callback) {
              if (value && value.split(',').length !== 2) {
                callback(new Error('身份证照片必须是两张'))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {
    // 表单缓存
    formDataTemp() {
      return this.$store.state.addCache.addLabourUserCache
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.addCache.saveTime
    }
  },
  watch: {
    'form.labourCompanyId'() {
      this.getGroupList()
    },
    'form.idCardNum'(val) {
      this.$refs.form.validateField('idCardNum', err => {
        if (err || !val) return false
        this.form.gender = '13579'.includes(_.nth(val, -2)) ? 1 : 2
        this.form.birthDate = moment(val.slice(6, 14), 'YYYYMMDD').format('YYYY-MM-DD 00:00:00')
      })
    }
  },
  onLoad(option) {
    this.id = option.id
  },
  created() {
    if (this.id) {
      this.refresh()
    } else {
      this.$utils.setTitle('添加人员信息')
      this.autoSave()
    }
    this.getCompanyList()
  },
  //方法集合
  methods: {
    refresh() {
      this.fly.labour.get('employee/get/' + this.id).then(res => {
        this.form = res.data
      })
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('setAddLabourUserCache', this.form)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('clearCompanyTemp', 'addLabourUserCache')
    },
    getCompanyList() {
      this.fly.labour
        .post('company/list', { page: 1, rows: 100000, projectId: wx.getStorageSync('projectId') })
        .then(res => {
          res.data.records.forEach(e => {
            e.label = e.name
            e.value = e.id
          })
          this.companyList = res.data.records
        })
    },
    getGroupList() {
      this.fly.labour
        .post('group/list', {
          page: 1,
          rows: 100000,
          projectId: uni.getStorageSync('projectId'),
          labourCompanyId: this.form.labourCompanyId
        })
        .then(res => {
          res.data.records.forEach(e => {
            e.label = e.name
            e.value = e.id
          })
          this.teamList = res.data.records
        })
    },
    // 保存
    async save() {
      const form = _.cloneDeep(this.form)
      form.birthDate = form.birthDate ? form.birthDate + ' 00:00:00' : ''
      await this.$refs.form.validate()
      await this.fly.labour.post('employee/' + (this.id ? 'update' : 'add'), form)
      this.$utils.showToast('保存成功')
      this.clearCache()
      setTimeout(() => {
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./labour.less');
</style>
