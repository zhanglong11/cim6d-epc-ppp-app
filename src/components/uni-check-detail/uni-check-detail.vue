<template>
  <div>
    <template v-for="(items, i) in list">
      <uni-card :key="i" class="card" :title="items.taskName">
        <uni-form-item align="left" label="审核状态" isCell>
          {{ items.taskVariables.flag === '1' ? '通过' : '驳回' }}
        </uni-form-item>
        <uni-form-item align="left" label="审核意见" isCell>
          {{ items.taskVariables.remark }}
        </uni-form-item>
        <uni-form-item align="left" label="审核人" isCell>
          {{ items.taskVariables.taskDelegateName }}
        </uni-form-item>
        <uni-form-item align="left" label="审核日期" isCell>
          {{ items.endTime | formatData }}
        </uni-form-item>
        <uni-form-item align="left" label="附件" isCell>
          <uni-attachment v-model="items.taskVariables.fileIds"></uni-attachment>
        </uni-form-item>
      </uni-card>
    </template>
  </div>
</template>

<script>
import { workFlowApi } from '@/api/work-flow'

export default {
  name: 'UniCheckDetail',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        if (val) {
          this.refresh()
        }
      }
    }
  },
  methods: {
    async refresh() {
      let result = await workFlowApi.getTaskList(this.id)
      let data = result.data || []
      console.log(result.data)
      let list = []
      data.map((item, i) => {
        if (item.taskVariables && item.taskVariables.taskDelegateName && item.taskVariables.flag) {
          list.push(item)
          let fileIds = []
          Object.keys(item.taskVariables).map(e => {
            if (e.indexOf('fileupload') >= 0 || e.indexOf('imgupload') >= 0) {
              let file = item.taskVariables[e]
              if (file) {
                // 处理文件或图片数据
                let fileList = file
                  .replace(/\[|]|{|}/g, '')
                  .replace(/, fileKey=/g, '|fileKey=')
                  .split(',')
                fileList.map(f => {
                  let name = f.split('|')[0].replace('name=', '')
                  let fileKey = f.split('|')[1].replace('fileKey=', '')
                  fileIds.push(fileKey)
                })
              }
            }
          })
          item.taskVariables.fileIds = fileIds.join(',')
        }
      })
      this.list = list
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.uni-card {
  margin-bottom: 20px;
  width: 700px;
}
</style>
