<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <uni-card class="user-header">
          <p class="title">{{ car.lisencePlate }}</p>
          <uni-image-flat :fileIds="car.carImage" />
          <uni-form-item align="left" disabled label="所属公司22">
            {{ car.subordinateCompanyName }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="车辆类型">
            {{ car.carType }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="车辆负责人">
            {{ car.principalName }}
          </uni-form-item>
          <uni-form-item align="left" disabled label="在场状态">
            在场
          </uni-form-item>
          <uni-form-item align="left" disabled label="健康状态">
            健康
          </uni-form-item>
          <uni-form-item align="left" disabled label="车辆负责人身份证号">
            410086198606211170
          </uni-form-item>
          <uni-form-item align="left" disabled label="联系电话">
            {{ car.principalMobile }}
          </uni-form-item>
        </uni-card>
        <uni-title title="车辆消毒记录">
          <span slot="extra" class="add" @click="addRecords"></span>
        </uni-title>
        <uni-card>
          <template v-for="(item, i) in car.list">
            <uni-form-item :key="i" align="left" noLobel>
              <uni-swipe-action>
                <uni-swipe-action-item :options="options" @click="clickAction(i, $event, item)">
                  <div class="records-list">
                    <b>0{{ i + 1 }}</b>
                    <span v-text="item.principalName"></span>
                    <span>消毒部位：{{ item.sterilizePart }}</span>
                    <span class="time">{{ item.sterilizeTime }}</span>
                  </div>
                </uni-swipe-action-item>
              </uni-swipe-action>
            </uni-form-item>
          </template>
        </uni-card>
      </div>
    </scroll-view>
    <!-- 添加车辆消毒记录 start -->
    <uni-drawer-custom
      ref="addRecordsRef"
      :title="`${isAddForm ? '添加' : '编辑'}车辆消毒记录`"
      isConfirm
      cancelText="取消"
      @submit="saveRecords"
    >
      <h6 class="label">消毒部位</h6>
      <input v-model.trim="formData.sterilizePart" placeholder="请输入消毒部位" style="margin-bottom: 30rpx;" />
      <h6 class="label">消毒人</h6>
      <uni-select-user
        v-model="formData.principal"
        mode="2"
        :name.sync="formData.principalName"
        :mobile.sync="formData.principalMobile"
      ></uni-select-user>
    </uni-drawer-custom>
    <!-- 添加车辆消毒记录 end -->
  </div>
</template>

<script>
export default {
  name: 'HealthyVehicleDetails',
  data() {
    //这里存放数据
    return {
      car: {},
      id: '',
      monitoringRecords: [],
      formData: {
        sterilizePart: '',
        personnel: ''
      },
      formDataBack: {},
      isAddForm: true,
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
      ],
      imgNotUrl: '../../../static/images/imageNotFound.png',
      materialImg: 'https://www.runoob.com/wp-content/uploads/2016/02/react.png'
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
    async refresh() {
      let sterilizeRecordId
      await this.fly.construction.get('/carManage/detail/' + this.id).then(res => {
        this.car = res.data
        sterilizeRecordId = res.data.list[0].sterilizeRecordId
      })
      /*if (sterilizeRecordId) {
        this.fly.construction
          .post('sterilizeRecord/{sterilizeRecordId}/carList', { page: 1, rows: 1000, sterilizeRecordId })
          .then(res => {
            this.monitoringRecords = res.data.records
          })
      }*/
    },
    // 滑动操作
    clickAction(i, e, item) {
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
              this.fly.construction.get(`sterilizeRecord/${item.sterilizeRecordId}/delete`).then(res => {
                this.$utils.showToast('删除成功')
                this.refresh()
              })
            }
          }
        })
      }
    },
    // 添加车辆消毒记录
    addRecords() {
      this.isAddForm = true
      Object.assign(this.formData, this.formDataBack)
      this.$refs.addRecordsRef.open()
    },
    // 保存健康监测记录
    async saveRecords() {
      if (!this.formData.principalMobile) {
        this.$utils.showToast('请选择消毒部位')
        return
      }
      if (!this.formData.principalName) {
        this.$utils.showToast('请输入消毒人')
        return
      }
      if (this.isAddForm) {
        await this.fly.construction
          .post('sterilizeRecord/saveRecord', {
            ...this.formData,
            carIdList: this.car.id,
            principalName: this.$store.state.user.userName,
            principalMobile: this.$store.state.user.telephone,
            projectId: uni.getStorageSync('projectId'),
            companyId: uni.getStorageSync('companyId')
          })
          .then(res => {
            this.$utils.showToast('添加成功')
          })
      } else {
        await this.fly.construction.post('carManage/sterilizeRecord/update', this.formData).then(res => {
          this.$utils.showToast('修改成功')
        })
      }
      this.refresh()
      this.$refs.addRecordsRef.close()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./healthy.less');
</style>
