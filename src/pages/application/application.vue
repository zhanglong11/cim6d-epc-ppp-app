<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card v-if="$hasPower('KanbanInfo')" title="看板信息" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('ProjectKanban')" @click="$utils.toUrl('/pages/board/project/project')">
              <image class="list-icon" src="@/static/images/application/ProjectKanban.png"></image>
              <p>项目看板</p>
            </li>
            <li
              v-if="$hasPower('ProjectIntroduction')"
              @click="$utils.toUrl('/pages/board/project/overview/introduction')"
            >
              <image class="list-icon" src="@/static/images/application/ProjectIntroduction.png"></image>
              <p>项目介绍</p>
            </li>
            <li v-if="$hasPower('EquipmentMonitoring')" @click="$utils.toUrl('/pages/board/video/video')">
              <image class="list-icon" src="@/static/images/application/EquipmentMonitoring.png"></image>
              <p>视频监控</p>
            </li>
            <li v-if="$hasPower('Milepost')" @click="$utils.toUrl('/pages/board/milestone/milestone')">
              <image class="list-icon" src="@/static/images/application/Milepost.png"></image>
              <p>里程碑</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('EpcPppSchedule')" title="进度管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('EpcPppScheduleView')" @click="$utils.toUrl('/pages/epcPpp/schedule/view/index')">
              <image class="list-icon" src="@/static/images/application/EpcPppScheduleView.png"></image>
              <p>进度查看</p>
            </li>
            <!-- <li @click="$utils.toUrl('/pages/schedule/step-1')">
              <image class="list-icon" src="@/static/images/application/ScheduleFillIn.png"></image>
              <p>进度关联BIM</p>
            </li>-->
            <li v-if="$hasPower('EpcPppScheduleAnalyze')" @click="$utils.toUrl('/pages/epcPpp/schedule/analyze/index')">
              <image class="list-icon" src="@/static/images/application/EpcPppScheduleAnalyze.png"></image>
              <p>进度分析</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('EpcPppQuality')" title="质量管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('EpcPppQualityDetail')" @click="$utils.toUrl('/pages/epcPpp/quality/list')">
              <image class="list-icon" src="@/static/images/application/EpcPppQualityDetail.png"></image>
              <p>质量管理</p>
            </li>
            <li
              v-if="$hasPower('EpcPppQualityQuestionAnalysis')"
              @click="$utils.toUrl('/pages/epcPpp/quality/analysis')"
            >
              <image class="list-icon" src="@/static/images/application/EpcPppQualityQuestionAnalysis.png"></image>
              <p>质量问题分析</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('EpcPppSafety')" title="安全文明管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('EpcPppSafetyDetail')" @click="$utils.toUrl('/pages/epcPpp/safety/list')">
              <image class="list-icon" src="@/static/images/application/EpcPppSafetyDetail.png"></image>
              <p>安全管理</p>
            </li>
            <li v-if="$hasPower('EpcPppSafetyQuestionAnalysis')" @click="$utils.toUrl('/pages/epcPpp/safety/analysis')">
              <image class="list-icon" src="@/static/images/application/EpcPppSafetyQuestionAnalysis.png"></image>
              <p>安全问题分析</p>
            </li>
          </ul>
        </uni-card>
        <uni-card title="BIM模型" :hideTitle="false">
          <ul class="list">
            <li @click="progressSimulation(1)">
              <image class="list-icon" src="@/static/images/application/ModelEpcPpp.png"></image>
              <p>BIM模型</p>
            </li>
            <li v-if="$hasPower('EpcPppScheduleView')" @click="$utils.toUrl('/pages/epcPpp/schedule/view/index')">
              <image class="list-icon" src="@/static/images/application/EpcPppScheduleView.png"></image>
              <p>进度查看</p>
            </li>
            <li v-if="$hasPower('EpcPppQualityDetail')" @click="$utils.toUrl('/pages/epcPpp/quality/list')">
              <image class="list-icon" src="@/static/images/application/EpcPppQualityDetail.png"></image>
              <p>质量问题查看</p>
            </li>
            <li v-if="$hasPower('EpcPppSafetyDetail')" @click="$utils.toUrl('/pages/epcPpp/safety/list')">
              <image class="list-icon" src="@/static/images/application/EpcPppSafetyDetail.png"></image>
              <p>安全问题查看</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('InvestmentEpcPpp')" title="投资管理" :hideTitle="false">
          <ul class="list">
            <li
              v-if="$hasPower('InvestmentConfirmationEpcPpp')"
              @click="$utils.toUrl('/pages/epcPpp/investment/confirmation/list')"
            >
              <image class="list-icon" src="@/static/images/application/InvestmentConfirmationEpcPpp.png"></image>
              <p>投资确认</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('EpcPppCcp')" title="党建管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('EpcPppCcpHome')" @click="$utils.toUrl('/pages/epcPpp/partyConstruct/home/index')">
              <image class="list-icon" src="@/static/images/application/EpcPppCcpHome.png"></image>
              <p>党建首页</p>
            </li>
            <li v-if="$hasPower('EpcPppCcpData')" @click="$utils.toUrl('/pages/epcPpp/partyConstruct/data/index')">
              <image class="list-icon" src="@/static/images/application/EpcPppCcpData.png"></image>
              <p>党建资料</p>
            </li>
            <!--<li @click="$utils.toUrl('/pages/epcPpp/partyConstruct/activityPreview/index')">
              <image class="list-icon" src="@/static/images/application/IndustryDataList.png"></image>
              <p>党建预告</p>
            </li>-->
            <li
              v-if="$hasPower('EpcPppCcpActivity')"
              @click="$utils.toUrl('/pages/epcPpp/partyConstruct/activity/index')"
            >
              <image class="list-icon" src="@/static/images/application/EpcPppCcpActivity.png"></image>
              <p>党建活动</p>
            </li>
            <li v-if="$hasPower('EpcPppCcpNews')" @click="$utils.toUrl('/pages/epcPpp/partyConstruct/news/index')">
              <image class="list-icon" src="@/static/images/application/EpcPppCcpNews.png"></image>
              <p>党建要闻</p>
            </li>
          </ul>
        </uni-card>
        <uni-card title="常用办公" :hideTitle="false">
          <ul class="list">
            <!--epc-ppp 功能-->
            <li v-if="$hasPower('NoticeEpcPpp')" @click="$utils.toUrl('/pages/epcPpp/notice/index')">
              <image class="list-icon" src="@/static/images/application/NoticeEpcPpp.png" />
              <p>通知公告</p>
            </li>
            <li v-if="$hasPower('DocumentEpcPpp')" @click="$utils.toUrl('/pages/epcPpp/document/index')">
              <image class="list-icon" src="@/static/images/application/DocumentEpcPpp.png" />
              <p>资料管理</p>
            </li>
            <!--epc-ppp 功能-->
            <!-- 未登录占位 start -->
            <template v-if="!token">
              <li @click="$utils.toUrl()">
                <image class="list-icon" src="@/static/images/application/Model.png" />
                <p>BIM模型</p>
              </li>
              <li @click="$utils.toUrl()">
                <image class="list-icon" src="@/static/images/application/EpcPppScheduleView.png" />
                <p>进度管理</p>
              </li>
              <li @click="$utils.toUrl()">
                <image class="list-icon" src="@/static/images/application/Quality.png" />
                <p>质量管理</p>
              </li>
              <li @click="$utils.toUrl()">
                <image class="list-icon" src="@/static/images/application/Safe.png" />
                <p>安全管理</p>
              </li>
            </template>
            <!-- 未登录占位 end -->
            <!--
            <li @click="$utils.toUrl('')">
              <image class="list-icon" src="@/static/images/application/kaoqinshezhi.png"></image>
              <p>考勤设置</p>
            </li>
             -->
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('InfoEpcPpp')" title="信息化管理" :hideTitle="false">
          <ul class="list">
            <li
              v-if="$hasPower('ConstructionDayEpcPpp')"
              @click="$utils.toUrl('/pages/epcPpp/informationManage/constructionDayLog/index')"
            >
              <image class="list-icon" src="@/static/images/application/SupervisionDayEpcPpp.png"></image>
              <p>施工日志</p>
            </li>
            <li
              v-if="$hasPower('ConstructionWeekEpcPpp')"
              @click="$utils.toUrl('/pages/epcPpp/informationManage/constructionWeekLog/index')"
            >
              <image class="list-icon" src="@/static/images/application/ConstructionWeekEpcPpp.png"></image>
              <p>施工周报</p>
            </li>
            <li
              v-if="$hasPower('SupervisionDayEpcPpp')"
              @click="$utils.toUrl('/pages/epcPpp/informationManage/supervisionDayLog/index')"
            >
              <image class="list-icon" src="@/static/images/application/SupervisionDayEpcPpp.png"></image>
              <p>监理日志</p>
            </li>
            <li
              v-if="$hasPower('SupervisionWeekEpcPpp')"
              @click="$utils.toUrl('/pages/epcPpp/informationManage/supervisionWeekLog/index')"
            >
              <image class="list-icon" src="@/static/images/application/SupervisionWeekEpcPpp.png"></image>
              <p>监理周报</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'Application',
  data() {
    return {}
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    token() {
      return this.$store.state.user.token
    }
  },
  methods: {
    // 进度模拟
    progressSimulation(type) {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=${type}`)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
