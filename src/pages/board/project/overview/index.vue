<template>
  <view class="main">
    <view class="header" @click="$utils.toUrl('/pages/board/project/overview/introduction')">
      <view>项目介绍</view>
      <view class="icon-link"></view>
    </view>
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card class="not-started">
          <view class="card-body">
            <view class="step-title">
              1#楼
            </view>
            <view class="card-body-right">
              <view class="flex-item ">
                <view>
                  <text>工序实际进度:</text>
                  <text>
                    83%
                  </text>
                </view>
                <view>
                  <text>计划开始:</text>
                  <text class="target-start-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际开始:</text>
                  <text class="actual-start-time">
                    2020-04-01
                  </text>
                </view>
              </view>
              <view class="flex-item">
                <view>
                  <text>
                    83%
                  </text>
                </view>
                <view>
                  <text>计划结束:</text>
                  <text class="target-end-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际结束:</text>
                  <text class="actual-end-time advance">
                    2020-04-01
                  </text>
                </view>
              </view>
            </view>
          </view>
        </uni-card>
        <uni-card class="not-started">
          <view class="card-body">
            <view class="step-title">
              工序名称
            </view>
            <view class="card-body-right">
              <view class="flex-item ">
                <view>
                  <text>工序实际进度:</text>
                  <text>
                    83%
                  </text>
                </view>
                <view>
                  <text>计划开始:</text>
                  <text class="target-start-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际开始:</text>
                  <text class="actual-start-time">
                    2020-04-01
                  </text>
                </view>
              </view>
              <view class="flex-item">
                <view>
                  <text>
                    83%
                  </text>
                </view>
                <view>
                  <text>计划结束:</text>
                  <text class="target-end-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际结束:</text>
                  <text class="actual-end-time advance">
                    2020-04-01
                  </text>
                </view>
              </view>
            </view>
          </view>
        </uni-card>
        <uni-card class="have-in">
          <view class="card-body">
            <view class="step-title">
              15#楼
            </view>
            <view class="card-body-right">
              <view class="flex-item ">
                <view>
                  <text>工序实际进度:</text>
                  <text>
                    83%
                  </text>
                </view>
                <view>
                  <text>计划开始:</text>
                  <text class="target-start-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际开始:</text>
                  <text class="actual-start-time">
                    2020-04-01
                  </text>
                </view>
              </view>
              <view class="flex-item">
                <view>
                  <text>
                    83%
                  </text>
                </view>
                <view>
                  <text>计划结束:</text>
                  <text class="target-end-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际结束:</text>
                  <text class="actual-end-time delay">
                    2020-04-01
                  </text>
                </view>
              </view>
            </view>
          </view>
        </uni-card>
        <uni-card class="confirmed">
          <view class="card-body">
            <view class="step-title">
              4#楼
            </view>
            <view class="card-body-right">
              <view class="flex-item ">
                <view>
                  <text>工序实际进度:</text>
                  <text>
                    83%
                  </text>
                </view>
                <view>
                  <text>计划开始:</text>
                  <text class="target-start-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际开始:</text>
                  <text class="actual-start-time">
                    2020-04-01
                  </text>
                </view>
              </view>
              <view class="flex-item">
                <view>
                  <text>
                    83%
                  </text>
                </view>

                <view>
                  <text>计划结束:</text>
                  <text class="target-end-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际结束:</text>
                  <text class="actual-end-time">
                    2020-04-01
                  </text>
                </view>
              </view></view
            >
          </view>
        </uni-card>
        <uni-card class="finished">
          <view class="card-body">
            <view class="step-title">
              3#楼
            </view>
            <view class="card-body-right">
              <view class="flex-item ">
                <view>
                  <text>工序实际进度:</text>
                  <text>
                    83%
                  </text>
                </view>
                <view>
                  <text>计划开始:</text>
                  <text class="target-start-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际开始:</text>
                  <text class="actual-start-time">
                    2020-04-01
                  </text>
                </view>
              </view>
              <view class="flex-item">
                <view>
                  <text>
                    83%
                  </text>
                </view>

                <view>
                  <text>计划结束:</text>
                  <text class="target-end-time">
                    2020-04-01
                  </text>
                </view>
                <view>
                  <text>实际结束:</text>
                  <text class="actual-end-time">
                    2020-04-01
                  </text>
                </view>
              </view></view
            >
          </view>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 根据关键词筛选列表项
    handleSearchBarConfirm(e) {
      this.filterForm.search = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.search = ''
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
