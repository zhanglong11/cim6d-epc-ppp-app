<template>
  <view class="container">
    <view v-if="treeData.length === 0" class="content treeWrapper">
      <EmptyTemplate />
    </view>
    <view v-else class="content  treeWrapper">
      <TkiTree
        :selectIds="selectIds"
        :range="treeData"
        :rangeKey="rangeKey"
        :multiple="multiple"
        :isSimple="isSimple"
        :select-parent="true"
        @change="handleSelectChange"
      ></TkiTree
    ></view>
    <view class="selectListContainer">
      <scroll-view scroll-x class="labelContainer">
        <div class="list">
          <view v-for="item in selectList" :key="item.id" class="item">
            <view style="width: 100%;"
              >{{ item[rangeKey] }}
              <!--<text class="deleteIcon" @tap="handleDeleteSelect(item)">&times;</text>-->
              <icon class="deleteIcon" type="clear" size="16" color="red" @tap="handleDeleteSelect(item)"></icon
            ></view>
          </view>
        </div>
      </scroll-view>
      <view class="confirmBtn">
        <button class="mini-btn" type="primary" size="mini" @tap="handleSubmit">
          确定 <text class="selectCount">({{ selectList.length ? selectList.length : '' }})</text>
        </button></view
      >
    </view>
  </view>
</template>

<script>
import TkiTree from '@/components/tki-tree/tki-tree.vue'
import { cloneDeep } from 'lodash'
import renderTreeList from '@/utils/flatDepartmentTree'
export default {
  name: 'SelectDepartment',
  components: { TkiTree },
  data() {
    return {
      flatTree: [],
      selectIds: [],
      rangeKey: 'name',
      idKey: 'id',
      multiple: true,
      key: '',
      isSimple: false
    }
  },
  computed: {
    selectList() {
      return this.flatTree.filter(item => this.selectIds.includes(item.id))
    },
    treeData() {
      return this.$store.getters.departmentTreeList || []
    }
  },
  watch: {
    treeData: {
      immediate: true,
      handler(val) {
        if (val) renderTreeList(this.flatTree)(val, 'id', 'name')
      }
    }
  },
  onLoad(option) {
    this.multiple = option.multiple === 'true'
    this.selectIds = option.selectIds ? option.selectIds.split(',') : []
    this.rangeKey = option.rangeKey ? option.rangeKey : 'name'
    this.key = option.key
    this.isSimple = option.isSimple === 'true'
  },
  methods: {
    handleSelectChange(data) {
      this.selectIds = data.filter(item => item.checked === true).map(item => item.id)
    },
    handleDeleteSelect(item) {
      this.selectIds = this.selectIds.filter(i => i !== item.id)
    },
    handleSubmit() {
      let data = this.flatTree.filter(item => this.selectIds.includes(item.id))
      if (this.selectIds.length === 0) {
        this.$utils.showToast('请选择部门')
        return false
      }
      uni.$emit('update:select-department', { key: this.key, value: this.selectIds, selectDataArray: data })
      uni.navigateBack()
    }
    /*_renderTreeList(list = [], rank = 0, parentId = [], parents = []) {
      list.forEach(item => {
        this.flatTree.push({
          id: item[this.idKey],
          name: item[this.rangeKey],
          source: item,
          parentId, // 父级id数组
          parents, // 父级id数组
          rank, // 层级
          showChild: false, //子级是否显示
          open: false, //是否打开
          show: rank === 0, // 自身是否显示
          hideArr: [],
          orChecked: item.checked ? item.checked : false,
          checked: item.checked ? item.checked : false
        })
        if (Array.isArray(item.children) && item.children.length > 0) {
          // console.log(item)
          let parentid = [...parentId],
            parentArr = [...parents],
            childrenid = [...childrenid]
          delete parentArr.children
          parentid.push(item[this.idKey])
          parentArr.push({
            [this.idKey]: item[this.idKey],
            [this.rangeKey]: item[this.rangeKey]
          })
          this._renderTreeList(item.children, rank + 1, parentid, parentArr)
        } else {
          this.flatTree[this.flatTree.length - 1].lastRank = true
        }
      })
    }*/
  }
}
</script>

<style scoped lang="less">
@import url('./select-department.less');
</style>
