<template>
  <view class="main is-white">
    <uni-search-bar bgColor="#F9F9F9" placeholder="搜索项目名" @input="handleInput"></uni-search-bar>

    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view class="list-wrapper">
          <view
            v-for="item in computedList"
            :key="item.id"
            class="list-item"
            :class="{ active: activeId === item.id }"
            @click="handlerListItemClick(item)"
          >
            <view class="title">{{ item.name }}</view>
            <view class="check"></view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="computedList.length === 0" />
    <!-- 无数据空载页 end -->
    <!-- #ifdef MP -->
    <div class="footer-btn">
      <button type="primary" @click="setSelectedProjectInfo()">确定</button>
    </div>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    status: {
      default: null
    }
  },
  data() {
    return {
      activeId: '',
      activeName: '',
      keyWords: '', //搜索关键字
      list: [] //全部项目数组
    }
  },
  computed: {
    computedList() {
      if (this.keyWords) {
        return this.list.filter(e => e.name.toLowerCase().includes(this.keyWords.toLowerCase()))
      } else {
        return this.list
      }
    },

    ...mapGetters(['projectId'])
  },
  created() {
    this.init()
  },

  methods: {
    // 初始化
    init() {
      this.handleQueryEquipmentListInfo()
    },
    // 获取设备列表数据
    async handleQueryEquipmentListInfo() {
      let params = {
        page: 1,
        rows: 999,
        useStatus: this.status,
        projectId: this.projectId
      }
      let listinfo = await this.fly.material.post('equipment/list', params, { isLoading: true })
      let list = (listinfo.data && listinfo.data.records) || []
      this.list = list
      if (this.list.length === 0) {
        this.$utils.showToast('暂无可选择的设备')
        setTimeout(() => {
          //无可用设备时自动关闭选择页面
          this.$emit('selected')
        }, 1000)
      }
    },
    // 搜索
    handleInput({ value }) {
      this.keyWords = value
    },
    // 选择项目
    handlerListItemClick(item) {
      this.activeId = item.id
      this.activeName = item.name
      this.$emit('selected', {
        equipmentId: item.id,
        equipmentName: item.name
      })
    }
  }
}
</script>

<style lang="less" scope>
@import url('./select-equipment.less');
</style>
