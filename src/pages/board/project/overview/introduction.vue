<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="header">
        <swiper class="swiper" autoplay circular>
          <swiper-item v-for="(item, index) in imgList" :key="index">
            <img :src="item" />
          </swiper-item>
        </swiper>
        <view class="title">{{ baseInfo.name }}</view>
      </view>
      <view class="main-body">
        <uni-card title="项目简介">
          <uni-form-item label="项目地址" :border="false" align="left"
            >{{
              `${baseInfo.province || ''}${baseInfo.city || ''}${baseInfo.county || ''}${baseInfo.detailAddress || ''}`
            }}
          </uni-form-item>
          <uni-form-item label="项目类型" :border="false" align="left"
            >{{ $getLabelFromArg('projectType', baseInfo.type) }}
          </uni-form-item>
          <uni-form-item label="建筑面积" :border="false" align="left"
            >{{ baseInfo.buildingArea ? `${baseInfo.buildingArea}㎡` : '' }}
          </uni-form-item>
          <uni-form-item label="建筑总规模" :border="false" align="left"
            >{{ baseInfo.totalBuildingScale }}
          </uni-form-item>
          <uni-form-item label="建筑高度" :border="false" align="left">
            {{ baseInfo.buildingHeight ? `${baseInfo.buildingHeight}m` : '' }}
          </uni-form-item>
          <uni-form-item label="项目规模" :border="false" align="left"
            >{{ $getLabelFromArg('projectScale', baseInfo.scale) }}
          </uni-form-item>
          <uni-form-item label="抗震等级" :border="false" align="left">
            {{ $getLabelFromArg('seismicLevel', baseInfo.seismicLevel) }}
          </uni-form-item>
          <uni-form-item label="结构形式" :border="false" align="left">{{ baseInfo.structuralStyle }} </uni-form-item>
          <uni-form-item label="工程造价" :border="false" align="left"
            >{{ baseInfo.constructionCosts | formatMoneyBaseWan }}
          </uni-form-item>
        </uni-card>
        <uni-card title="建设成员">
          <uni-form-item label="项目经理" :border="false" align="left"
            >{{ $getLabel(principalList, baseInfo.principal) }}
          </uni-form-item>
          <uni-form-item label="联系方式" :border="false" align="left">{{ baseInfo.telephone }} </uni-form-item>
          <uni-form-item label="建设单位" :border="false" align="left">{{ unitInfo.jianshe }}</uni-form-item>
          <uni-form-item label="施工单位" :border="false" align="left"> {{ unitInfo.shigong }}</uni-form-item>
          <uni-form-item label="监理单位" :border="false" align="left"> {{ unitInfo.jianli }}</uni-form-item>
          <uni-form-item label="勘察单位" :border="false" align="left"> {{ unitInfo.kancha }}</uni-form-item>
          <uni-form-item label="设计单位" :border="false" align="left"> {{ unitInfo.sheji }}</uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
let dafault = require('../../../../static/images/project.png')
export default {
  data() {
    return {
      baseInfo: {},
      imgList: [],
      principalList: [], // 负责人列表
      unitInfo: {} //建设单位信息
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onShow() {
    this.init()
  },
  methods: {
    init() {
      this.queryProjectBaseInfo()
      // this.queryProjectParticipatingUnits()
      this.getPrincipalList()
    },
    async queryProjectBaseInfo() {
      let result = await this.fly.system.get(`/cim6d/system/project/get/${this.projectId}`)
      this.baseInfo = result.data || {}
      this.initUnit(result.data.participantDTOList)
      this.imgList = _.map(this.baseInfo.imageList || [dafault], 'fileUrl')
    },

    initUnit(unitList) {
      if (!unitList.length) {
        return
      }
      this.unitInfo = {
        jianshe: unitList.find(r => r.type === 'jianshe')?.participateCompanyName || '',
        shigong: unitList.find(r => r.type === 'shigong')?.participateCompanyName || '',
        jianli: unitList.find(r => r.type === 'jianli')?.participateCompanyName || '',
        kancha: unitList.find(r => r.type === 'kancha')?.participateCompanyName || '',
        sheji: unitList.find(r => r.type === 'sheji')?.participateCompanyName || ''
      }
    },

    // 获取项目建设单位信息
    async queryProjectParticipatingUnits() {
      let result = await this.fly.system.post(`projectParticipant/listAll`, { projectId: this.projectId })
      let datas = result.data || []

      let uniqData = _.uniqWith(
        _.map(datas, item => {
          return {
            type: item.type,
            typeName: item.typeName,
            participateCompanyName: item.participateCompanyName
          }
        }),
        _.isEqual
      )
      this.unitInfo = {}
      _.forEach(_.groupBy(uniqData, 'type'), (value, key) => {
        this.unitInfo[key] = _.map(value, 'participateCompanyName').join(',')
      })
    },
    // 获取项目负责人数据
    async getPrincipalList() {
      const param = { realName: '' }
      let result = await this.fly.system.post('/cim6d/system/user/query', param)
      let datas = result.data || []
      this.principalList = datas.map(item => {
        return { value: item.userId, label: item.userRealName }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./introduction.less');
</style>
