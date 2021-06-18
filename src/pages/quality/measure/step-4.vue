<template>
  <div class="main">
    <div class="main-header">
      <m-steps :options="stepsOptions" :active="2"></m-steps>
    </div>
    <div class="button-group">
      <button type="primary" size="mini" class="zoom-btn" @click="zoomOut">- 缩小</button>
      <button type="default" size="mini" class="zoom-btn" @click="zoomReset">复位</button>
      <button type="warn" size="mini" class="zoom-btn" @click="zoomIn">+ 放大</button>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <div class="zoom-image">
        <ImageMark
          :imageSrc="form.measureDrawingUrl"
          :pointList="pointList"
          :style="zoomStyle"
          @add="handleAdd"
          @pointClick="handlePointClick"
        ></ImageMark>
      </div>
      <ul class="point-list">
        <li
          v-for="e in pointList"
          :key="'' + e.x + e.y"
          class="item"
          :class="{
            [['error', 'success', ''][e.status]]: true,
            active: e.id === activePoint.id
          }"
          @click="activePoint = e"
        >
          {{ ('' + e.id).padStart(2, '0') }}
        </li>
      </ul>
      <uni-card v-if="activePoint.x">
        <uni-form-item label="点位名称" isRequired>
          <textarea
            v-model="activePoint.positionName"
            :placeholder="('' + activePoint.id).padStart(2, '0') + ' (点击可以编辑)'"
            auto-height
            class="align-right"
          />
        </uni-form-item>
      </uni-card>
      <uni-card v-for="(item, i) in activePoint.measurePositionList || []" :key="i" :hideTitle="false">
        <div slot="title" class="point-header name">
          <span>{{ item.metricName }}</span>
          <span @click="handlePointRemove(item)">删除</span>
        </div>
        <uni-form-item label="单位" disabled>
          <textarea :value="item.unit" auto-height class="align-right" />
        </uni-form-item>
        <uni-form-item label="设计值" isRequired>
          <input v-model.number="item.designValue" type="number" class="align-right" @input="calculateItem(item)" />
        </uni-form-item>
        <uni-form-item label="测量值" isRequired>
          <input v-model.number="item.measureValue" type="number" class="align-right" @input="calculateItem(item)" />
        </uni-form-item>
        <uni-form-item label="偏差">
          <div>{{ item.deviation }}</div>
        </uni-form-item>
        <uni-form-item label="合格标准">
          <div>
            {{ `[${item.lowerBound},${item.uppserBound}]` }}
          </div>
        </uni-form-item>
        <uni-form-item label="是否合格">
          <div>{{ ['不合格', '合格'][item.status] }}</div>
        </uni-form-item>
      </uni-card>
      <view v-if="pointList.length > 0" class="btn-wrapper">
        <button class="button" type="primary" :loading="isLoading" @click="submit">提交</button>
      </view>
      <uni-popup ref="popup" @change="popupChange">
        <div class="measure-add-popup popup">
          <div>
            <h3>点位{{ ('' + activePoint.id).padStart(2, '0') }}</h3>
            <t-table>
              <t-tr>
                <t-th>测量项</t-th>
                <t-th>实测值</t-th>
                <t-th>设计值</t-th>
              </t-tr>
              <t-tr v-for="item in tableData" :key="`${item.metricName + '_1'}`">
                <t-td>{{ item.metricName }}</t-td>
                <t-td> <input v-model.number="item.measureValue" type="number" /></t-td>
                <t-td> <input v-model.number="item.designValue" type="number" /></t-td>
              </t-tr>
            </t-table>
          </div>
          <div class="btn-wrapper">
            <button type="primary" style="margin-top: 15px;" @click="save">保存</button>
          </div>
        </div>
      </uni-popup>
    </scroll-view>
  </div>
</template>

