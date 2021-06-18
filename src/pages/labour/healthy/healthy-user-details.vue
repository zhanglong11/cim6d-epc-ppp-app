<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <div class="user-info">
          <uni-avatar :user="user" :size="120"></uni-avatar>
          <p class="user-name">
            <image src="~@/static/images/labour/man.png" />
            {{ user.name }}
          </p>
        </div>
        <uni-card class="user-header">
          <uni-form-item align="left" disabled label="所属公司">
            {{ user.labourCompanyName }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="所属部门">
            小班
          </uni-form-item>
          <uni-form-item align="left" disabled label="人员编号">
            {{ user.employeeNum }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="在场状态">
            {{ $getLabel(enterStatusList, user.enterStatus) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="健康状态">
            {{ $getLabel(healthStatusList, user.healthStatus) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="性别">
            {{ ['男', '女'][user.gender - 1] }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="年龄">
            {{ new Date().getFullYear() - user.idCardNum.slice(6, 10) }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="身份证号">
            {{ user.idCardNum }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="籍贯">
            {{ user.nativePlace }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="联系电话">
            {{ user.mobile }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="地址">
            暂无
          </uni-form-item>
        </uni-card>
        <uni-title title="健康监测记录">
          <span slot="extra" class="add" @click="addRecords"></span>
        </uni-title>
        <uni-card>
          <template v-for="(item, i) in monitoringRecords">
            <uni-form-item :key="i" align="left" noLobel>
              <uni-swipe-action>
                <uni-swipe-action-item :options="options" @click="clickAction(i, $event)">
                  <div class="records-list">
                    <b>{{ (i + 1 + '').padStart(2, '0') }}</b>
                    <span>{{ $getLabel(typeList, item.monitorType) }}</span>
                    <span v-text="item.bodyTemperature"></span>
                    <span class="time">{{ item.createTime }}</span>
                  </div>
                </uni-swipe-action-item>
              </uni-swipe-action>
            </uni-form-item>
          </template>
        </uni-card>
      </div>
    </scroll-view>
    <!-- 添加健康监测记录 start -->
    <uni-drawer-custom
      ref="addRecordsRef"
      :title="`${isAddForm ? '添加' : '编辑'}健康监测记录`"
      isConfirm
      cancelText="取消"
      @submit="saveRecords"
    >
      <h6 class="label">测量方式</h6>
      <uni-checkbox-button-group class="measure-mode" v-model.trim="formData.monitorType" join :options="typeList" />
      <h6 class="label">体温℃</h6>
      <input v-model="formData.bodyTemperature" placeholder="请输入" type="number" />
    </uni-drawer-custom>
    <!-- 添加健康监测记录 end -->
  </div>
</template>

<script>
export default {
  name: 'HealthyUserDetails',
  data() {
    //这里存放数据
    return {
      user: {},
      id: '',
      monitoringRecords: [],
      typeList: [
        {
          label: '人工测量',
          value: 1
        },
        {
          label: '入场红外体温测量',
          value: 2
        }
      ],
      formData: {
        monitorType: '',
        typeTemperature: ''
      },
      formDataBack: {},
      isAddForm: true,
      healthStatusList: [
        { label: '未测量', value: '0', color: '#999999' },
        { label: '健康', value: '1', color: '#25CC70' },
        { label: '异常', value: '2', color: 'red' }
      ],
      enterStatusList: [
        { label: '进场', value: '1' },
        { label: '未进场', value: '0' }
      ],
      options: [
        {
          text: '编辑',
          style: {
            backgroundColor: '#4778f3'
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#FC5556'
          }
        }
      ]
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
  created() {
    this.refresh()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.formDataBack, this.formData)
  },
  //方法集合
  methods: {
    refresh() {
      this.fly.labour.get('employee/get/' + this.id).then(res => {
        this.user = res.data
        this.formData.employeeId = res.data.id
        this.formData.employeeName = res.data.name
      })
      this.fly.construction
        .post('health/monitor/list', {
          employeeId: this.id,
          page: 1,
          rows: 1000
        })
        .then(res => {
          this.monitoringRecords = res.data.records
        })
    },
    // 滑动操作
    clickAction(i, e) {
      let actionIndex = e.index
      if (actionIndex === 0) {
        setTimeout(() => {
          this.isAddForm = false
          this.formData = Object.assign({}, this.monitoringRecords[i])
          this.$refs.addRecordsRef.open()
        }, 50)
      } else {
        uni.showModal({
          title: '提示',
          content: '确定要删除？',
          success: res => {
            if (res.confirm) {
              this.monitoringRecords.splice(0, 1)
            }
          }
        })
      }
    },
    // 添加健康监测记录
    addRecords() {
      this.isAddForm = true
      Object.assign(this.formData, this.formDataBack)
      this.$refs.addRecordsRef.open()
    },
    // 保存健康监测记录
    saveRecords() {
      if (!this.formData.monitorType) {
        this.$utils.showToast('请选择测量方式')
        return
      }
      if (!this.formData.bodyTemperature) {
        this.$utils.showToast('请输入体温℃')
        return
      }

      this.fly.construction.post('health/monitor/add', this.formData).then(res => {
        this.$utils.showToast('添加成功')
        this.refresh()
      })
      this.$refs.addRecordsRef.close()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./healthy.less');
</style>
