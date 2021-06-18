<template>
  <div class="main">
    <div class="main-header">
      <m-steps :options="stepsOptions" :active="activeID"></m-steps>
    </div>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y @click.stop>
      <ul class="item-list">
        <li v-for="item in list" :key="item.id" :class="{ active: item.checked }" @click="handleClick(item)">
          <div class="check"></div>
          <div class="info">
            <p class="name">{{ item.measureIndex }}</p>
          </div>
        </li>
      </ul>
    </scroll-view>
  </div>
</template>

<script>
import mSteps from '@/components/m-steps'
export default {
  name: 'Add',
  components: {
    mSteps
  },
  data() {
    return {
      stepsOptions: [{ title: '请选择位置' }, { title: '请选择测量项' }, { title: '请选择指标' }],
      activeID: 2,
      form: {},
      list: []
    }
  },
  onLoad() {
    this.form = JSON.parse(wx.getStorageSync('measureAddForm'))
    this.stepsOptions[0].title = this.form.measureLocation
    this.stepsOptions[1].title = this.form.measureName
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'next') {
      this.form.metricsList = this.list.filter(e => e.checked)
      if (this.form.metricsList && this.form.metricsList.length === 0) {
        this.$utils.showToast('请选择指标')
        return
      }
      wx.setStorageSync('measureAddForm', JSON.stringify(this.form))
      this.$utils.toUrl('/pages/quality/measure/step-4?')
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.safety
        .post('standard/measure/index/list', {
          projectId: this.$store.state.project.projectId,
          standardLibraryId: this.form.measureId
        })
        .then(res => {
          res.data.forEach(e => (e.checked = false))
          this.list = res.data
        })
    },
    submit() {},
    remove() {},
    handleClick(item) {
      item.checked = !item.checked
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
}
.uni-card {
  width: 700px;
}
.item-list {
  margin: 0 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px #eee;
  border-radius: 20px;
  background-color: #fff;
  li {
    display: flex;
    color: #6b6b6b;
    padding: 20px 30px;
    border-bottom: 1px solid rgba(241, 241, 241, 1);
    align-items: center;
    transition: all 0.3s;
    .info {
      flex: 1;
    }
    .check {
      margin-right: 40px;
      margin-left: 10px;
      font-size: 0;
      width: 30px;
      height: 30px;
      border: 2px @headerColor solid;
      border-radius: 50%;
      transition: all 0.4s;
      display: flex;
      align-items: center;
      justify-content: center;
      &:before {
        content: '';
        margin-top: -4px;
        width: 15px;
        height: 10px;
        border-left: 2px #fff solid;
        border-bottom: 2px #fff solid;
        transform: rotate(-45deg);
      }
    }
    /deep/.avatar {
      transition: all 0.3s;
    }
    &:active {
      background: @backGroundColor;
      opacity: 0.7;
      /deep/.avatar {
        transform: scale(1.1);
      }
    }
    &.active {
      .check {
        background: @headerColor;
      }
    }
  }
}
</style>
