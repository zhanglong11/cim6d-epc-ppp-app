<template>
  <div class="main">
    <div class="main-header">
      <m-steps :options="stepsOptions" :active="1"></m-steps>
    </div>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y @click.stop>
      <div class="group-list">
        <div v-for="group in list" :key="group.firstLetter" class="item">
          <h3>{{ group.name }}</h3>
          <ul class="item-list">
            <li
              v-for="item in group.children"
              :key="item.id"
              :class="{ active: item.id === activeRow.id }"
              @click="handleClick(item)"
            >
              <div class="check"></div>
              <div class="info">
                <p class="name">{{ item.name }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import mSteps from '@/components/m-steps'
import toTree from '@/utils/toTree'
export default {
  name: 'Add',
  components: {
    mSteps
  },
  data() {
    return {
      stepsOptions: [{ title: '请选择位置' }, { title: '请选择测量项' }, { title: '请选择指标' }],
      list: [],
      activeRow: {},
      form: {}
    }
  },
  onLoad() {
    this.form = JSON.parse(wx.getStorageSync('measureAddForm'))
    this.stepsOptions[0].title = this.form.measureLocation
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'next') {
      if (!this.activeRow.id) {
        this.$utils.showToast('请先选择一项')
      } else {
        wx.setStorageSync('measureAddForm', JSON.stringify(this.form))
        this.$utils.toUrl('/pages/quality/measure/step-3?')
      }
    }
  },
  created() {
    this.fly.safety.post('standard/library/list', { projectId: this.$store.state.project.projectId }).then(res => {
      this.list = toTree(res.data)
    })
  },
  mounted() {},
  methods: {
    refresh() {},
    submit() {},
    remove() {},
    handleClick(item) {
      this.activeRow = item
      this.form.measureId = this.activeRow.id
      this.form.measureName = this.activeRow.name
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
.group-list {
  padding-bottom: 30px;
  h3 {
    color: #ccc;
    padding: 20px 40px;
    font-size: 16px;
    font-weight: normal;
    position: sticky;
    top: 0px;
    background-color: #f9f9f9;
  }
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
