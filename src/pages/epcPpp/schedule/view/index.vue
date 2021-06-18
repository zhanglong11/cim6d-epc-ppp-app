<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y>
      <view class="main-body">
        <block>
          <uni-card
            v-for="item in computedList"
            :key="item.unicode"
            @click="$utils.toUrl('/pages/epcPpp/schedule/view/detail?unicode=' + item.unicode)"
          >
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.scheduleFileName }}</view>
                <view class="flex-wrapper">
                  <view class="flex-item">
                    <view class="flex-item-label">合计进度：</view>
                    <view class="flex-item-content">{{ item.taskCount }}</view>
                  </view>
                  <view class="flex-item">
                    <view class="flex-item-label">已完成进度：</view>
                    <view class="flex-item-content">{{ item.finishedCount }}</view>
                  </view>
                </view>
                <view class="flex-wrapper">
                  <view class="flex-item">
                    <view class="flex-item-label">已领取进度：</view>
                    <view class="flex-item-content">{{ item.receivedCount }}</view>
                  </view>
                  <view class="flex-item">
                    <view class="flex-item-label">已延期进度：</view>
                    <view class="flex-item-content">{{ item.delayCount }}</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="card-footer border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <EmptyTemplate v-if="total === 0" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../api'
import _ from 'lodash'
export default {
  data() {
    return {
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
    ...mapGetters(['projectId']),
    computedList() {
      if (this.filterForm.keyword) {
        return this.list.filter(e => e.scheduleFileName.includes(this.filterForm.keyword))
      } else {
        return this.list
      }
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
        .getSchedulePlanList()
        .then(res => {
          this.list = res.data
          this.total = res.data.length
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
  position: relative;
  .title {
    width: 620px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .flex-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow: hidden;
    .flex-item {
      width: 50%;
      padding: 0 10px;
      display: flex;
    }
  }
}
</style>
