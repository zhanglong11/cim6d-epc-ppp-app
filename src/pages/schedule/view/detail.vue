<template>
  <div class="main">
    <uni-search-bar style="margin-bottom: 15px;" placeholder="搜索" @input="handleSearchBarInput"></uni-search-bar>
    <uni-card-tree :list="computedList" itemKey="taskId">
      <template v-slot="{ item }">
        <div
          class="item"
          :style="{ color: item.status === 5 ? 'red' : item.status === 3 ? '#00CC66' : '' }"
          @click="$utils.toUrl('/pages/schedule/view/taskDetail?id=' + item.taskId)"
        >
          <h6 :style="{ color: [2, 5].includes(item.status) ? 'red' : item.status === 3 ? '#00CC66' : '' }">
            {{ item.taskName }}
          </h6>
          <ul>
            <li>
              <span>计划开始日期:</span><span>{{ item.planStartDate | ymd }}</span>
            </li>
            <li>
              <span>计划结束日期:</span><span>{{ item.planEndDate | ymd }}</span>
            </li>
          </ul>
          <uni-status :options="taskStatusList" :value="item.status"></uni-status>
          <footer class="border-top">
            <span>领取人： {{ item.receivePersonName }}</span>
          </footer>
        </div>
      </template>
    </uni-card-tree>
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <h6>关联状态</h6>
      <uni-checkbox-button-group
        v-model="drawerForm.isBind"
        :options="[
          { label: '未关联', value: 0 },
          { label: '已关联', value: 1 }
        ]"
      >
      </uni-checkbox-button-group>
      <h6>月度分析</h6>
      <uni-checkbox-button-group v-model="drawerForm.status" :options="taskStatusList"> </uni-checkbox-button-group>
    </uni-drawer-custom>
  </div>
</template>

<script>
import api from '../api'
import toTree from '@/utils/toTree'
import taskStatusList from '../lib/taskStatusList'
import treeFilter from '@/utils/treeFilter'
import _ from 'lodash'
export default {
  name: 'Detail',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      unicode: null,
      taskStatusList,
      list: [],
      drawerForm: {},
      filterForm: {}
    }
  },
  computed: {
    computedList() {
      return treeFilter(
        this.list,
        item => {
          if (!_.isNil(this.filterForm.isBind)) {
            if (item.isBind !== this.filterForm.isBind) {
              return false
            }
          }
          if (!_.isNil(this.filterForm.status)) {
            if (item.status !== this.filterForm.status) {
              return false
            }
          }
          if (this.filterForm.keyword) {
            return item.taskName.includes(this.filterForm.keyword)
          }
          return true
        },
        'parentTaskUniqueId',
        'taskUniqueId'
      )
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'filter') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  onLoad(options) {
    this.unicode = options.unicode
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      api.getScheduleTaskList({ unicode: this.unicode }).then(res => {
        this.list = toTree(res.data.baseList, 'parentTaskUniqueId', null, 'taskUniqueId')
      })
    },
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
    },
    handleSearchBarInput(e) {
      this.filterForm.keyword = e.value.trim()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';

.item {
  padding: 31px 31px 0;
  font-size: 12px;
  color: #4f6481;
  line-height: 48px;
  width: 700px;
  h6 {
    padding-right: 50px;
    font-size: @h2FontSize;
    font-weight: bold;
    position: relative;
    margin-bottom: 15px;
    color: #020202;
  }
  footer {
    display: flex;
    line-height: 76px;
    justify-content: space-between;
  }
  .uni-status {
    position: absolute;
    bottom: 110px;
    right: 50px;
  }
}
.uni-drawer-custom {
  h6 {
    font-size: 14px;
    margin-bottom: 15px;
  }
}
</style>