<script>
import mSteps from '@/components/m-steps'
import ImageMark from 'vue-image-mark'
import tTable from '@/components/t-table/t-table'
import tTh from '@/components/t-table/t-th'
import tTr from '@/components/t-table/t-tr'
import tTd from '@/components/t-table/t-td'
import _ from 'lodash'
export default {
  name: 'Add',
  components: {
    mSteps,
    ImageMark,
    tTable,
    tTh,
    tTr,
    tTd
  },
  data() {
    return {
      stepsOptions: [{ title: '请选择位置' }, { title: '请选择测量项' }, { title: '请选择指标' }],
      activePoint: {},
      pointList: [],
      isLoading: false,
      form: {
        metricsList: []
      },
      tableData: [],
      zoomStyle: '', // 放大/缩小
      zoomSize: 1, // 图纸初始大小
      zoomStep: 0.2, // 每次放大或缩小倍数
      imageHeight: '',
      /**
       * 拦截后退事件的时候存储变量，防止循环调用
       */
      confirmBack: false
    }
  },
  computed: {
    // 计算联合key，用于命中表单缓存
    unionKey() {
      return 'measureCache' + this.form.measureDrawingId + this.form.measureId + this.form.metricsList.map(e => e.id)
    }
  },
  watch: {
    // key改变之后判断是否存在草稿数据，如果有，就加载
    unionKey: {
      immediate: true,
      handler(val) {
        if (val && uni.getStorageSync(val + '-pointList')) {
          this.$utils.showToast('已从上次未保存的表单中恢复数据')
          this.pointList = JSON.parse(uni.getStorageSync(val + '-pointList'))
          this.tableData = JSON.parse(uni.getStorageSync(val + '-tableData'))
        }
      }
    },
    // 数据修改之后缓存到storage
    pointList: {
      deep: true,
      handler(val) {
        uni.setStorageSync(this.unionKey + '-pointList', JSON.stringify(val))
      }
    },
    // 数据修改之后缓存到storage
    tableData: {
      deep: true,
      handler(val) {
        uni.setStorageSync(this.unionKey + '-tableData', JSON.stringify(val))
      }
    }
  },
  onLoad() {
    this.form = JSON.parse(wx.getStorageSync('measureAddForm') || '{}')
    this.form.measurePositionList = []
    this.stepsOptions[0].title = this.form.measureLocation
    this.stepsOptions[1].title = this.form.measureName
    this.stepsOptions[2].title = this.form.metricsList.map(e => e.measureIndex).join(',')
  },
  onBackPress() {
    if (this.confirmBack) return false
    uni.showModal({
      title: '提示',
      content: '确定要返回吗，未保存的数据将会消失',
      success: async res => {
        if (res.confirm) {
          this.confirmBack = true
          this.$utils.goBack()
        }
      }
    })
    return true
  },
  created() {
    uni.getSystemInfo({
      success: res => {
        this.ratio = 850 / res.windowWidth
      }
    })
  },
  mounted() {},
  methods: {
    // 放大图纸
    zoomIn() {
      let zoomSize = this.zoomSize + this.zoomStep
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 缩小图纸
    zoomOut() {
      let zoomSize = this.zoomSize - this.zoomStep
      if (zoomSize < 0.2) {
        return
      }
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 复位图纸
    zoomReset() {
      let zoomSize = 1
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    handleAdd(point) {
      let measurePositionList = this.form.metricsList.map(e => ({
        lowerBound: e.leftValue,
        uppserBound: e.rightValue,
        metricName: e.measureIndex,
        unit: e.unit,
        positionNum: point.id,
        xCoordinate: point.x,
        yCoordinate: point.y,
        measureValue: null,
        designValue: null
      }))
      this.pointList.push({ ...point, measurePositionList, saved: false })
      this.activePoint = _.last(this.pointList)
      this.tableData = _.cloneDeep(measurePositionList)
      this.$refs.popup.open()
    },
    popupChange(params) {
      if (!params.show) {
        this.pointList = this.pointList.filter(e => e.saved)
        if (!this.activePoint.saved) {
          this.activePoint = {}
        }
      }
    },
    save() {
      this.activePoint.measurePositionList = this.tableData
      this.activePoint.saved = true
      this.calculateAll(this.activePoint.measurePositionList)
      this.$refs.popup.close()
    },
    handlePointClick(point) {
      this.tableData = _.cloneDeep(point.measurePositionList)
      this.$refs.popup.open()
    },
    calculateItem(item) {
      if (_.isNumber(item.designValue) && _.isNumber(item.measureValue)) {
        item.deviation = item.measureValue - item.designValue
        if (item.deviation <= item.uppserBound && item.deviation >= item.lowerBound) {
          item.status = 1
        } else {
          item.status = 0
        }
      }
      if (this.activePoint.measurePositionList.some(e => e.status === 0)) {
        this.activePoint.status = 0
        this.activePoint.color = '#e63030'
      } else if (this.activePoint.measurePositionList.every(e => e.status === 1)) {
        this.activePoint.status = 1
        this.activePoint.color = '#25cc70'
      } else {
        this.activePoint.status = null
      }
      this.pointList = this.pointList.slice()
    },
    calculateAll(list) {
      list.forEach(this.calculateItem)
    },
    refresh() {},
    remove() {},
    handlePointRemove(row) {
      const positionNum = row.positionNum
      this.pointList = this.pointList.filter(e => e.id !== positionNum)
      this.pointList.forEach((e, index) => (e.id = index + 1))
      this.pointList = this.pointList.slice()
      this.activePoint = this.pointList[0] || {}
    },
    submit() {
      let data = {}
      data.measureMetricInfo = this.form.metricsList.map(e => ({
        lowerBound: e.leftValue,
        uppserBound: e.rightValue,
        metricName: e.measureIndex,
        unit: e.unit,
        id: e.id
      }))
      data.measurePositionList = _.flatMap(this.pointList, point => {
        return point.measurePositionList
      })
      for (let point of data.measurePositionList) {
        let measureValueValid = point.measureValue || point.measureValue === 0
        let designValueValid = point.designValue || point.designValue === 0
        if (!measureValueValid || !designValueValid) {
          this.$utils.showToast('设计值和测量值必填')
          return false
        }
      }
      data.totalPointNum = data.measurePositionList.length
      data.passNum = data.measurePositionList.filter(e => e.status === 1).length
      data.failNum = data.measurePositionList.filter(e => e.status !== 1).length
      data.measureStandardId = this.form.measureId
      data.measureStandardName = this.form.measureName
      data.measureLocation = this.form.measureLocation
      data.measureLocationId = this.form.measureLocationId
      data.measureDrawingId = this.form.measureDrawingId
      data.measureDrawingUrl = this.form.measureDrawingUrl
      data.projectId = this.form.projectId
      this.fly.safety.post('measureRecord/add', data).then(res => {
        this.$utils.showToast('添加成功')
        // this.$utils.toUrl('/pages/quality/measure/list', 1)
        this.confirmBack = true
        // 成功提交之后清除相关表单缓存
        uni.removeStorageSync(this.unionKey + '-tableData')
        uni.removeStorageSync(this.unionKey + '-pointList')
        this.$utils.goBack(4)
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  padding-top: 0;
}
.main-header {
  overflow: hidden;
  border-radius: 30px;
  font-size: 13px;
  display: block;
  background-color: #fff;
  line-height: 48px;
  padding: 25px 0 5px;
  margin-bottom: 25px;
  /deep/ .steps__row-title {
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
.point-list {
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  margin: 20px -10px 0;
  li {
    border-radius: 10px;
    cursor: pointer;
    margin: 10px;
    padding: 10px 31px;
    color: #555;
    .status(item, #d7d7d7);
    .status(success, #25cc70);
    .status(error, #e63030);
  }
}
.measure-add-popup {
  /deep/ .col_text {
    *[type='number'] {
      border: none;
      width: 100%;
      height: 48px;
      text-align: center;
    }
  }
}

.popup {
  font-size: 0;
  background-color: #fff;
  padding: 25px;
  h3 {
    font-size: 16px;
    line-height: 1;
    margin-bottom: 25px;
    font-weight: normal;
    text-align: center;
  }
}

.point-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  span:last-child {
    color: red !important;
  }
}
.zoom-image {
  width: 100%;
  overflow: auto;
}
.button-group {
  padding: 0 30rpx 20rpx;
  display: flex;
  .zoom-btn {
    flex: 1;
    border-radius: 0;
    &[type='default'] {
      background: #ddd;
    }
    &[type='warn'] {
      background: #e6a23c;
    }
    &:first-child {
      border-radius: 16rpx 0 0 16rpx;
    }
    &:last-child {
      border-radius: 0 16rpx 16rpx 0;
    }
  }
}
</style>
