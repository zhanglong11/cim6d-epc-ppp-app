<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="content">
        <image style="width: 100%; height: 200px" :mode="mode" :src="src" @error="imageError"></image>
        <view class="title">{{ projectDetail.name }}</view>
      </view>
      <view class="main-body">
        <uni-card title="项目简介">
          <uni-form-item label="开工日期" :border="false" align="left"
            >{{ projectDetail.startTime | ymd }}
          </uni-form-item>
          <uni-form-item label="结束日期" :border="false" align="left"
            >{{ projectDetail.endTime | ymd }}
          </uni-form-item>
          <uni-form-item label="计划工期" :border="false" align="left"
            >{{ utils.getDays(projectDetail.startTime, projectDetail.endTime) }}天
          </uni-form-item>
          <uni-form-item label="已进行" :border="false" align="left">
            {{ utils.getDays(projectDetail.startTime, utils.getDateStr(0)) }}天
          </uni-form-item>
        </uni-card>
        <uni-card title="项目进度">
          <uni-tabs v-model="progressActive" class="custom-tabs">
            <uni-tab-pane
              v-for="(item, i) in taskPanelList"
              :key="i"
              :label="item.scheduleFileName"
              :name="i + 1"
              @click.native="selectType(i)"
            ></uni-tab-pane>
          </uni-tabs>
          <div class="schedule-list">
            <ul v-if="taskPanelList.length > 0">
              <li
                v-for="(item, i) in taskPanelList[taskPanelSelect].list"
                :key="i"
                :class="{ finished: item.isFinished }"
              >
                <div class="task-info">
                  <span class="task-name" v-text="item.taskName"></span>
                  <span v-if="item.isFinished" class="status">（已完成）</span>
                  <span class="schedule-time">{{ item.start | formatData }} ~ {{ item.end | formatData }}</span>
                </div>
                <progress
                  :percent="item.actualFinishedPercent"
                  show-info
                  :stroke-width="6"
                  :border-radius="6"
                  activeColor="#6d93e8"
                  style="width: 100%"
                />
              </li>
            </ul>
          </div>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { homeApi } from '../api'
import utils from '@/utils/utils'

export default {
  name: 'Index',
  data() {
    return {
      mode: 'aspectFill',
      src: '../../../../static/images/project.png',
      baseInfo: {},
      progressActive: 1,
      active: 0,
      taskPanelSelect: 0,
      taskPanelList: [],
      utils,
      projectDetail: uni.getStorageSync('projectDetail')
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'bim') {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=1`)
    }
  },
  onShow() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getScheduleTaskPanel()
    },
    // 选择文件
    selectType(index) {
      this.taskPanelSelect = index
    },
    // 进度管理-项目进度面板
    async getScheduleTaskPanel() {
      let result = await homeApi.getScheduleTaskPanel(this.projectId)
      let datas = result.data || []
      let taskPanelSelectList = []
      datas.map((item, i) => {
        taskPanelSelectList.push({
          label: item.scheduleFileName,
          value: i
        })
        let planFinishedPercent = parseFloat(item.planFinishedPercent.toFixed(2))
        let actualFinishedPercent = parseFloat(item.actualFinishedPercent.toFixed(2))
        item.planFinishedPercent = planFinishedPercent
        item.actualFinishedPercent = actualFinishedPercent
      })
      this.taskPanelSelectList = taskPanelSelectList
      this.taskPanelSelect = 0
      let defaultWidth = 10
      /*
        获取数组中的最大值或最小值
        type = max 最大值
        type = min 最小值
      */
      const getArrayMax = (array, type = 'max') => {
        return Math[type].apply(Math, array)
      }
      datas.map(item => {
        let list = item.list || []
        let minCount = getArrayMax(_.map(list, 'taskCount'), 'min')
        let maxCount = getArrayMax(_.map(list, 'taskCount'), 'max')
        defaultWidth = minCount <= 2 ? 50 : 10
        list.map(e => {
          e.lineStyle = `width: ${e.taskCount * defaultWidth}px`
        })
        item.list = list
        item.lineStyle =
          maxCount > 0
            ? `width: ${item.taskCount * defaultWidth}px;margin-left: ${
                item.list.length > 0 ? item.list[0].taskCount * defaultWidth : 0
              }px`
            : ''
        item.progressStyle =
          maxCount > 0
            ? `width: ${
                item.taskCount * defaultWidth + (item.list.length > 0 ? item.list[0].taskCount * defaultWidth : 0)
              }px;`
            : ''
      })
      this.taskPanelList = datas || []
      // console.log('项目进度面板', datas)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.tabs {
  margin: 0px;
  max-width: 640px;
  width: 100%;
}
.custom-tabs {
  /deep/.item .wrap {
    padding: 0 16rpx;
    width: 90%;
    .ellipsis;
    font-size: 12px;
  }
}

.main-body {
  padding: 20px;
}
.title {
  text-align: center;
}
.progress-box {
  padding: 20px;
}
.schedule-list {
  padding: 20rpx;
  font-size: 14px;
  ul {
    li {
      margin-top: 20rpx;
      /deep/.uni-progress-bar {
        border-radius: 12rpx;
        .uni-progress-inner-bar {
          border-radius: 12rpx;
        }
      }
      &.finished {
        color: #999;
      }
    }
  }
  /deep/ .uni-scroll-view {
    max-width: 640px;
    width: 100%;
  }
  .list:not(:first-of-type) {
    margin-top: 80px;
  }
  .label {
    margin-bottom: 20px;
  }
  .schedule-line {
    position: absolute;
    z-index: 3;
    display: flex;
    align-items: center;
    font-size: 10px;
    margin: 50rpx 0;
    span {
      border-left: 1px #ccc solid;
      height: 80px;
      display: flex;
      align-items: flex-end;
      white-space: nowrap;
      padding-left: 5px;
      padding-bottom: 10rpx;
    }
  }
  .schedule-progress {
    color: #666;
    margin-top: 20rpx !important;
  }
}
</style>
