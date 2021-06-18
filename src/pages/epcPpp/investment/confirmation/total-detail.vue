<template>
  <div v-if="loaded" class="main">
    <uni-form-custom ref="form" :rules="rules" :model="form" disabled>
      <uni-card>
        <uni-form-item label="期号" prop="issue">
          <input v-model="form.issue" placeholder="点击输入内容" type="text" />
        </uni-form-item>
        <uni-form-item label="确认单月份" prop="confirmMonth">
          <uni-date-picker
            v-model="form.confirmMonth"
            fields="month"
            mode="date"
            valueFormat="YYYY-MM"
          ></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="确认期" prop="confirmStartDate">
          <uni-date-range
            class="drawer-custom"
            :start-date.sync="form.confirmStartDate"
            :end-date.sync="form.confirmEndDate"
          ></uni-date-range>
        </uni-form-item>
      </uni-card>
      <uni-tabs v-model="type">
        <uni-tab-pane name="1" label="工程建设其他费用确认单"></uni-tab-pane>
        <uni-tab-pane v-if="!isAudit" name="2" label="项目建设期利息确认单"></uni-tab-pane>
        <uni-tab-pane name="3" label="总投资确认单"></uni-tab-pane>
      </uni-tabs>

      <template v-if="type === '1'">
        <uni-card>
          <uni-form-item label="工程建设其他费用(元)" prop="constructionOtherCostSaveDTO.constructionOtherCost">
            <uni-input-number v-model="form.constructionOtherCostSaveDTO.constructionOtherCost" />
          </uni-form-item>
        </uni-card>
        <uni-card title="工程建设其它费用明细表"></uni-card>
        <uni-card
          v-for="(item, index) in form.constructionOtherCostDetailList"
          :key="item.id"
          :title="'序号：' + (index + 1)"
        >
          <uni-form-item label="项目名称">
            <input v-model="item.projectName" placeholder="点击输入" />
          </uni-form-item>
          <uni-form-item label="合同金额(元)">
            <uni-input-number v-model="item.contractTotal" />
          </uni-form-item>
          <uni-form-item label="上期累计确认金额(元)">
            <uni-input-number v-model="item.previousPeriodAmount" />
          </uni-form-item>
          <uni-form-item label="本期申报金额(元)">
            <uni-input-number v-model="item.currentPeriodDeclared" />
          </uni-form-item>
          <uni-form-item label="本期审核金额(元)" :disabled="!isAudit">
            <uni-input-number v-model="item.currentAuditAmount" :placeholder="isAudit ? '点击输入' : ''" />
          </uni-form-item>
          <uni-form-item label="备注" :disabled="!isAudit">
            <input v-model="item.remark" :placeholder="isAudit ? '点击输入' : ''" />
          </uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item label="附件" :disabled="false">
            <uni-attachment v-model="form.constructionOtherCostSaveDTO.fileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
      </template>

      <template v-if="type === '2' && !isAudit">
        <uni-card>
          <uni-form-item label="项目建设期利息(元)" prop="constructionInterestSaveDTO.constructionInterest">
            <uni-input-number v-model="form.constructionInterestSaveDTO.constructionInterest" />
          </uni-form-item>
        </uni-card>
        <uni-card title="项目建设期利息明细表"></uni-card>
        <uni-card
          v-for="(item, index) in form.constructionInterestDetailList"
          :key="item.id"
          :title="'序号：' + (index + 1)"
        >
          <uni-form-item label="内容">
            {{ getConfirmationInterestTypeByValue(item.type) }}
          </uni-form-item>
          <uni-form-item label="融贷金额(元)">
            <uni-input-number v-model="item.creditAmount" />
          </uni-form-item>
          <uni-form-item label="确认工程费和工程建设费总额(元)">
            <uni-input-number v-model="item.totalAmount" />
          </uni-form-item>
          <uni-form-item label="确认计息投资额(元)">
            <uni-input-number v-model="item.investAmount" />
          </uni-form-item>
          <uni-form-item label="年利率(%)">
            <uni-input-number v-model="item.annualInterestRate" />
          </uni-form-item>
          <uni-form-item label="计息周期">
            <uni-date-range :start-date.sync="item.interestPeriodStart" :end-date.sync="item.interestPeriodEnd" />
          </uni-form-item>
          <uni-form-item label="计息天数">
            {{ moment(item.interestPeriodEnd).diff(item.interestPeriodStart, 'days') }}
          </uni-form-item>
          <uni-form-item label="利息(元)">
            <uni-input-number v-model="item.interest" />
          </uni-form-item>
          <uni-form-item label="备注">
            <input v-model="item.remark" placeholder="点击输入" />
          </uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item label="附件" :disabled="false">
            <uni-attachment v-model="form.constructionInterestSaveDTO.fileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
      </template>

      <template v-if="type === '3'">
        <uni-card title="项目总投资明细表"></uni-card>
        <uni-card v-for="(item, index) in form.totalDetailList" :key="item.id" :title="'序号：' + (index + 1)">
          <uni-form-item label="内容">
            {{ getConfirmationTotalTypeByValue(item.type) }}
          </uni-form-item>
          <uni-form-item label="上期累计确认金额(元)">
            <uni-input-number v-model="item.previousPeriodAmount" />
          </uni-form-item>
          <uni-form-item label="本期完成(元)">
            <uni-input-number v-model="item.currentPeriodComplete" />
          </uni-form-item>
          <uni-form-item :disabled="!isAudit" label="本期审核金额(元)">
            <uni-input-number v-model="item.currentAuditAmount" />
          </uni-form-item>
          <uni-form-item :disabled="!isAudit" label="累计确认金额(元)">
            <uni-input-number v-model="item.totalConfirmedAmount" />
          </uni-form-item>
          <uni-form-item label="备注" :disabled="!isAudit">
            <input v-model="item.remark" :placeholder="isAudit ? '点击输入' : ''" />
          </uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item label="附件" :disabled="false">
            <uni-attachment v-model="form.totalConfirmSaveDTO.fileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
      </template>
    </uni-form-custom>
    <!-- 审批记录 start -->
    <uni-check-detail :id="id"></uni-check-detail>
    <!-- 审批记录 end -->
    <!-- 通用审批 start -->
    <uni-check-card v-if="!isAudit" :id="id" ref="checkCard" />
    <!-- 通用审批 end -->
    <view v-if="isAudit" class="btn-wrapper">
      <button class="button" type="primary" @click="handleSubmit()">审批</button>
    </view>
  </div>
