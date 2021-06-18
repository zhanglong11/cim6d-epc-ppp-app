<template>
  <view class="main is-white">
    <!-- <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>-->
    <view class="main-body">
      <view class="headerContainer" @click="handleClick">
        <view class="imageContainer"
          ><image
            :src="(info.readvertisingMapDTO && info.readvertisingMapDTO.imageUrl) || '/static/images/imageNotFound.png'"
          ></image
        ></view>
        <h3>{{ info.headlineDTO && info.headlineDTO.title }}</h3>
        <!--1活动,2要闻-->
        <p v-if="info.headlineDTO && info.headlineDTO.module === 2">
          {{ (info.headlineDTO && info.headlineDTO.briefIntroduction) || '无' }}
        </p>
      </view>
      <view class="infoContainer">
        <ul>
          <li>
            <span>
              <span class="count">{{ info.partyMemberNum }}</span>
              <span>名</span>
            </span>
            <span class="info">党员数量</span>
          </li>
          <li>
            <span>
              <span class="count">{{ info.partyActivityNum }}</span>
              <span>次</span>
            </span>
            <span class="info">党建活动</span>
          </li>
          <li>
            <span>
              <span class="count">{{ info.partyNewsNum }}</span>
              <span>条</span>
            </span>
            <span class="info">党建新闻</span>
          </li>
          <li>
            <span>
              <span class="count">{{ info.partyDocumentNum }}</span>
              <span>篇</span>
            </span>
            <span class="info">党建资料</span>
          </li>
        </ul>
      </view>
      <!--活动预告开始-->
      <block>
        <view class="subTitle">
          <h4>活动预告</h4>
          <uni-font-awesome
            type="fa fa-angle-double-right"
            color="#5dc4f5"
            size="34"
            @click="$utils.toUrl('/pages/epcPpp/partyConstruct/activityPreview/index')"
          ></uni-font-awesome>
        </view>
        <block v-if="info.activityPreviewList && info.activityPreviewList.length">
          <uni-card
            v-for="item of info.activityPreviewList || []"
            :key="'activityPreview' + item.id"
            class="activityPreview"
            @click.native="$utils.toUrl(`/pages/epcPpp/partyConstruct/activityPreview/detail?id=${item.id}`)"
          >
            <view class="card-info">
              <view class="title">{{ item.title }}</view>
            </view>
          </uni-card>
        </block>
        <uni-card v-else>
          <view class="card-body"> <view>暂无数据</view></view>
        </uni-card>
      </block>
      <!--活动预告结束-->
      <!--党建回顾开始-->
      <block>
        <view class="subTitle">
          <h4>党建活动回顾</h4>
          <uni-font-awesome
            type="fa fa-angle-double-right"
            color="#5dc4f5"
            size="34"
            @click="$utils.toUrl('/pages/epcPpp/partyConstruct/activity/index?onlyFinished=true')"
          ></uni-font-awesome>
        </view>
        <block v-if="info.activityReviewList && info.activityReviewList.length">
          <uni-card
            v-for="item of info.activityReviewList || []"
            :key="'activity' + item.id"
            @click.native="$utils.toUrl(`/pages/epcPpp/partyConstruct/activity/detail?id=${item.id}`)"
          >
            <view class="card-body">
              <view class="bodyContainer">
                <view v-if="item.imageUrl" class="left">
                  <image :src="item.imageUrl"></image>
                </view>
                <view class="right">
                  <view class="title">{{ item.title }}</view>
                  <view class="content">{{ item.content }}</view>
                </view>
              </view>
            </view>
            <view class="card-footer border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建日期： {{ item.createTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-card v-else>
          <view class="card-body"> <view>暂无数据</view></view>
        </uni-card>
      </block>
      <!--党建回顾结束-->
      <!--党建要闻开始-->
      <block>
        <view class="subTitle">
          <h4>党建要闻</h4>
          <uni-font-awesome
            type="fa fa-angle-double-right"
            color="#5dc4f5"
            size="34"
            @click="$utils.toUrl('/pages/epcPpp/partyConstruct/news/index')"
          ></uni-font-awesome>
        </view>
        <block v-if="info.newsList && info.newsList.length">
          <uni-card
            v-for="item of info.newsList"
            :key="'news' + item.id"
            @click.native="$utils.toUrl(`/pages/epcPpp/partyConstruct/news/detail?id=${item.id}`)"
          >
            <view class="card-body">
              <view class="bodyContainer">
                <view v-if="item.imageUrl" class="left">
                  <image :src="item.imageUrl"></image>
                </view>
                <view class="right">
                  <view class="title">{{ item.title }}</view>
                  <view class="content">{{ item.briefIntroduction }}</view>
                </view>
              </view>
            </view>
            <view class="card-footer border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建日期： {{ item.createTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-card v-else>
          <view class="card-body"> <view>暂无数据</view></view>
        </uni-card>
      </block>
      <!--党建要闻结束-->
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from '@/pages/epcPpp/partyConstruct/api'
export default {
  name: 'EpcPartyConstructHome',
  data() {
    return {
      filterForm: {
        activityPreviewLimit: 3,
        activityReviewLimit: 3,
        newsLimit: 3,
        search: '',
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      info: {}
    }
  },
  computed: {},
  watch: {},
  created() {},
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {},
  methods: {
    getData: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getData(data).finally(() => {
        this.loading = false
      })
      this.info = res.data
    }, 100),
    // 初始化
    init() {
      this.getData()
    },
    handleDrawerFormChange() {
      this.init()
    },
    handleDrawerReset() {
      this.init()
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
    handleItemClick(row) {
      console.log(row)
    },
    handleClick() {
      this.$utils.toUrl(`/pages/epcPpp/partyConstruct/home/detail?id=${11}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../style/index.less');
</style>
