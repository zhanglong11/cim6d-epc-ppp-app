<template>
  <div class="main">
    <div class="main-header">
      <div class="info ">
        <span>{{ startDay }}</span>
        <span>任务进度: {{ computedMonthDetail.doneCount }}/{{ computedMonthDetail.count }}</span>
        <span>{{ endDay }}</span>
        <span>时间进度: {{ computedMonthDetail.actualDuration }}/{{ computedMonthDetail.planDuration }}</span>
      </div>
    </div>
    <div>
      <uni-search-bar placeholder="搜索" @input="handleSearch"></uni-search-bar>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <uni-card
        v-for="item in computedList"
        :key="item.id"
        :checked="item.checked"
        :checkable="mode === 'writeTask' || mode === 'startTask'"
        :disabled="(mode === 'writeTask' && item.status !== 1) || (mode === 'startTask' && item.status !== 0)"
        class="item"
        @click="handleItemClick(item)"
      >
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
      </uni-card>
    </scroll-view>
    <uni-add toggle @click="handleAddClick"></uni-add>
    <view v-if="mode === 'writeTask'" class="btn-wrapper add-button">
      <button class="button" type="primary" @click="submit">进度填报</button>
    </view>
    <view v-if="mode === 'startTask'" class="btn-wrapper start-button">
      <button :disabled="haveCheckedItems" class="button" type="primary" @click="submitStartTask()">开始任务</button>
    </view>
  </div>
</template>

<script>
import treeFilter from '@/utils/treeFilter'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'Step3',
  data() {
    return {
      year: null,
      month: null,
      startDay: '',
      endDay: '',
      mode: 'view', // view  列表  startTask 查看   writeTask 填报
      computedList: [],
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
    list() {
      const { year, month } = this

      this.list.forEach(e => (e.checked = false))
      this.computedList = _.cloneDeep(this.list).filter(e => {
        return moment()
          .year(year)
          .month(month)
          .isBetween(moment(e.planStartTime), moment(e.planEndTime), 'month', '[]')
      })
    }
  },
  onLoad(options) {
    const { year, month } = options
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
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'start' && this.mode !== 'writeTask') {
      this.mode = this.mode === 'startTask' ? 'view' : 'startTask'
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.$store.dispatch('schedule/getList')
    },
    handleItemClick(item) {
      if (this.mode === 'view') {
        this.$utils.toUrl('detail?id=' + item.id)
      } else {
        const isMultiple = this.mode === 'startTask'
        if (isMultiple) {
          item.checked = !item.checked
        } else {
          const result = !item.checked
          this.computedList.forEach(e => {
            e.checked = false
          })
          item.checked = result
        }
      }
    },
    submit() {
      const target = _.find(this.computedList, { checked: true })
      this.$utils.toUrl('add?id=' + target.id)
      this.mode = 'view'
    },
    submitStartTask() {
      const promiseList = this.computedList
        .filter(e => e.checked)
        .map(e =>
          this.fly.schedule
            .post('construct/task/start', {
              taskId: e.id,
              actualStartTime: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            .then(() => {
              this.mode = 'view'
            })
        )
      this.mode = 'view'
      Promise.all(promiseList).then(res => {
        this.$utils.showToast('操作成功')
        this.refresh()
      })
    },
    handleSearch(e) {
      this.q = e.value
    },
    handleAddClick(opened) {
      this.mode = opened ? 'writeTask' : 'view'
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
</style>
