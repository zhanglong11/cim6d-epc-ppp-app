<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card
            v-for="item in list"
            :key="item.id"
            @click="$utils.toUrl('/pages/epcPpp/notice/detail?id=' + item.id)"
          >
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.title }}</view>
                <view class="flex-wrapper">
                  <view class="flex-item">
                    <view class="flex-item-label">公告类型：</view>
                    <view class="flex-item-content">{{ ['', '系统消息', '个人消息'][item.type] }}</view>
                  </view>
                  <view class="flex-item">
                    <uni-status
                      v-model="item.isRead"
                      :options="[
                        { label: '未查看', value: 0, color: '#999999' },
                        { label: '已查看', value: 1, color: '#25CC70' }
                      ]"
                    ></uni-status>
                  </view>
                </view>
              </view>
            </view>
            <view class="card-footer border-top">
              <text>发送人：{{ item.creatorName }}</text>
              <text>发送时间： {{ item.createTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click="$utils.toUrl('/pages/epcPpp/notice/add')"></uni-add>
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <h6>年度分析</h6>
      <uni-checkbox-button-group
        v-model="drawerForm.type"
        :options="[
          { label: '个人消息', value: 2 },
          { label: '系统消息', value: 1 },
          { label: '全部', value: '' }
        ]"
      >
      </uni-checkbox-button-group>
      <h6>月度分析</h6>
      <uni-checkbox-button-group
        v-model="drawerForm.isRead"
        :options="[
          { label: '已查看', value: 1 },
          { label: '未查看', value: 0 },
          { label: '全部', value: '' }
        ]"
      >
      </uni-checkbox-button-group>
      <h6>开始时间</h6>
      <uni-date-picker v-model="drawerForm.startDate" fields="minute"></uni-date-picker>
      <h6>结束时间</h6>
      <uni-date-picker v-model="drawerForm.endDate" fields="minute"></uni-date-picker>
    </uni-drawer-custom>
    <EmptyTemplate v-if="total === 0" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import api from './api'
import _ from 'lodash'
export default {
  data() {
    return {
      drawerForm: {},
      filterForm: {
        keyword: '',
        page: 1,
        rows: 10,
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    filterForm: {
      deep: true,
      handler() {
        this.init()
      }
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'filter') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      api
        .queryListNotice(this.filterForm)
        .then(res => {
          this.list = res.data.records
          this.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    handleSearchBarInput(e) {
      this.filterForm.keyword = e.value.trim()
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/common.less';
@import '~@/styles/list.less';
.uni-searchbar {
  margin-top: 0;
}

.card-info {
  flex: 1;
  width: 50%;
  position: relative;

  .flex-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow: hidden;
    .flex-item {
      padding: 0 10px;
      display: flex;
      max-width: 65%;

      align-items: flex-start;
      .flex-item-label {
        flex-basis: auto;
        white-space: nowrap;
      }
      .flex-item-content {
        .ellipsis;
      }
    }
  }
}
.uni-drawer-custom {
  h6 {
    font-weight: normal;
    font-size: 14px;
    margin-bottom: 15px;
  }
}
</style>
