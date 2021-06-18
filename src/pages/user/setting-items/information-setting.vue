<template>
  <view class="main is-white">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="card-container">
        <uni-card>
          <uni-form-item label="" :icon="userInfo.headImage" :iconSize="80">
            <view @click="handleEditImage">修改头像</view>
          </uni-form-item>
        </uni-card>
        <uni-card>
          <uni-form-item label="姓名">
            <view class="disabled">{{ userInfo.realName }}</view>
          </uni-form-item>
          <uni-form-item label="身份证号">
            <view class="disabled">{{ userInfo.identityCardNumber }}</view>
          </uni-form-item>
          <uni-form-item label="账户">
            <view class="disabled">{{ userInfo.loginName }}</view>
          </uni-form-item>
          <uni-form-item label="绑定手机">
            <view class="disabled">{{ userInfo.mobile }}</view>
          </uni-form-item>
          <uni-form-item label="邮箱">
            <input v-model="userInfo.email" placeholder="请输入邮箱" />
          </uni-form-item>
          <uni-form-item label="微信号">
            <input v-model="userInfo.wechatNumber" placeholder="请输入微信号" />
          </uni-form-item>
          <!-- <uni-form-item label="座机/分机">
            <view class="tel-wrapper">
              <input v-model="userInfo.tel.split('-')[0]" />- <input v-model="userInfo.tel.split('-')[1]" />-
              <input v-model="userInfo.tel.split('-')[2]" />
            </view>
          </uni-form-item>-->
        </uni-card>
        <uni-card>
          <uni-form-item label="职务">
            <view class="disabled">{{ userInfo.position }}</view>
          </uni-form-item>
          <uni-form-item label="角色">
            <view class="disabled">{{ userInfo.roleTexts && userInfo.roleTexts.join(',') }}</view>
          </uni-form-item>
          <uni-form-item label="所属部门">
            <view class="disabled">{{ userInfo.departmentNames }}</view>
          </uni-form-item>
          <!-- <uni-form-item label="所属公司">
            <view class="disabled">{{ userInfo.companyName }}</view>
          </uni-form-item>-->
        </uni-card>
        <!--<uni-card>
          <uni-form-item label="人员籍贯">
            <input v-model="userInfo.email" placeholder="请输入邮箱" />
          </uni-form-item>
          <uni-form-item label="现居住地">
            <input v-model="userInfo.email" placeholder="请输入邮箱" />
          </uni-form-item>
          <uni-form-item label="毕业院校">
            <input v-model="userInfo.email" placeholder="请输入邮箱" />
          </uni-form-item>
          <uni-form-item label="最高学历">
            <uni-select v-model="userInfo.education" :options="educationList"></uni-select>
          </uni-form-item>
          <uni-form-item label="政治面貌">
            <uni-select v-model="userInfo.political" :options="politicalList"></uni-select>
          </uni-form-item>
          <uni-form-item label="婚姻状态">
            <uni-select v-model="userInfo.marriage" :options="marriageList"></uni-select>
          </uni-form-item>
          <uni-form-item label="联系电话">
            <input v-model="userInfo.email" placeholder="请输入邮箱" />
          </uni-form-item>
          <uni-form-item label="紧急联系人">
            <input v-model="userInfo.email" placeholder="请输入邮箱" />
          </uni-form-item>
          <uni-form-item label="联系人电话">
            <input v-model="userInfo.email" placeholder="请输入邮箱" />
          </uni-form-item>
        </uni-card>-->
      </view>
    </scroll-view>
  </view>
</template>

<script>
import educationList from './lib/educationList'
import politicalList from './lib/politicalList'
import marriageList from './lib/marriageList'
import Api from '../api'
import { fileUrl } from '@/utils/http'
export default {
  name: 'InformationSetting',
  components: {},
  data() {
    return {
      userId: this.$store.getters.userId,
      educationList,
      politicalList,
      marriageList,
      userInfo: {}
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  onShow() {},
  onLoad(options) {},
  // 下拉刷新
  onPullDownRefresh() {},
  onNavigationBarButtonTap(obj) {
    this.updateUser()
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      let res = await Api.getUserInfo(this.userId)
      const departmentIds = res.data.departmentList && res.data.departmentList.map(item => item.departmentId)
      const departmentNames =
        res.data.departmentList && res.data.departmentList.map(item => item.departmentName).join(',')
      const roleIds = res.data.departmentList && res.data.roleList.map(item => item.roleId)
      this.userInfo = { ...res.data, departmentIds, roleIds, departmentNames }
    },
    //修改头像
    handleEditImage() {
      let that = this
      uni.chooseImage({
        sourceType: ['album', 'camera'],
        success: function(res) {
          that.handleUpload(res)
        }
      })
    },
    async handleUpload(res) {
      uni.showLoading({ title: '正在上传' })
      const { tempFilePaths } = res
      await uni
        .uploadFile({
          header: {
            'x-access-token': this.token
          },
          name: 'file',
          url: fileUrl + '/file/commonFile/uploadImage',
          filePath: tempFilePaths[0]
        })
        .then(([err, uploadFileRes]) => {
          const res = JSON.parse(uploadFileRes.data)
          this.userInfo.headImage = res.data
        })
        .catch(e => console.log(e))
        .finally(() => {
          uni.hideLoading()
        })
    },
    async updateUser() {
      await Api.updateUser(this.userInfo)
      this.$utils.showToast('保存成功')
      this.$store.commit('user/setUserInfo', { headImage: this.userInfo.headImage })
      this.$utils.goBack()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./information-setting.less');
</style>
