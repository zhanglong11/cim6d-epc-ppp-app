<template>
  <view class="w_table">
    <view
      class="w_table_swper"
      :style="{ height: height ? (height.indexOf('%') !== -1 ? height : height + 'upx') : '100%' }"
    >
      <view class="w_table_content">
        <!-- 表头 -->
        <view class="w-table_title" :style="{ background: headbBackground }">
          <view
            v-for="(item, index) in columns"
            :key="index"
            class="w-table_title_item"
            :class="{ 'w-table_title_item_border': border }"
            :style="{ width: item.width ? item.width + 'upx' : '200upx', textAlign: item.align || 'left' }"
          >
            <view v-if="item.type === 'checkbox'" class="w_table_title_content">
              <checkbox :checked="allCheck" @click.native.stop="checkHeader" />
            </view>
            <view v-if="item.type === 'index'" class="w_table_title_content">序号</view>
            <text v-if="item.title" class="w_table_title_content">{{ item.title }}</text>
          </view>
        </view>
        <!-- 表体 -->
        <view v-for="(item, index) in data" v-if="data.length" :key="index" class="w_table_body">
          <view
            v-for="(col, cIndex) in columns"
            :key="cIndex"
            class="w_table_body_col"
            :style="{ textAlign: col.align || 'left' }"
            @click="clickRow(item, index)"
          >
            <view
              class="col_cell"
              :class="{ col_cell_border: border }"
              :style="{ width: col.width ? col.width + 'upx' : '200upx' }"
            >
              <view class="col_text">
                <checkbox
                  v-if="col.type === 'checkbox'"
                  :checked="item._isChecked"
                  @click.native.stop="checkItemCheckbox(item, index)"
                />
                <view v-if="col.type === 'index'">
                  {{ index + 1 }}
                </view>
                <Cell v-if="col.render" :row="item" :column="col" :index="index" :render="col.render" />
                <text
                  v-else-if="!col.render"
                  :style="{ color: col.key === 'combinedPrice' ? '#5eb1e8' : '' }"
                  v-html="item[col.key]"
                ></text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="data.length == 0" class="w_table_null">
        <view style="color: #ccc;">{{ noDataText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import Cell from './cell'
export default {
  components: {
    Cell
  },
  props: {
    /**
     * data要传入的饿数据数组
     */
    data: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    border: {
      type: Boolean,
      default: false
    },
    height: {
      type: [Number, String],
      default: 0
    },
    headbBackground: {
      type: String,
      default: '#C8C7CC'
    },
    noDataText: {
      type: String,
      default: '暂无数据'
    }
  },
  data: () => {
    return {
      allCheck: false
    }
  },
  computed: {},
  created() {
    this.columns.forEach(it => {
      it.type = it.type || 'html'
      if (it.render) {
        it.type = 'render'
      }
    })
    this.data.forEach(it => {
      it._isChecked = false
    })
  },
  mounted() {},
  methods: {
    /**
     * 	-- 单击某一行时触发
     * @param {Object} item为当前行的数据
     * @param {Object} index为当前行的下标
     */
    clickRow(row, index) {
      let params = {
        row,
        index
      }
      this.$emit('on-row-click', params)
    },
    /**
     * 	--	 点击全选
     */
    checkHeader() {
      this.allCheck = !this.allCheck
      this.data.forEach(it => {
        it._isChecked = this.allCheck
      })
      this.$emit('on-select-all', {
        allChecked: this.data.filter(item => item._isChecked)
      })
    },
    /**
     * 	--	点击单选
     */
    checkItemCheckbox(item) {
      item._isChecked = !item._isChecked
      this.data.forEach(it => {
        if (!it._isChecked) {
          this.allCheck = false
        }
      })
      let ary = this.data.filter(item => item._isChecked) //已选择的项
      if (ary.length == this.data.length) {
        this.allCheck = true
      }
      this.$emit('on-select', {
        allChecked: ary,
        checked: item
      })
    }
  }
}
</script>

<style>
.w_table {
  width: 100%;
  position: relative;
  display: inline-block;
  height: 100%;
  line-height: 48rpx;
  min-height: 150rpx;
  min-width: 100%;
  border: 2upx solid rgba(220, 220, 220, 1);
  font-size: 12px;
  box-sizing: border-box;
  overflow: scroll;
}

.w_table_swper {
  height: 100%;
  box-sizing: border-box;
}

.w_table_content {
  height: 100%;
  width: 100%;
}

.w-table_title {
  width: fit-content;
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
  font-size: 13px;
  font-weight: bold;
  color: rgba(78, 78, 78, 1);
}

.w-table_title_item {
  display: inline-block;
}

.w-table_title_item_border {
  border-right: 2upx solid rgba(220, 220, 220, 1);
}

.w_table_title_content {
  display: block;
  padding: 14rpx 6rpx;
}

.w_table_body {
  display: flex;
  justify-content: space-between;
}

.w_table_body_col {
  box-sizing: border-box;
  width: 100%;
  border-bottom: 2upx solid rgba(220, 220, 220, 1);
  margin: 0 auto;
}

.w_table_body_col > .col_cell {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 10rpx 6rpx;
  vertical-align: top;
  font-size: 11px;
  color: rgba(131, 131, 131, 1);
  background-color: #fff;
}

.col_cell_border {
  border-right: 2upx solid rgba(220, 220, 220, 1);
}

.col_cell_last {
  border: none;
}

.col_text {
  display: inline-block;
  /* padding: 0 10upx; */
  margin: 0 auto;
}

.w_table_null {
  width: 100%;
  height: 76upx;
  position: absolute;
  top: 76upx;
  line-height: 76upx;
  text-align: center;
  background-color: #fff;
}
</style>
