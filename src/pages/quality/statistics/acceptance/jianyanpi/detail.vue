<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div>
        <uni-card>
          <uni-form-item label="验收名称" isRequired>
            <div>{{ info.acceptanceName }}{{ info.acceptanceApplyNumber }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="验收类型">
            <div>{{ type }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="检验批编号" :border="false">
            <div>{{ info.inspectionLotNumber }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="检验批名称" :border="false">
            <div>{{ info.inspectionLotName }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="所属分项" :border="false">
            <div>{{ info.engineeringName }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="检验批部位" :border="false">
            <div>{{ info.inspectionLotPoint }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="检验批容量" :border="false">
            <div>{{ info.inspectionLotCapacity }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="验收依据" :border="false">
            <div>{{ info.constructionBases }}</div>
          </uni-form-item>
        </uni-card>
        <div v-if="info.detailList" class="card-title">
          检验批明细
        </div>
        <uni-card v-for="(item, i) in info.detailList" :key="i" isForm>
          <uni-form-item align="left" disabled label="序号" :border="false">
            <div>{{ i + 1 }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="验收项目" :border="false">
            <div>{{ item.acceptanceItem }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="项目种类" :border="false">
            <div>{{ $getLabel(projectType, item.itemCategory) }}</div>
          </uni-form-item>
          <uni-form-item align="left" disabled label="设计要求及规范" :border="false">
            <div>{{ item.designRequirements }}</div>
          </uni-form-item>
          <uni-form-item label="实际抽样量" align="left" :border="false" disabled>
            <div>{{ item.sampleNum }}</div>
          </uni-form-item>
          <uni-form-item label="检查记录" align="left" :border="false" disabled>
            <div>{{ item.examineRecord }}</div>
          </uni-form-item>
          <uni-form-item label="检查结果" align="left" :border="false" disabled>
            <div>{{ $getLabel(resultList, item.examineResult) }}</div>
          </uni-form-item>
        </uni-card>

        <uni-card>
          <uni-form-item label="验收日期" :border="false" align="left" :disabled="true">
            <div>{{ info.acceptanceDate }}</div>
          </uni-form-item>
          <uni-form-item label="验收人" :border="false" align="left" :disabled="true">
            <div>{{ info.acceptanceManName }}</div>
          </uni-form-item>
          <uni-form-item label="备注" :border="false" align="left" :disabled="true">
            <div>{{ info.remark }}</div>
          </uni-form-item>
          <uni-form-item label="附件" :border="false" align="left" :disabled="true">
            <uni-attachment :value="info.fileIds" />
          </uni-form-item>
        </uni-card>

        <div style="height:14px" />
      </div>
    </scroll-view>
  </div>
</template>

<script>
import Api from '@/api/quality/accept'
import acceptType from '../acceptType'
import { get, find } from 'lodash'
export default {
  name: 'Edit',
  data() {
    return {
      info: {
        detailList: []
      },
      resultList: [
        { label: '通过', value: 1 },
        { label: '没通过', value: 0 }
      ],
      projectType: [
        { label: '主控项目', value: 1 },
        { label: '一般项目', value: 2 }
      ],
      id: null
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  computed: {
    type() {
      return get(find(acceptType, { value: this.info.acceptanceType }), 'name')
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      const res = await Api.getAcceptanceDetail(this.id)
      this.info = res.data
    },
    getResult(value) {
      return get(find(this.resultList, { value }), 'name')
    },
    getProjectType(value) {
      return get(find(this.projectType, { value }), 'name')
    }
  }
}
</script>

<style scoped lang="less">
@import url('../danwei/detail.less');
</style>
