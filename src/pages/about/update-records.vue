<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="records-list">
        <template v-for="(item, i) in listData">
          <uni-card :key="i" :hideTitle="false">
            <p slot="title" class="records-title">
              <span class="name" v-text="item.version"></span>
              <span class="time">{{ item.time | formatData }}</span>
            </p>
            <div class="desc" v-html="item.desc"></div>
          </uni-card>
        </template>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data() {
    //这里存放数据
    return {
      listData: [
        {
          version: 'v1.0.3',
          time: '2020-05-09',
          desc: `
          1、新增工序管理功能，可以快速查看工序进度，确认工序；<br />
          2、新增施工日志功能，记录每天的施工情况；<br />
          3、修复了一些列表页显示的bug；<br />
          4、新增BIM模型展示功能；<br />
          5、新增样板间预览功能；<br />
          6、优化体验，提升了界面跳转速度；<br />
          7、新增消息功能；<br />
          8、优化BIM模型，提升预览速度；<br />
          9、优化样板间模型，提升加载速度；<br />
          10、优化工序确认功能；<br />
          11、新增质量检查功能；<br />
          12、新增质量验收功能；<br />
          13、新增安全检查功能。<br />
          14、新增人员选择组件，人员选择根据快捷便利；<br />
          15、新增地区选择组件，精准选择所在地区；<br />
          16、BIM模型管理质量与安全数据。`
        }
      ]
    }
  },
  /*// 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
  },*/
  mounted() {},
  //方法集合
  methods: {}
}
</script>
<style lang="less" scoped>
@import url('./update-records.less');
</style>
