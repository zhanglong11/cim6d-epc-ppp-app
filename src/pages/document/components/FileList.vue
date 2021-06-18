<template>
  <div class="doc-wrapper" :style="{ backgroundColor: '#fff' }">
    <div v-for="item of list" :key="item.id" class="list" @click="handleDocClick(item)">
      <div class="imgWrapper">
        <uni-font-awesome
          :type="listTypeIcon[item.name.split('.')[1]] || 'fas fa-file'"
          color="#6e6e6e"
          size="50"
        ></uni-font-awesome>
      </div>
      <!--      <div class="info" @click="handleDocClick(item)">-->
      <div class="info ">
        <div class="info-detail ellipsis">{{ item.name }}</div>
        <div class="create-info">
          <span class="creator">{{ item.creatorName }}</span>
          <span class="create-time">{{ item.createTime }}</span>
        </div>
      </div>
      <div class="operateBtn">
        <!--        <uni-font-awesome type="fas fa-ellipsis-h" color="#6e6e6e" size="40"></uni-font-awesome>-->
        <slot>
          <div
            style="letter-spacing: 5px;
      font-weight: bolder;
      color: #6e6e6e;"
          >
            ···
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FileList',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listTypeIcon: {
        jpg: 'fas fa-file-image',
        JPG: 'fas fa-file-image',
        PNG: 'fas fa-file-image',
        png: 'fas fa-file-image',
        jpeg: 'fas fa-file-image',
        JPEG: 'fas fa-file-image',
        txt: 'fas fa-file',
        TXT: 'fas fa-file',
        csv: 'fas fa-file-csv',
        CSV: 'fas fa-file-csv',
        doc: 'fas fa-file-word',
        DOC: 'fas fa-file-word',
        docx: 'fas fa-file-word',
        DOCX: 'fas fa-file-word',
        pdf: 'fas fa-file-pdf',
        PDF: 'fas fa-file-pdf',
        xls: 'fas fa-file-excel',
        XLS: 'fas fa-file-excel',
        xlsx: 'fas fa-file-excel',
        XLSX: 'fas fa-file-excel'
      }
    }
  },
  created() {
    console.log(this.list)
  },
  methods: {
    handleDocClick(item) {
      this.$emit('clickDoc', item)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./doc-list.less');
</style>
