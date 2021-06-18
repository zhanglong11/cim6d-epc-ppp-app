<template>
  <view class="main">
    <uni-search-bar
      placeholder="创建人"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleClickItemInfo(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title flex-item jcb">
                  <span>期号-{{ item.issue }}</span>
                  <span
                    style="font-weight: normal"
                    :style="{ color: getConfirmationTypeColorByValue(item.confirmType) }"
                  >
                    {{ getConfirmationTypeByValue(item.confirmType) }}
                  </span>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">确认单月份：</view>
                  <view class="flex-item-content">{{ item.confirmMonth }}</view>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">确认期：</view>
                  <view v-if="item.confirmStartDate" class="flex-item-content"
                    >{{ item.confirmStartDate | formatData }}~{{ item.confirmEndDate | formatData }}</view
                  >
                </view>
                <view class="status">
                  <p>
                    <span class="circle" :style="{ backgroundColor: auditStatus[item.status].color }"></span
                    >{{ auditStatus[item.status].label }}
                  </p>
                </view>
              </view>
            </view>
            <view class="card-footer border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | formatData }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAddItemInfo" />
    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" :width="500" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">确认单月份</h6>
        <uni-date-picker
          v-model="drawerForm.confirmMonth"
          fields="month"
          mode="date"
          valueFormat="YYYY-MM"
        ></uni-date-picker>
        <h6 class="label">确认单类型</h6>
        <uni-checkbox-button-group
          v-model="drawerForm.confirmType"
          class="confirmation-type-checkbox"
          has-all
          :options="confirmationTypeList"
        />
        <h6 class="label">创建时间</h6>
        <uni-date-range
          class="drawer-custom"
          :start-date.sync="drawerForm.createTimeBegin"
          :end-date.sync="drawerForm.createTimeEnd"
        ></uni-date-range>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfirmList } from '../api/confirmation'
import auditStatus from './lib/auditStatus'
import {
  confirmationTypeList,
  getConfirmationTypeByValue,
  getConfirmationTypeColorByValue
} from './lib/confirmationTypeList'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        page: 1,
        rows: 10,
        status: '',
        projectId: wx.getStorageSync('projectId')
      },
      confirmationTypeList,
      loading: false,
      list: [],
      total: 0,
      auditStatus,
      drawerForm: {}
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    'filterForm.inspectStatus'() {
      this.init()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = this.filterForm
      getConfirmList(data)
        .then(res => {
          this.list = [...this.list, ...(res.data.records || [])]
          this.total = res.data.total
        })
        .finally(() => (this.loading = false))
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.creatorName = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.creatorName = ''
      this.init()
    },
    handleAddItemInfo() {
      const itemList = [
        {
          name: '新建建设费用确认单',
          handler: () => {
            this.$utils.toUrl('/pages/epcPpp/investment/confirmation/build-add')
          }
        },
        {
          name: '新建总投资确认单',
          handler: () => {
            this.$utils.toUrl('/pages/epcPpp/investment/confirmation/total-add')
          }
        }
      ]
      uni.showActionSheet({
        itemList: itemList.map(e => e.name),
        success: ({ tapIndex }) => {
          itemList[tapIndex].handler()
        }
      })
      this.$utils.toUrl('/pages/epcPpp/investment/confirmation/add')
    },
    handleClickItemInfo(row) {
      this.$utils.toUrl(
        `/pages/epcPpp/investment/confirmation/${['', 'build', 'total'][row.confirmType]}-${
          row.status === 0 ? 'add' : 'detail'
        }?id=${row.id}&status=${row.status}`
      )
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },

    handleDrawerFormChange() {
      this.filterForm = _.cloneDeep(this.drawerForm)
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    getConfirmationTypeByValue,
    getConfirmationTypeColorByValue
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../styles/list.less');
@import url('list.less');
.confirmation-type-checkbox {
  /deep/ li {
    width: 45%;
  }
}
.drawer-custom {
  /deep/ .w-picker-cnt {
    left: -250px;
    font-size: 40px;
    width: 750px !important;
  }
}
</style>
