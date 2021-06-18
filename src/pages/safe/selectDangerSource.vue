<template>
  <div class="main">
    <uni-search-bar placeholder="搜索" @input="handleInput"></uni-search-bar>
    <scroll-view v-if="computedList.length" class="scroll-roll" scroll-with-animation scroll-y @click.stop>
      <ul class="list">
        <li v-for="item in computedList" :key="item.id" :class="{ active: item.checked }" @click="handleClick(item)">
          <div class="check"></div>
          <div class="info">
            <p class="name">{{ item.dangerSource }}</p>
            <div>
              <p>部位：{{ item.placeName }}</p>
              <p>伤害类别：{{ item.harmCategoryNames }}</p>
              <p>防范措施：{{ item.precautionaryMeasure }}</p>
            </div>
          </div>
        </li>
      </ul>
    </scroll-view>
    <emptyTemplate v-else></emptyTemplate>
  </div>
</template>
<script>
export default {
  name: 'SelectContractInventory',
  data() {
    return {
      q: '',
      key: '',
      list: []
    }
  },
  computed: {
    computedList() {
      let list
      if (this.q) {
        list = this.list.filter(e => e.dangerSource.includes(this.q) || e.harmCategoryNames.includes(this.q))
      } else {
        list = this.list
      }
      return list
    },
    checkedList() {
      return this.list.filter(e => e.checked)
    }
  },
  onLoad(option) {
    this.fly.safety
      .post('/dangerSource/list', {
        page: 1,
        row: 10000,
        projectId: wx.getStorageSync('projectId')
      })
      .then(res => {
        let list = res.data.records
        list.forEach(e => (e.checked = false))
        this.key = option.key
        const checkedIds = option.checkedIds ? option.checkedIds.split(',') : []
        list.forEach(item => {
          if (checkedIds.includes('' + item.id)) {
            item.checked = true
          }
        })
        this.list = list
      })
  },
  methods: {
    refresh() {},
    handleClick(f) {
      f.checked = !f.checked
      uni.$emit('update:selectDangerSource', { key: this.key, value: this.checkedList })
      uni.navigateBack()
    },
    handleInput({ value }) {
      this.q = value
    },
    remove(user) {
      user.checked = false
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common');
.list {
  margin: 30px 25px 0;
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
    image {
      width: 80px;
      height: 80px;
      margin-right: 15px;
    }
    .info {
      flex: 1;
      font-size: 14px;
      .name {
        font-size: 16px;
      }
      > div {
        margin-top: 10px;
        font-size: 12px;
      }
    }
    .depart {
      font-size: 12px;
      color: #888;
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
