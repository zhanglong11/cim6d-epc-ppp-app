<template>
  <view class="main is-white">
    <div v-if="dataList.length > 0" class="project-list-wrap">
      <ul class="project-list">
        <li v-for="(item, i) in dataList" :key="i" :class="{ active: activeId === item.id }" @click="selectItem(item)">
          <span class="title">{{ item.entityName }}</span>
          <span class="check"></span>
        </li>
      </ul>
    </div>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="dataList.length === 0" />
    <!-- 无数据空载页 end -->
    <!-- #ifdef MP -->
    <div class="footer-btn">
      <button type="primary" @click="changeItem()">确定</button>
    </div>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      dataList: [
        {
          id: '1',
          entityId: 'bim_90023add8c654d678ac265716516ace5_1',
          entityName: '1#楼样板间'
        },
        {
          id: '2',
          entityId: 'bim_84b4b448679b4818833fdd2a8606b6bb_1',
          entityName: '2#楼样板间'
        },
        {
          id: '3',
          entityId: 'bim_90023add8c654d678ac265716516ace5_1',
          entityName: '3#楼样板间'
        },
        {
          id: '4',
          entityId: 'bim_4eee2785a9b54725b6b9c6080e1396de_1',
          entityName: '4#楼样板间'
        },
        {
          id: '5',
          entityId: 'bim_630bd8b0c5704b65a4a528900a3f6b1c_1',
          entityName: '5#楼样板间'
        }
      ],
      activeId: '',
      entityId: '',
      entityName: ''
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.userId
    }
  },
  mounted() {
    this.init()
  },
  // 顶部按钮点击事件
  onNavigationBarButtonTap(obj) {
    if (obj.text === '确定') {
      this.changeItem()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
  },
  methods: {
    // 初始化
    init() {
      if (this.userId !== 'be8b92183eea4ab795de3c40abdefbd8') {
        this.dataList = []
      }
    },
    // 选择单体
    selectItem(item) {
      this.activeId = item.id
      this.entityId = item.entityId
      this.entityName = item.entityName
    },
    // 确定选择
    changeItem() {
      if (this.activeId) {
        this.$utils.toUrl(`/pages/bim-model/model-room-details?entityId=${this.entityId}&entityName=${this.entityName}`)
      } else {
        this.$utils.showToast('请先选择样板间')
      }
    }
  }
}
</script>

<style lang="less" scope>
@import url('./select-monomer.less');
</style>