</template>

<script>
import { getConfirmDetail, completeConfirm } from '../api/confirmation'
import { getConfirmationInterestTypeByValue } from './lib/confirmationInterestTypeList'
import { getConfirmationTotalTypeByValue } from './lib/confirmationTotalTypeList'
import { workFlowApi } from '@/api/work-flow'
export default {
  name: 'TotalDetail',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      type: '1',
      form: {
        confirmType: 2,
        projectId: uni.getStorageSync('projectId'),
        constructionOtherCostSaveDTO: {
          projectId: uni.getStorageSync('projectId'),
          fileIds: ''
        },
        constructionInterestSaveDTO: {
          projectId: uni.getStorageSync('projectId'),
          fileIds: ''
        },
        totalConfirmSaveDTO: {
          projectId: uni.getStorageSync('projectId'),
          fileIds: ''
        },
        constructionOtherCostDetailList: [{ id: _.uniqueId() }, { id: _.uniqueId() }],
        constructionInterestDetailList: [
          { type: 1, interestPeriodArray: [], id: _.uniqueId() },
          { type: 2, interestPeriodArray: [], id: _.uniqueId() },
          { type: 3, interestPeriodArray: [], id: _.uniqueId() }
        ],
        totalDetailList: [
          { type: 1, id: _.uniqueId() },
          { type: 2, id: _.uniqueId() },
          { type: 3, id: _.uniqueId() }
        ]
      },
      rules: {
        issue: [{ required: true }],
        confirmMonth: [{ required: true }],
        confirmStartDate: [{ required: true }],
        'constructionOtherCostSaveDTO.constructionOtherCost': [{ required: true }],
        'constructionInterestSaveDTO.constructionInterest': [{ required: true }]
      },
      id: '',
      isAudit: false,
      loaded: false
    }
  },
  computed: {
    taskTodo() {
      return this.$store.state.userPower.taskTodo
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  onShow() {
    this.refresh()
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    async refresh() {
      if (this.id) {
        // 在审核的时候判断一下流程是不是跟踪审计单位填报审核阶段
        await this.$store.commit('getTaskTodo', async () => {
          this.hasPower = this.taskTodo.includes(this.id)
          if (this.hasPower) {
            await workFlowApi.getProcessLayout(this.id).then(res => {
              // 目前根据高亮节点数量判断是不是跟踪审计单位填报审核阶段
              if (res.data.highLightedActivities.length === 2) {
                this.isAudit = true
                this.$utils.setTitle('跟踪审计单位填报审核金额')
              }
              if (res.data.highLightedActivities.length > 2) {
                this.isAfterAudit = true
              }
            })
          }
          this.loaded = true
        })
        getConfirmDetail(this.id).then(res => {
          _.forEach(res.data.constructionInterestDetailList, item => {
            const [start, end] = item.interestPeriod ? item.interestPeriod.split(',') : []
            item.interestPeriodStart = start
            item.interestPeriodEnd = end
          })
          if (!res.data.constructionOtherCostDetailList.length) {
            res.data.constructionOtherCostDetailList.push(...[{ id: _.uniqueId() }, { id: _.uniqueId() }])
          }
          this.form = res.data
        })
      }
    },
    //处理要提交的数据
    getFormatterData() {
      const form = _.cloneDeep(this.form)
      form.constructionOtherCostDetailList = form.constructionOtherCostDetailList.filter(e => e.projectName)
      form.constructionInterestDetailList.forEach(item => {
        if (item.interestPeriodStart) {
          item.interestPeriod = [item.interestPeriodStart, item.interestPeriodEnd].join(',')
        }
      })
      _.flatten([
        form.constructionOtherCostDetailList,
        form.constructionInterestDetailList,
        form.totalDetailList
      ]).forEach(item => {
        item.projectId = uni.getStorageSync('projectId')
      })
      return form
    },
    // 保存并提交
    async handleSubmit() {
      completeConfirm(this.form)
      this.$utils.showToast('成功')
      this.$utils.goBack()
    },
    getConfirmationInterestTypeByValue,
    getConfirmationTotalTypeByValue
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.btn-wrapper {
  display: flex;
  justify-content: center;
  > * {
    width: 40%;
  }
}
.uni-tabs {
  max-width: 700px;
  margin: 0 auto;
}
.add-button {
  width: 300px;
  margin-top: 30px;
}
</style>
