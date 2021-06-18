<template>
  <view @click.stop="previewImage"><image :src="imgUrl"></image> </view>
</template>

<script>
export default {
  name: 'UniPreviewImage',
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      imgUrl: '/static/images/imageNotFound.png'
    }
  },
  watch: {
    id(val) {
      if (val) {
        this.getImageUrl(val)
      }
    }
  },
  created() {
    if (this.id) {
      this.getImageUrl()
    }
  },
  methods: {
    async getImageUrl() {
      let res = await this.fly.file.post('file/manage/list', [this.id])
      this.imgUrl = res.data[0]?.fileUrl || '/static/images/imageNotFound.png'
    },
    previewImage() {
      uni.previewImage({
        current: this.imgUrl,
        urls: [this.imgUrl]
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
