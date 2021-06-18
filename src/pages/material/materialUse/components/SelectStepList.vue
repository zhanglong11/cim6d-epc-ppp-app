<template>
  <view class="main-body">
    <view class="main-header">
      <view class="info">
        <span>{{ startDay }}</span>
        <span>任务进度: {{ computedMonthDetail.doneCount }}/{{ computedMonthDetail.count }}</span>
        <span>{{ endDay }}</span>
        <span>时间进度: {{ computedMonthDetail.actualDuration }}/{{ computedMonthDetail.planDuration }}</span>
      </view>
    </view>
    <view>
      <uni-search-bar placeholder="搜索" @input="handleSearch"></uni-search-bar>
    </view>
    <scroll-view class="scroll-roll" scroll-y>
      <checkbox-group>
        <uni-card
          v-for="item in computedList"
          :key="item.id"
          :checked="item.checked"
          class="item"
          @click="changeBox(item)"
        >
          <view class="card-body">
            <checkbox :value="item.id" :checked="item.checked" />
            <view class="card-info">
              <section>
                <h2>
                  {{ item.name }}
                </h2>
                <p>计划开始日期：{{ item.planStartTime | ymd }}</p>
                <p>计划结束日期：{{ item.planEndTime | ymd }}</p>
                <aside>
                  <p>{{ item.wbsCode }}</p>
                  <p>{{ item.statusText }}</p>
                </aside>
              </section>
              <footer>
                <span>填报人:{{ item.creatorName }}</span>
                <span>填报时间：{{ item.createTime | ymd }}</span>
              </footer>
            </view>
          </view>
        </uni-card>
      </checkbox-group>
    </scroll-view>
    <view class="btn-wrapper">
      <!--      <button v-if="hasClose" class="button default" @click="close">返回</button>-->
      <button class="button" type="primary" @click="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script>
import treeFilter from '@/utils/treeFilter'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'Step3',
  props: {
    year: {
      type: [String, Number],
      default: ''
    },
    month: {
      type: [String, Number],
      default: ''
    },
    checked: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // year: null,
      // month: null,
      startDay: '',
      endDay: '',
      mode: 'view', // view  列表  startTask 查看   writeTask 填报
      computedList: [],
      checkedValue: [],
      q: ''
    }
  },
  computed: {
    list() {
      if (this.q) {
        return this.$store.state.schedule.list.filter(e => e.name.includes(this.q))
      } else {
        return this.$store.state.schedule.list
      }
    },
    computedMonthDetail() {
      return (
        _.chain(this.$store.state.schedule.yearList)
          .find({ year: this.year })
          .get('children')
          .find({ month: this.month })
          .value() || {}
      )
    },
    haveCheckedItems() {
      return this.computedList.filter(e => e.checked).length > 0
    }
  },
  watch: {
    /*list() {
      // console.log('1111')
      const { year, month } = this
      console.log('list')
      this.list.forEach(e => (e.checked = false))
      this.computedList = _.cloneDeep(this.list).filter(e => {
        return moment().year(year).month(month).isBetween(moment(e.planStartTime), moment(e.planEndTime), 'month', '[]')
      })
    },*/
    list: {
      deep: true,
      immediate: true,
      handler(val) {
        const { year, month } = this
        this.list.forEach(e => (e.checked = false))
        this.computedList = _.cloneDeep(val).filter(e => {
          return moment()
            .year(year)
            .month(month)
            .isBetween(moment(e.planStartTime), moment(e.planEndTime), 'month', '[]')
        })
      }
    }
  },
  mounted() {
    let year = this.year
    let month = this.month
    this.year = +year
    this.month = +month
    const day = moment()
      .year(year)
      .month(month - 1)
    this.startDay = day.startOf('month').format('YYYY-MM-DD')
    this.endDay = day.endOf('month').format('YYYY-MM-DD')
  },
  onShow() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.$store.dispatch('schedule/getList')
    },
    handleSearch(e) {
      this.q = e.value
    },
    changeBox(item) {
      let index = this.checkedValue.indexOf(item.id)
      console.log(`index${index}`)
      if (index < 0) {
        this.checkedValue.push(item.id)
      } else {
        this.checkedValue.splice(index, 1)
      }
      item.checked = !item.checked
    },
    handleSubmit() {
      if (this.checkedValue.length === 0 && !this.hasChoice) {
        this.$utils.showToast('当前没有选中项')
        return
      }
      let checked = []
      checked = this.list.filter(item => this.checkedValue.includes(item.id))
      this.$emit('selected', {
        checkedValue: this.checkedValue,
        checked
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
.main-body {
  padding-bottom: 20px;
}
.main-header {
  border-radius: 30px;
  font-size: 13px;
  display: block;
  background-color: #fff;
  line-height: 1.5;
  padding: 15px 55px;
  margin-bottom: 25px;
  .info {
    width: 100%;
    margin: 0 auto;
    color: #888;
    font-size: 13px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    span {
      width: 50%;
    }
  }
}
.scroll-roll {
  margin-top: 30px;
}
.item {
  width: 700px;
  height: auto;
  position: relative;
  margin-bottom: 25px;
  list-style: none;
  section {
    padding: 20px 31px;
    position: relative;
    aside {
      position: absolute;
      top: 50%;
      right: 40px;
      transform: translateY(-50%);
      font-weight: bold;
      font-size: 14px;
    }
    h2 {
      font-size: 14px;
      font-weight: normal;
      display: flex;
      align-items: center;
      span {
        width: 5px;
        height: 26px;
        margin-right: 10px;
        border-radius: 2.5px;
      }
    }

    p {
      margin-top: 30px;
      color: #989898;
    }
  }

  p,
  span {
    font-size: 12px;
  }

  footer {
    margin: 0 31px;
    display: flex;
    line-height: 76px;
    justify-content: space-between;
    border-top: 1px solid #f1f1f1;

    span {
      color: #4f6481;
    }
  }
}
.add-button,
.start-button {
  position: sticky;
  bottom: 30px;
}
.scroll-roll {
  height: 65vh;
}
.card-body {
  display: flex;
  /*padding: 15rpx;*/
}
.card-info {
  flex: 1;
}
/deep/ .uni-checkbox-wrapper {
  padding: 20px 0 0 20px;
}
</style>
