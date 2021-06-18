<template>
  <view class="main is-white">
    <web-view
      ref="bimAppRef"
      :webview-styles="webviewStyles"
      :src="`http://luoyang.gim6d.com:18905/app-bim/?id=${id}&url=${url}&token=${token}&entityName=${entityName}`"
    ></web-view>
  </view>
</template>

<script>
import { projectAPI } from '../../api/project'
export default {
  components: {},
  data() {
    return {
      webviewStyles: {
        progress: {
          color: '#4778F3'
        }
      },
      id: 'd2d90db0dcae4b7fa569c4369b5b43e8_1',
      url: 'http://172.16.10.41:18080/jialidemo/3d.svf',
      entityName: ''
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    token() {
      return this.$store.state.user.token
    }
  },
  onLoad(options) {
    this.init(options)
  },
  mounted() {},
  methods: {
    // 初始化
    init(options) {
      let entityId = options.entityId
      this.id = entityId
      let entityName = options.entityName || ''
      console.log(1111, entityName)
      this.entityName = escape(entityName)
      this.url = `https://cim6d-construction.oss-cn-beijing.aliyuncs.com/zhuangxiu/${entityId}/3d.svf`
    }
  }
}
</script>

<style lang="less" scope>
@import url('./index.less');
</style>
