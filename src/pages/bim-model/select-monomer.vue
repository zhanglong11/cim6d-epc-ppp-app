<template>
  <view class="main is-white">
    <scroll-view class="scroll-roll" scroll-y>
      <div v-if="dataList.length > 0" class="project-list-wrap">
        <ul class="project-list">
          <li
            v-for="item in dataList"
            :key="item.entityId"
            :class="{ active: entityId === item.id }"
            @click="selectItem(item)"
          >
            <span class="title">版本{{ item.versionCode }}</span>
            <span class="time">{{ item.createTime }}</span>
            <span class="check"></span>
          </li>
        </ul>
      </div>
      <!-- 无数据空载页 start -->
      <EmptyTemplate v-if="dataList.length === 0" />
      <!-- 无数据空载页 end -->
    </scroll-view>
    <!-- #ifdef MP -->
    <div class="footer-btn">
      <button type="primary" @click="changeItem()">确定</button>
    </div>
    <!-- #endif -->
  </view>
</template>

<script>
import { projectAPI } from '@/api/project'
import { workingAPI } from '@/api/working'
export default {
  components: {},
  data() {
    return {
      dataList: [],
      entityId: '',
      configId: '',
      entityName: '',
      queryForm: {
        page: 1,
        projectId: '',
        rows: 100
      }
    }
  },
  computed: {
    computedList() {
      if (this.q) {
        return this.list.filter(e => e.name.toLowerCase().includes(this.q.toLowerCase()))
      } else {
        return this.list
      }
    },
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  mounted() {
    this.queryList()
  },
  // 顶部按钮点击事件
  onNavigationBarButtonTap(obj) {
    if (obj.text === '确定') {
      this.changeItem()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.queryList()
  },
  methods: {
    // 项目下单体列表
    async queryList() {
      if (!this.projectId) {
        return
      }
      this.queryForm.projectId = this.projectId
      const result = await workingAPI.queryBimVersion(this.queryForm)
      let datas = result.data.records || []
      this.dataList = datas.sort(this.$utils.setSort('entityName'))
      if (datas.length === 1) {
        // 只有一条数据直接跳转
        this.selectItem(datas[0])
        this.changeItem()
      }
    },
    // 选择单体
    selectItem(item) {
      this.entityId = item.id
      this.entityName = '查看模型'
    },
    // 确定选择
    changeItem() {
      if (this.entityId) {
        this.$utils.toUrl(
          `/pages/bim-model/index?entityId=${this.entityId}&entityName=${this.entityName}&showBtn=true&bimType=1`
        )
      } else {
        this.$utils.showToast('请先选择单体')
      }
    }
  }
}
</script>

<style lang="less" scope>
@import url('./select-monomer.less');
</style>
