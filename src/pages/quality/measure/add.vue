<template>
  <div class="main">
    <m-steps :options="stepsOptions" :active="0"></m-steps>
    <scroll-view class="scroll-roll" scroll-y>
      <uni-card>
        <uni-form-item label="选择位置" isRequired isLink>
          <textarea
            v-model="form.measureLocation"
            auto-height
            class="disabledInput align-right"
            disabled
            placeholder="点击选择"
            @click="open"
          />
        </uni-form-item>
      </uni-card>
    </scroll-view>
    <uni-drawer ref="drawer" mode="right" :width="600">
      <view class="list-wrapper">
        <div class="list">
          <h6>单体</h6>
          <div
            v-for="item in treeData"
            :key="item.id"
            class="item"
            :class="{ active: item.id === a.id }"
            @click="a = item"
          >
            {{ item.label }}
          </div>
        </div>
        <div v-if="a.children" class="list">
          <h6>单元</h6>
          <div
            v-for="item in a.children"
            :key="item.id"
            class="item"
            :class="{ active: item.id === b.id }"
            @click="b = item"
          >
            {{ item.label }}
          </div>
        </div>
        <div v-if="b.children" class="list">
          <h6>楼层</h6>
          <div
            v-for="item in b.children"
            :key="item.id"
            class="item"
            :class="{ active: item.id === c.id }"
            @click="c = item"
          >
            {{ item.label }}
          </div>
        </div>
        <div v-if="c.children" class="list">
          <h6>户型</h6>
          <div
            v-for="item in c.children"
            :key="item.id"
            class="item"
            :class="{ active: item.id === d.id }"
            @click="d = item"
          >
            {{ item.label }}
          </div>
        </div>
      </view>
      <div class="foot">
        <uni-btn @click="close">取消</uni-btn>
        <uni-btn type="primary" @click="submit">确定</uni-btn>
      </div>
    </uni-drawer>
  </div>
</template>

<script>
import mSteps from '@/components/m-steps'
import _ from 'lodash'
export default {
  name: 'Add',
  components: {
    mSteps
  },
  data() {
    return {
      stepsOptions: [{ title: '请选择位置' }, { title: '请选择测量项' }, { title: '请选择指标' }],
      form: {
        projectId: this.$store.state.project.projectId,
        measureLocation: ''
      },
      treeData: [],
      a: {}, //单体
      b: {}, //单元
      c: {}, //楼层
      d: {} //户型
    }
  },
  watch: {
    a() {
      this.b = {}
    },
    b() {
      this.c = {}
    },
    c() {
      this.d = {}
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'next') {
      if (!this.form.measureLocation) {
        this.$utils.showToast('请选择测量位置并点击确定按钮')
        return
      }
      wx.setStorageSync('measureAddForm', JSON.stringify(this.form))
      this.$utils.toUrl('/pages/quality/measure/step-2')
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.construction.get('constructionDrawingLibrary/tree/' + this.form.projectId).then(res => {
        this.treeData = res.data
      })
    },
    submit() {
      if (!this.d.drawingUrl) {
        this.$utils.showToast('该户型没有图纸，无法测量')
        return false
      }
      this.form.measureLocation = _.map(_.pick(this, ['a', 'b', 'c', 'd']), 'label').join('-')
      this.form.measureDrawingId = this.d.drawingId
      this.form.measureDrawingUrl = this.d.drawingUrl
      this.form.measureLocationId = this.d.id
      this.close()
    },
    remove() {},
    open() {
      this.$refs.drawer.open()
    },
    close() {
      this.$refs.drawer.close()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.uni-card {
  width: 700px;
  margin-top: 25px !important;
}
.status(@class,@color) {
  &.@{class} {
    border: 2px solid @color;
    &.active {
      background-color: @color;
      color: #fff;
    }
  }
}
.uni-drawer {
  /deep/ .uni-drawer__content {
    padding: 10px 10px 148px;
  }
  .list-wrapper {
    height: 100%;
    overflow-y: auto;
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
  h6 {
    margin: 30px 0 10px;
    font-size: 14px;
    padding-left: 15px;
    font-weight: normal;
    color: #666;
    width: 100%;
  }
  > div {
    border-radius: 10px;
    cursor: pointer;
    margin: 10px;
    padding: 6px 20px;
    color: #555;
    .status(item, #1890ff);
  }
}
.foot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 26px 40px;
  display: flex;
  height: 138px;
  background: #fff;
  border-top: 1px solid @line;
  /deep/.btn-wrap {
    margin: 0 14px;
    border-radius: 80px;
    border-color: @headerColor;
    color: @headerColor;
    font-size: 14px;
    &.primary {
      background: @headerColor;
      color: #fff;
    }
  }
}
</style>
