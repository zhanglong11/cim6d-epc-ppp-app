<template>
  <view class="main">
    <view class="main-body">
      <!-- 实时数据 -->
      <div class="card summary">
        <div>
          <h2>{{ info.name }}</h2>
          <view class="read-status">
            <uni-status :options="readStatus" :value="info.status"></uni-status>
          </view>
          <ul>
            <li>
              <h6>编制日期</h6>
              <p>{{ info.diaryDate | formatData }}</p>
            </li>
            <li>
              <h6>记录人员</h6>
              <p>{{ info.recordUserName || info.creatorName }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="card base-info">
        <h3 class="base-info-title">
          基本信息
        </h3>
        <ul>
          <li>
            <span class="label">工程名称</span><span class="value">{{ info.name }}</span>
          </li>
          <li>
            <span class="label">日志编号</span><span class="value">{{ info.code }}</span>
          </li>
          <li>
            <span class="label">项目负责人</span><span class="value">{{ info.chargePersonName }}</span>
          </li>
          <li>
            <span class="label">施工人员</span><span class="value">{{ info.constructionPersonNames }}</span>
          </li>
          <li>
            <span class="label">施工人数</span
            ><span class="value">{{ info.constructionPersonCount && info.constructionPersonCount + '人' }}</span>
          </li>
        </ul>
      </div>
      <div class="card weather">
        <h3 class="weather-title">
          今日天气
        </h3>
        <ul>
          <li>
            <span class="label">今天天气</span><span class="value">{{ info.todayWeather }}</span>
          </li>
          <uni-form-item label="温度(℃)" :border="false" align="left">
            <view v-if="info.lowTemperature" class="placeholder"
              >{{ info.lowTemperature + '°C' }}~{{ info.highTemperature + '°C' }}</view
            >
          </uni-form-item>
          <!--          <li>-->
          <!--            <span class="label">上午温度（°C）</span-->
          <!--            ><span class="value">{{ info.morningWeather && info.morningWeather + '°C' }}</span>-->
          <!--          </li>-->
          <!--          <li>-->
          <!--            <span class="label">午间温度（°C）</span-->
          <!--            ><span class="value">{{ info.noonWeather && info.noonWeather + '°C' }}</span>-->
          <!--          </li>-->
          <!--          <li>-->
          <!--            <span class="label">下午温度（°C）</span-->
          <!--            ><span class="value">{{ info.afternoonWeather && info.afternoonWeather + '°C' }}</span>-->
          <!--          </li>-->
        </ul>
      </div>
      <div class="card progress">
        <h3 class="progress-title">
          进度状况
        </h3>
        <ul>
          <li>
            <h6>施工工程及内容</h6>
            <div class="value">
              {{ info.costructionContent }}
            </div>
          </li>
          <li>
            <h6>质量情况</h6>
            <div class="value">{{ info.qualityProblem }}</div>
          </li>
          <li>
            <h6>安全情况</h6>
            <div class="value">{{ info.safetyProblem }}</div>
          </li>
          <li>
            <h6>物资设备进退情况</h6>
            <div class="value">{{ info.equipmentEnterExit }}</div>
          </li>
          <li>
            <h6>进度情况</h6>
            <div class="value">{{ info.constructionProgress }}</div>
          </li>
        </ul>
      </div>
      <div class="card attachment">
        <ul>
          <li>
            <span class="label">抄送</span><span class="value">{{ info.copyToPersonName }}</span>
          </li>
          <li>
            <span class="label" style="width:100px">备注</span><span class="value">{{ info.remark }}</span>
          </li>
          <li style="align-items: start;display: flex;">
            <span class="label" style="width:100px">附件</span
            ><span class="value"> <uni-attachment v-model="info.fileIds"></uni-attachment></span>
          </li>
        </ul>
      </div>
    </view>
  </view>
</template>

<script>
import readStatus from './lib/readStatus'
export default {
  data() {
    return {
      id: null,
      info: {},
      readStatus
    }
  },
  onLoad(option) {
    this.id = option.id
    // if (!option.messageId) {
    //   return
    // }
    // this.fly.system.get('message/read/' + option.messageId)
  },
  onShow() {
    this.handleQueryLogInfo()
  },
  methods: {
    async handleQueryLogInfo() {
      let result = await this.fly.log.get(`/dailydiary/get/${this.id}`)
      console.log(result)
      if (result.code === 200) {
        this.info = result.data || {}
      }
      console.log(this.info)
    }
  }
}
</script>

<style lang="less">
@import url('./detail.less');
</style>
