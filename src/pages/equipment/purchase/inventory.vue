<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y>
      <view class="main-body">
        <checkbox-group @change="checkboxChange">
          <uni-card v-for="item in list" :key="item.id">
            <view class="card-body">
              <checkbox :value="item.id" :checked="item.checked" />
              <view class="card-info">
                <view class="title flex-item">{{ item.name }}</view>
                <view class="flex-item">
                  <view class="flex-item-label">设备类别：</view>
                  <view class="flex-item-content">{{ $getLabel(equipmentType, item.type) }}</view>
                </view>
                <view class=" flex-item">
                  <view class="flex-item-label">单位：</view>
                  <view class="flex-item-content">{{ item.unit }}</view>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">规格型号：</view>
                  <view class="flex-item-content">{{ item.models }}</view>
                </view>
                <view class=" flex-item">
                  <view class="flex-item-label">库存量：</view>
                  <view class="flex-item-content">{{ item.inventoryNumber }}</view></view
                >
              </view>
            </view>
          <!--  <view class="card-footer  border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | ymd }}</text>
            </view>-->
          </uni-card>
        </checkbox-group>
      </view>
    </scroll-view>

    <EmptyTemplate v-if="total === 0" />

    <view class="btn-wrapper">
      <button class="button" type="primary" @click="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/equipmentPurchase'
import _ from 'lodash'
import equipmentType from './lib/equipmentType'
export default {
  name: 'InventorySelect',
  props: {
    checked: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      equipmentType,
      filterForm: {
        search: '',
        page: 1,
        rows: 999, //一次性加载全部数据，避免打开窗口时无法渲染选中项
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      checkedValue: []
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.checkedValue = this.checked
  },
  mounted() {
    this.init()
  },

  methods: {
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      Api.queryStoreList(data).then(res => {
        this.list = res.data.records || []
        this.total = res.data.total
      })
      _.forEach(this.list, item => {
        _.set(item, 'checked', this.checkedValue.includes(item.id))
      })
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.search = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.search = ''
      this.init()
    },
    // 选中或取消选中复选框时
    checkboxChange(event) {
      console.log(event)
      this.checkedValue = event.detail.value
    },
    handleSubmit() {
      if (this.checkedValue.length === 0) {
        this.$utils.showToast('当前没有选中项')
        return
      }
      let checked = []
      checked = this.list.filter(item => this.checkedValue.includes(item.id))
      this.$emit('selected', {
        checkedValue: this.checkedValue,
        checked
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./inventory.less');
</style>
