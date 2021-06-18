<template>
  <div class="align-right" name="construcationNames" :style="{ color: !value ? '#777' : 'unset' }" @click="jump">
    {{ computedText }}
  </div>
</template>
<script>
import { find, uniqueId, floor } from 'lodash'
export default {
  name: 'UniSelectLabour',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },

    /**
     * 列数
     */
    columns: {
      type: Number,
      default: 4
    },
    /**
     * 单个item的宽高
     */
    size: {
      type: Number,
      default: 100
    },
    roles: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 可以选择的人员id列表， ，号连起来的字符串
     */
    canChooseUserIds: {
      type: String,
      default: ''
    },
    disabledUserIds: {
      type: Array,
      default() {
        return []
      }
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否展示全选按钮
    showCheckAll: {
      type: Boolean,
      default: false
    },
    // 分组关键字
    groupKey: {
      type: String,
      default: 'labourCompanyName'
    }
    //名字旁边显示那些字段
    // subKey: {
    //   type: String,
    //   default: 'workType,gender'
    // }
  },
  data() {
    return {
      key: '',
      userList: []
    }
  },
  computed: {
    computedText() {
      if (this.value) {
        return this.value
          .split(',')
          .map(id => find(this.userList, { id })?.name || '')
          .join(',')
      } else {
        return this.placeholder
      }
    },
    computedIds() {
      if (this.value) {
        return this.value
          .split(',')
          .map(id => find(this.userList, { id })?.id || '')
          .join(',')
      } else {
        return ''
      }
    },
    selectedUserList() {
      if (this.value) {
        return this.value.split(',').map(id => find(this.userList, { id }))
      } else {
        return []
      }
    }
  },
  created() {
    this.queryLabourList()
    this.key = uniqueId('labour_')
    uni.$on('update:select-labour', data => {
      if (data.key === this.key) {
        let userId = data.value.map(e => e.id).join(',')
        let userName = data.value.map(e => e.name).join(',')
        let mobile = data.value.map(e => e.mobile).join(',')
        this.$emit('input', userId)
        this.$emit('change', {
          userId,
          userName,
          mobile
        })
        this.$emit('update:id', userId)
        this.$emit('update:name', userName)
        this.$emit('update:mobile', mobile)
      }
    })
  },
  methods: {
    queryLabourList(option) {
      this.fly.labour
        .post('employee/list', { page: 1, rows: 100000, projectId: wx.getStorageSync('projectId') })
        .then(res => {
          res.data.records.forEach(e => (e.checked = false))
          this.userList = res.data.records || []
        })
    },
    floor,
    jump() {
      if (this.disabled) {
        return
      }
      this.$utils.toUrl(
        `/pages/select-labour/select-labour?multiple=${this.multiple}&key=${this.key}&checkedIds=${
          this.computedIds
        }&roles=${this.roles.join(',')}&canChooseUserIds=${this.canChooseUserIds}&disabledUserIds=${
          this.disabledUserIds
        }&showCheckAll=${this.showCheckAll}&groupKey=${this.groupKey}`
      )
    }
  }
}
</script>
<style lang="less" scoped>
@import './uni-select-labour.less';
</style>
