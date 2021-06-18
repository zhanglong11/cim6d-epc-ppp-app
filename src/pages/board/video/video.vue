<template>
  <div class="content">
    <video :src="currentPlay" controls></video>
    <uni-tabs v-model="activeArea">
      <uni-tab-pane
        v-for="(item, i) in typeList"
        :key="i"
        :label="item.label"
        :name="i + 1"
        @click.native="selectType(item.value)"
      ></uni-tab-pane>
      <!--      <uni-tab-pane label="项目部" :name="1" @click.native="selectType('monitorArea_3')"></uni-tab-pane>-->
      <!--      <uni-tab-pane label="生活区" :name="2" @click.native="selectType('monitorArea_2')"></uni-tab-pane>-->
      <!--      <uni-tab-pane label="作业区" :name="3" @click.native="selectType('monitorArea_1')"></uni-tab-pane>-->
      <!--      <uni-tab-pane label="其他" :name="4" @click.native="selectType()"></uni-tab-pane>-->
    </uni-tabs>
    <div class="card">
      <ul>
        <li v-for="e in list" :key="e.id">
          <span :class="active === e.id ? 'blue' : ''" @click="handleLink(e)">{{ e.deviceName }}</span>
          <!--          <uni-status :options="statusList" :value="e.status"></uni-status>-->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Video',
  components: {},
  data() {
    return {
      activeArea: 1,
      disable: true,
      active: 0,
      typeList: [],
      queryForm: {
        // 查询条件
        monitorArea: '',
        status: 1,
        projectId: this.$store.state.project.projectId
      },
      currentPlay: 'http://ngrok3.gim6d.com:20013/video883.m3u8',
      statusList: [
        { label: '监控中', value: 1, color: '#55CA86' },
        { label: '停用', value: 2, color: '#FFC44F' },
        { label: '故障', value: 3, color: '#FF3B30' }
      ],
      list: [
        {
          id: 1,
          name: '大门001',
          status: 1
        },
        {
          id: 2,
          name: '大门002',
          status: 2
        },
        {
          id: 3,
          name: '食堂001',
          status: 3
        },
        {
          id: 1,
          name: '电表箱001',
          status: 1
        }
      ]
    }
  },
  onReady: function(res) {},
  created() {},
  mounted() {
    this.getTypeList()
  },
  methods: {
    refresh() {},
    // 获取监控区域
    getTypeList() {
      let list = this.$getArgList('monitorArea')
      // console.log(list)
      this.typeList = list
      this.selectType(list[0].value)
    },
    // 选择区域
    selectType(val) {
      this.queryForm.monitorArea = val
      this.queryList()
      // console.log(val)
    },
    queryList() {
      this.fly.construction.post(`/monitor/device/area/deviceList`, this.queryForm).then(res => {
        let datas = res.data || []
        this.list = datas
        if (datas.length) {
          // this.list = datas
          this.currentPlay = datas[0].deviceUrl || 'http://ngrok3.gim6d.com:20013/video882.m3u8'
        }
      })
    },
    handleLink(item) {
      this.currentPlay = item.deviceUrl
      this.active = item.id
    }
  }
}
</script>

<style scoped lang="less">
@import url('./video.less');
.blue {
  color: #0079fe;
}
</style>
