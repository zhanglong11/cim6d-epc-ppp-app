<template>
  <textarea
    :value="computedValue"
    auto-height
    class="align-right"
    :placeholder="placeholder"
    disabled
    @click="toDetails"
  />
</template>

<script>
import { uniqueId } from 'lodash'
import renderTreeList from '@/utils/flatDepartmentTree'

export default {
  name: 'UniDepartmentSelect',
  components: {},
  props: {
    /* value: {
      type: Array,
      default: () => []
    },*/
    value: {
      type: String,
      default: ''
    },
    multiple: {
      // 是否可以多选
      type: Boolean,
      default: true
    },
    rangeKey: {
      type: String,
      default: 'label'
    },
    idKey: {
      type: String,
      default: 'id'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    otherData: {
      //change方法其他的参数
      type: String,
      default: 'name'
    }
  },
  data() {
    return {
      key: '',
      flatTree: []
    }
  },
  computed: {
    computedValue() {
      console.log(this.flatTree)
      return this.flatTree
        .filter(item => this.value.split(',').includes(item.id))
        .map(i => i.name)
        .join(',')
    },
    treeData() {
      return this.$store.getters.departmentTreeList || []
    }
  },
  watch: {
    treeData: {
      immediate: true,
      handler(val) {
        if (val) {
          let arr = []
          renderTreeList(arr)(val, 'id', 'name')
          this.flatTree = arr
        }
      }
    }
  },
  created() {
    this.key = uniqueId('department_')
    uni.$on('update:select-department', data => {
      if (data.key === this.key) {
        let otherKey = this.otherData
        let arr = data.selectDataArray.map(item => item[otherKey])
        let name = data.selectDataArray.map(item => item.name).join(',')
        this.$emit('input', data.value.join(','))
        this.$emit('update:name', name)
        console.log(data.value.join(','))
        this.$emit('change', {
          ids: data.value,
          [otherKey]: arr
        })
      }
    })
  },
  methods: {
    // 跳转详情
    toDetails() {
      this.$utils.toUrl(
        `/pages/select-department/select-department?multiple=${this.multiple}&key=${this.key}&selectIds=${this.value}&isSimple=false`
      )
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-department-select.less';
</style>
