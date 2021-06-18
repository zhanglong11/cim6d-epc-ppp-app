<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <div class="user-info">
          <uni-avatar :user="form" :size="120"></uni-avatar>
          <p class="user-name">
            <image v-if="form.gender === '1'" src="~@/static/images/labour/man.png" />
            <image v-if="form.gender === '2'" src="~@/static/images/labour/woman.png" />
            {{ form.name }}
          </p>
        </div>
        <uni-card class="user-header">
          <uni-form-item align="left" disabled label="年龄">
            {{ form.birthDate ? moment().year() - form.birthDate.slice(0, 4) : '' }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="籍贯">
            {{ form.nativePlace }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="民族">
            {{ form.nation }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="电话">
            {{ form.mobile }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="身份证号">
            {{ form.idCardNum }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="地址">
            河南省洛阳市西工区玻璃厂路134号
          </uni-form-item>
          <uni-form-item align="left" disabled label="政治面貌">
            {{ $getLabelFromArg('politicsStatus', form.politicsStatus) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="婚姻状态">
            {{ $getLabelFromArg('maritalStatus', form.maritalStatus) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="最高学历">
            {{ $getLabelFromArg('educationBackground', form.highestEducation) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="毕业院校">
            {{ form.graduateSchool }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="紧急联系人">
            {{ form.emergencyContactor }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="健康状态">
            {{ ['未测量', '健康', '异常'][form.healthStatus] }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="紧急联系人电话">
            {{ form.emergencyContactMobile }}
          </uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item align="left" disabled label="合同编号">
            {{ form.labourContractNum }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="作业类别">
            {{ $getLabelFromArg('workCategory', form.jobClass) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="工种">
            {{ $getLabelFromArg('workType', form.workType) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="班组">
            {{ form.groupName }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="在职状态">
            {{ $getLabelFromArg('jobStatus', form.jobStatus) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="身份">
            {{ $getLabelFromArg('identity', form.workDuty) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="用工性质">
            {{ $getLabelFromArg('workerProperty', form.staffKind) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="职位">
            {{ $getLabelFromArg('position', form.position) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="公司">
            {{ form.labourCompanyName }}
          </uni-form-item>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'LabourUserDetails',
  data() {
    //这里存放数据
    return {
      form: {
        headImage: '',
        name: '张 小 华',
        sex: 1
      },
      id: '',
      moment
    }
  },
  onLoad(option) {
    this.id = option.id
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'edit') {
      this.$utils.toUrl(`/pages/labour/labour-user-edit?id=${this.id}`)
    }
  },
  onShow() {
    this.fly.labour.get('employee/get/' + this.id).then(res => {
      this.form = res.data
    })
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {}
}
</script>
<style lang="less" scoped>
@import url('./labour.less');
</style>
