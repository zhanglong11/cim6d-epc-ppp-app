<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div>
        <uni-card>
          <uni-form-item label="验收名称" isRequired>
            <div>{{ info.acceptanceName }}{{ info.acceptanceApplyNumber }}</div>
          </uni-form-item>
          <uni-form-item label="验收类型" align="left" :disabled="true">
            <div>{{ type }}</div>
          </uni-form-item>
          <uni-form-item label="分部编号" :border="false" align="left" :disabled="true">
            <div>{{ info.engineeringNumber }}</div>
          </uni-form-item>
          <uni-form-item label="分部名称" :border="false" align="left" :disabled="true">
            <div>{{ info.engineeringName }}</div>
          </uni-form-item>
          <uni-form-item label="分部数量" :border="false" align="left" :disabled="true">
            <div>{{ info.targetList.length || 0 }}</div>
          </uni-form-item>
        </uni-card>
        <div v-if="info.targetList" class="card-title">
          分部明细
        </div>
        <uni-card v-for="(item, i) in info.targetList" :key="i">
          <uni-form-item label="序号" :border="false" align="left" :disabled="true">
            <div>{{ i + 1 }}</div>
          </uni-form-item>
          <uni-form-item label="分项名称" :border="false" align="left" :disabled="true">
            <div>{{ item.engineeringName }}</div>
          </uni-form-item>
          <uni-form-item label="检验批数量" :border="false" align="left" :disabled="true">
            <div>{{ item.acceptanceNum }}</div>
          </uni-form-item>
          <uni-form-item label="检查结果" :border="false" align="left" :disabled="true">
            <!--            <div>{{ getResult(item.examineResult) }}</div>-->
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
          <!--          <uni-form-item label="抄送" :border="false" align="left" :disabled="true">-->
          <!--            <div>{{ info.name }}</div>-->
          <!--          </uni-form-item>-->
          <!--          <uni-form-item label="验收结果" :border="false" align="left" :disabled="true">-->
          <!--            <div>{{ info.name }}</div>-->
          <!--          </uni-form-item>-->
          <uni-form-item label="备注" :border="false" align="left" :disabled="true">
            <div>{{ info.remark }}</div>
          </uni-form-item>
          <uni-form-item label="附件" :border="false" align="left" :disabled="true">
            <uni-attachment :value="info.fileIds" />
          </uni-form-item>
        </uni-card>
        <div style="height:14px"></div>
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
        targetList: []
      },
      resultList: [
        { label: '通过', value: 1 },
        { label: '没通过', value: 0 }
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
    }
  }
}
</script>

<style scoped lang="less">
@import url('../danwei/detail.less');
</style>
