<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view>
          <view class="card">
            <!-- 点位选择组件 start -->
            <uni-select-anchor :defaultData="info" anchorType="safe" />
            <!-- 点位选择组件 start -->
            <!-- <uni-form-item label="工程类别">
              <view class="disabled">{{ info.engineeringCategory }}</view>
            </uni-form-item>-->
            <uni-form-item label="问题类型">
              <view class="disabled">{{ $getLabel(safetyQuestionTypeList, info.issueType) }}</view>
            </uni-form-item>
            <uni-form-item label="问题描述">
              <view class="disabled">{{ info.description }}</view>
            </uni-form-item>
            <uni-form-item class="file-item" label="现场照片">
              <uni-attachment v-model="info.imageIds"></uni-attachment>
            </uni-form-item>
            <uni-form-item label="整改要求">
              <view class="disabled">{{ info.rectificationRequirement }}</view>
            </uni-form-item>
            <uni-form-item label="责任人">
              <view class="disabled">{{ info.pushPersonName }}</view>
            </uni-form-item>
            <uni-form-item label="整改期限">
              <view class="disabled">{{ info.rectificationDate | ymd }}</view>
            </uni-form-item>
            <uni-form-item label="发现人">
              <view class="disabled">{{ info.discoveryPersonName }}</view>
            </uni-form-item>
            <uni-form-item label="发现日期">
              <view class="disabled">{{ info.discoveryDate | ymd }}</view>
            </uni-form-item>
          </view>
        </view>
        <!--<view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading">
            保存
          </button>
        </view>-->
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Api from '@/pages/epcPpp/safety/api'
import { mapGetters } from 'vuex'
export default {
  name: 'EpcPPPSafetyNoCancelDetail',
  components: {},
  data() {
    return {
      info: {},
      id: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    //工程类型
    /* engineeringTypeList() {
      return (
        this.$getArgList('epcPPPEngineeringType') || [
          { value: 1, label: '混凝土工程' },
          { value: 2, label: '模板工程' },
          { value: 3, label: '钢筋工程' },
          { value: 4, label: '砌体工程' },
          { value: 5, label: '防水工程1' }
        ]
      )
    },*/
    //问题类型
    safetyQuestionTypeList() {
      return this.$getArgList('epcPPPSafetyIssueType')
    }
  },
  onLoad(options) {
    this.id = options.id
    this.init()
  },
  onShow() {},
  mounted() {},
  methods: {
    //初始化页面参数
    init() {
      this.getDetail()
    },
    //获取详情
    async getDetail() {
      let res = await Api.getDetail(this.id)
      this.info = { ...res.data }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./detail.less');
</style>
