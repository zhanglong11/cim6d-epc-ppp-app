<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y>
      <view class="main-body">
        <checkbox-group>
          <uni-card v-for="item in list" :key="item.id" isHover @click="changeBox(item)">
            <view class="card-body">
              <checkbox :value="item.id" :checked="item.checked" />
              <view class="card-info">
                <view class="title flex-item">{{ item.name }}</view>
                <view class="flex-item">
                  <view class="flex-item-label">材料编码：</view>
                  <view class="flex-item-content">{{ item.code }}</view>
                </view>
                <view class=" flex-item">
                  <view class="flex-item-label">品牌：</view>
                  <view class="flex-item-content">{{ item.brand }}</view>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">规格型号：</view>
                  <view class="flex-item-content">{{ item.models }}</view>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">预算量：</view>
                  <view class="flex-item-content">{{ item.budgetNumber }}</view>
                </view>
                <view class=" flex-item">
                  <view class="flex-item-label">库存量：</view>
                  <view class="flex-item-content">{{ item.inventoryNumber }}</view></view
                >
                <view class=" flex-item">
                  <view class="flex-item-label">已消耗量：</view>
                  <view class="flex-item-content">{{ item.consumeNumber }}</view></view
                >
              </view>
            </view>
            <view class="card-footer  border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | ymd }}</text>
            </view>
          </uni-card>
        </checkbox-group>
      </view>
    </scroll-view>

    <EmptyTemplate v-if="total === 0" />

    <view class="btn-wrapper">
      <button v-if="hasClose" class="button default" @click="close">返回</button>
      <button class="button" type="primary" @click="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { Api } from '@/api/material/purchaseOrder'
import _ from 'lodash'
export default {
  name: 'InventorySelect',
  props: {
    // 选中的ids
    checked: {
      type: Array,
      default() {
        return []
      }
    },
    // 禁止选择或隐藏的ids
    disabledIds: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否显示返回按钮
    hasClose: {
      type: Boolean,
      default: false
    },
    // 是否可以不选择
    hasChoice: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterForm: {
        search: '',
        page: 1,
        rows: 999, //一次性加载全部数据，避免打开窗口时无法渲染选中项
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      checkedValue: [],
      disabledList: this.disabledIds || [] // 禁用的列表
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    checked(val) {
      this.checkedValue = [...val]
      this.list.map(e => {
        e.checked = this.checkedValue.length > 0 && this.checkedValue.includes(e.id)
      })
    },
    disabledIds(val) {
      this.disabledList = val
      this.init()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.checkedValue = [...this.checked]
  },
  mounted() {
    this.init()
  },

  methods: {
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      Api.getPurchaseOrderAddList(data).then(res => {
        let datas = res.data
        let list = datas.records || []
        list.map(e => {
          e.checked = this.checkedValue.length > 0 && this.checkedValue.includes(e.id)
        })
        this.list = list.filter(e => !this.disabledList.includes(e.id))
        this.total = datas.total
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
      this.checkedValue = event.detail.value
    },
    // 选择
    changeBox(item) {
      let index = this.checkedValue.indexOf(item.id)
      console.log(`index${index}`)
      if (index < 0) {
        this.checkedValue.push(item.id)
      } else {
        this.checkedValue.splice(index, 1)
      }
      item.checked = !item.checked
    },
    handleSubmit() {

      if (this.checkedValue.length === 0 && !this.hasChoice) {
        this.$utils.showToast('当前没有选中项')
        return
      }
      let checked = []
      // console.log(this.list)
      checked = this.list.filter(item => this.checkedValue.includes(item.id))
      // console.log('checked',checked)
      this.$emit('selected', {
        checkedValue: this.checkedValue,
        checked
      })
    },
    // 返回
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('inventory.less');
</style>
