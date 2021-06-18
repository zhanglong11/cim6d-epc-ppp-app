<template>
  <div>
    <view>{{ currentItem.name }}</view>
    <swiper class="swiper" style="width: 100vw" @change="swipperChange">
      <swiper-item v-for="e in list" :key="e.name">
        <ul>
          <li v-for="f in e.children" :key="f.name">
            {{ f.name }}
          </li>
        </ul>
      </swiper-item>
    </swiper>
    <web-view style="height: 50vh;top:45vh;" src="/hybrid/html/V1.6.2/demo.html"></web-view>
  </div>
</template>

<script>
export default {
  name: 'SelectBimComponent',
  data() {
    return {
      list: [
        {
          name: '1#楼',
          children: [{ name: '1F' }, { name: '2F' }, { name: '3F' }, { name: '4F' }, { name: '5F' }, { name: '6F' }]
        },
        {
          name: '2#楼',
          children: [
            { name: '21F' },
            { name: '22F' },
            { name: '23F' },
            { name: '24F' },
            { name: '25F' },
            { name: '26F' }
          ]
        },
        {
          name: '3#楼',
          children: [
            { name: '31F' },
            { name: '32F' },
            { name: '33F' },
            { name: '34F' },
            { name: '35F' },
            { name: '36F' }
          ]
        }
      ],
      current: 0
    }
  },
  computed: {
    currentItem() {
      return this.list[this.current]
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    swipperChange({ detail: { current } }) {
      this.current = current
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
ul {
  display: flex;
  flex-wrap: wrap;
  li {
    padding: 10px 30px;
    margin: 10px;
    background-color: #fff;
    border: #999 1px solid;
  }
}
</style>
