<template>
  <div class="main">
    <uni-search-bar style="margin-bottom: 15px" placeholder="搜索" @input="handleSearchBarInput"></uni-search-bar>
    <uni-card-tree :list="computedList" itemKey="taskId">
      <template v-slot="{ item }">
        <div
          class="item"
          :style="{ color: item.status === 5 ? 'red' : item.status === 3 ? '#00CC66' : '' }"
          @click="showActions(item)"
        >
          <h6 :style="{ color: [2, 5].includes(item.status) ? 'red' : item.status === 3 ? '#00CC66' : '' }">
            {{ item.taskName }}
          </h6>

          <p :style="{ color: item.isDelay ? 'red' : '' }">
            <span>计划时间：</span>
            <span>
              {{ moment(item.planStartDate).format('YYYYMMDD') }}
              -
              {{ moment(item.planEndDate).format('YYYYMMDD') }}
              <template v-if="item.isDelay"> (已延期)</template>
            </span>
          </p>

          <uni-status :options="taskStatusList" :value="item.status"></uni-status>
        </div>
      </template>
    </uni-card-tree>
  </div>
</template>

<script>
import api from '../api'
import taskStatusList from '../lib/taskStatusList'
import treeFilter from '@/utils/treeFilter'
import _ from 'lodash'
import qs from 'qs'
export default {
  name: 'Detail',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      taskStatusList,
      list: [],
      drawerForm: {},
      filterForm: {
        keyword: ''
      }
    }
  },
  computed: {
    computedList() {
      return treeFilter(
        this.list,
        item => {
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
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  onShow() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      api
        .queryScheduleTaskOwnList({
          projectId: uni.getStorageSync('projectId')
        })
        .then(res => {
          this.list = res.data
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
    },
    showActions(task) {
      const itemList = [
        {
          name: '分配任务',
          path: '/pages/epcPpp/schedule/myTask/assign'
        },
        {
          name: '完成任务',
          path: '/pages/epcPpp/schedule/myTask/completeTask'
        },
        {
          name: '延期解决方案',
          path: '/pages/epcPpp/schedule/myTask/delayTaskPlan'
        },
        {
          name: '延后所有关联进度',
          path: '/pages/epcPpp/schedule/myTask/delayAllLinkTask'
        },
        {
          name: '提前所有关联进度',
          path: '/pages/epcPpp/schedule/myTask/advanceAllLinkTask'
        },
        {
          name: '查看任务分配记录',
          path: '/pages/epcPpp/schedule/myTask/assignHistory'
        }
      ]
      uni.showActionSheet({
        itemList: itemList.map(e => e.name),
        success: ({ tapIndex }) => {
          const query = qs.stringify({ taskId: task.taskId, taskName: task.taskName })
          this.$utils.toUrl(itemList[tapIndex].path + '?' + query)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';

.item {
  padding: 31px 31px 31px;
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
  .uni-status {
    position: absolute;
    bottom: 60px;
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
