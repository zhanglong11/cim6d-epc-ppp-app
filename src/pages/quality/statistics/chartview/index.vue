<template>
  <div class="main grey">
    <div class="chart-container">
      <pie-chart :dataAs="pieData" :legendAs="legendAs" :colors="colors" canvasId="quality_pie_1" />
    </div>
    <div class="list-Container">
      <div class="title-content">
        <div class="item">
          <div class="val red">{{ problemNum }}</div>
          <div class="label hasBorder">问题数量</div>
        </div>
        <div class="item">
          <div class="val orange">{{ notReviewedNum }}</div>
          <div class="label hasBorder">待复检</div>
        </div>
        <div class="item">
          <div class="val blue">{{ reviewPassRate }}%</div>
          <div class="label hasBorder">检查合格率</div>
        </div>
        <div class="item">
          <div class="val blue">{{ rectifyInTimeRate }}%</div>
          <div class="label">及时整改率</div>
        </div>
      </div>
      <h4>质量问题</h4>
      <div class="list">
        <div v-for="(item, index) of listData" :key="index + Math.random()" class="list-item">
          <p>{{ item.title }}</p>
          <div>
            <span class="level" :style="{ backgroundColor: level[item.emergencyLevel - 1].color }">{{
              level[item.emergencyLevel - 1].label
            }}</span
            ><span class="content">{{ item.issueDescription }}</span>
          </div>
        </div>
        <EmptyTemplate v-if="listData.length === 0" />
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from '@/components/stan-ucharts/PieChart.vue'
import Api from '@/api/quality/statistics'
export default {
  name: 'ChartView',
  components: { PieChart },
  data() {
    return {
      pieData: {
        series: [
          {
            name: '一般隐患',
            data: 0
          },
          {
            name: '较大隐患',
            data: 0
          },
          {
            name: '重大隐患',
            data: 0
          },
          {
            name: '严重隐患',
            data: 0
          }
        ]
      },
      legendAs: {
        legend: {
          show: true, //是否显示各类别的图例标识
          position: 'bottom',
          float: 'center',
          padding: 10,
          margin: 0
        }
      },
      problemNum: 0, //问题数量
      notReviewedNum: 0, //待复检数量
      reviewPassRate: 0, //复检合格率
      rectifyInTimeRate: 0, //及时整改率
      colors: ['#0079fe', '#fecc68', '#fe9225', '#f00'],
      listData: [],
      level: [
        { value: 1, label: '一般隐患', color: '#0079fe' },
        { value: 2, label: '较大隐患', color: '#fecc68' },
        { value: 3, label: '重大隐患', color: '#fe9225' },
        { value: 4, label: '严重隐患', color: '#f00' }
      ]
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  watch: {},
  onLoad(options) {},
  created() {
    this.init()
  },
  mounted() {},
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  // 顶部按钮点击事件
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'bim') {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=2`)
    }
  },
  methods: {
    async init() {
      await this.getData()
      await this.getList()
    },
    //获取图表数据
    async getData() {
      let res = await Api.getData({
        planType: 1
      })
      let {
        generalTroubleNum, //一般隐患
        largerTroubleNum, //较大隐患
        majorTroubleNum, //重大隐患
        seriousTroubleNum, //严重隐患
        problemNum, //问题数量
        notReviewedNum, //待复检数量
        reviewPassRate, //复检合格率
        rectifyInTimeRate //及时整改率
      } = res.data
      this.pieData = {
        ...{
          series: [
            {
              name: '一般隐患',
              data: generalTroubleNum
            },
            {
              name: '较大隐患',
              data: largerTroubleNum
            },
            {
              name: '重大隐患',
              data: majorTroubleNum
            },
            {
              name: '严重隐患',
              data: seriousTroubleNum
            }
          ]
        }
      }
      this.listData = []
      this.problemNum = problemNum
      this.notReviewedNum = notReviewedNum
      this.reviewPassRate = reviewPassRate
      this.rectifyInTimeRate = rectifyInTimeRate
    },
    //获取问题数据
    async getList() {
      let res = await Api.getList({
        planType: 1
      })
      this.listData = res.data
    }
  }
}
</script>

<style scoped lang="less">
@import url('./index.less');
</style>
