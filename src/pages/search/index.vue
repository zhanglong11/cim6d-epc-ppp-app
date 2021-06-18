<template>
  <view class="main">
    <uni-nav-bar fixed :shadow="false" background-color="#496FE5" color="#ffffff">
      <uniSearchBar placeholder="搜索关键词" cancelButton="auto" @confirm="handleSearchBarConfirm"></uniSearchBar
    ></uni-nav-bar>
    <view class="main-body">
      <!-- 搜索历史模块开始,当进入搜索页,未开始搜索时展示 -->
      <view v-if="!isRealse" class="keyword-history">
        <view class="header">
          <view>搜索历史</view>
          <view class="clear-btn" @click="handleClearKeywordList">
            <uni-icons type="trash" size="14" color="#4778F3"></uni-icons>删除
          </view>
        </view>
        <view class="list-container">
          <view
            v-for="(item, index) in keyWordList"
            :key="index"
            class="list-item"
            @click="handleKeywordItemClick(item)"
            >{{ item }}</view
          >
        </view>
      </view>
      <!-- 搜索历史模块结束 -->
      <!-- 展示搜索结果开始 -->
      <view v-else-if="list.length">
        <view class="card">
          <view class="card-header">
            <text class="card-key">劳务公司</text>
            <text class="count">5个结果</text>
          </view>
          <view class="card-body">
            <transition-group name="slide">
              <view v-for="(item, index) in list" v-show="index < showLength" :key="item.id" class="item">
                <!-- :class="[index + 1 > showLength ? 'hidden' : '']" -->

                <view class="item-info">
                  <view class="title">{{ item.title }}</view>
                  <view class="time">{{ item.createTime }}</view>
                </view>
                <uni-icons type="forward" size="25" color="#959595"></uni-icons>
              </view>
            </transition-group>
          </view>

          <view v-show="list.length > showLength" class="card-footer" @click="handleShowMore">查看全部结果</view>
        </view>
        <view class="card">
          <view class="card-header">
            <text class="card-key">相关订单</text>
            <text class="count">2个结果</text>
          </view>
          <view class="card-body">
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题1</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题2</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题1</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题2</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题1</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题2</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题1</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题2</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题1</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
            <view class="item">
              <view class="item-info">
                <view class="title">订单标题2</view>
                <view class="time">2020-05-07 11:32</view>
              </view>
              <uni-icons type="forward" size="25" color="#959595"></uni-icons>
            </view>
          </view>
        </view>
      </view>
      <!-- 展示搜索结果结束 -->
      <!-- 无数据空载页 start -->
      <EmptyTemplate v-else-if="list.length === 0" desc="未搜索到相关结果" />
      <!-- 无数据空载页 end -->
    </view>
  </view>
</template>

<script>
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'

import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
import uniIcons from '@/components/uni-icons/uni-icons.vue'
export default {
  components: {
    uniIcons,
    uniNavBar,
    uniSearchBar
  },
  data() {
    return {
      keyword: '',
      keyWordList: [
        '塔吊',
        '质量问题',
        '安全问题',
        '安全文明问题',
        '河南正邦人力资源有限公司',
        '河南逐鹿网络有限公司',
        '水泥'
      ],
      list: [
        {
          id: 1,
          title: '河南正邦人力资源有限公司河南正邦人力资源有限公司河南正邦人力资源有限公司',
          createTime: '2020-05-07 11:32'
        },
        {
          id: 2,
          title: '河南正邦人力资源有限公司',
          createTime: '2020-05-07 11:32'
        },
        {
          id: 3,
          title: '河南正邦人力资源有限公司',
          createTime: '2020-05-07 11:32'
        },
        {
          id: 4,
          title: '河南正邦人力资源有限公司',
          createTime: '2020-05-07 11:32'
        },
        {
          id: 5,
          title: '河南正邦人力资源有限公司',
          createTime: '2020-05-07 11:32'
        }
      ], //搜索结果
      isRealse: true, //是否完成搜索
      showLength: 3 //每一组搜索结果展示的条数
    }
  },
  methods: {
    // 清空搜索历史
    handleClearKeywordList() {
      this.keyWordList = []
    },
    // 点击搜索历史项，开始搜索
    handleKeywordItemClick(data) {
      this.keyword = data
      this.queryList()
    },
    //根据关键词搜索
    async queryList() {
      this.isRealse = await true
    },
    //展示当期类目下所有的搜索结果
    handleShowMore() {
      this.showLength = 9999
    },
    // 自定义导航栏的搜索事件，用户点击软键盘上的“搜索”按钮时触发
    handleSearchBarConfirm(data) {
      this.keyword = data.value
      this.queryList()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
