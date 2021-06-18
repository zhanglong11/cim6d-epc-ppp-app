<template>
  <image :src="imageUrl" class="img" :style="{ height: height }" @click="previewImage" />
</template>

<script>
export default {
  components: {},
  props: {
    height: {
      default: '400rpx'
    },
    fileIds: {}
  },
  data() {
    return {
      imageUrl: null,
      hasImage: false
    }
  },
  watch: {
    fileIds() {
      this.refresh()
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    async refresh() {
      if (_.isNil(this.fileIds)) {
        this.imageUrl = '../../../static/images/imageNotFound.png'
        return
      }
      let fileList = await this.fly.file.post('file/manage/list', this.fileIds.split(',')).then(res => res.data)
      this.imageUrl = fileList[0]?.fileUrl
      this.hasImage = true
    },
    previewImage() {
      if (!this.hasImage) {
        return
      }
      uni.previewImage({
        current: this.imageUrl,
        urls: [this.imageUrl]
      })
    }
  }
}
</script>

<style scoped lang="less">
.img {
  width: 100%;
}
</style>
