<template>
  <uni-font-awesome
    :type="isFolder ? 'fas fa-folder' : listTypeIcon[name.split('.')[1]] || 'fas fa-file'"
    color="#999999"
    size="50"
  />
</template>

<script>
export default {
  name: 'index',
  components: {},
  props: {
    name: {},
    isFolder: {}
  },
  // import引入的组件

  data() {
    // 这里存放数据
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
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {}
  }
}
</script>

<style scoped></style>
