<template>
  <view class="main">
    <!-- <view class="image-content">
      <image :mode="mode" src="../../static/images/bg.png"></image>
    </view> -->
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <uni-card class="card" style="margin-top: 0;">
          <uni-section title="基本信息" type="line"></uni-section>
          <uni-form-item label="企业名称" align="left">
            <div>{{ companyInfo.name }}</div>
          </uni-form-item>
          <uni-form-item label="企业资质" align="left">
            <div>{{ $getLabelFromArg('companyQualification', companyInfo.companyQualification) }}</div>
          </uni-form-item>
          <uni-form-item label="企业类型" align="left">
            <div>{{ $getLabelFromArg('companyType', companyInfo.companyType) }}</div>
          </uni-form-item>
          <uni-form-item label="所在地区" align="left">
            <div>{{ companyInfo.contactMunicipalDistrict }}</div>
          </uni-form-item>
          <uni-form-item label="详细地址" align="left">
            <div>{{ companyInfo.contactDetailedAddress }}</div>
          </uni-form-item>
          <uni-form-item label="邮政编码" align="left">
            <div>{{ companyInfo.postalCode }}</div>
          </uni-form-item>
          <uni-form-item label="企业传真" align="left">
            <div>{{ companyInfo.fax }}</div>
          </uni-form-item>
          <uni-form-item label="企业网址" align="left">
            <div>{{ companyInfo.officalWebsite }}</div>
          </uni-form-item>
          <uni-form-item label="成立时间" align="left">
            <div>{{ companyInfo.registerTime | formatData }}</div>
          </uni-form-item>
        </uni-card>

        <uni-card class="card" style="margin-top: 20px;">
          <uni-section title="企业联系人 " type="line"></uni-section>
          <uni-form-item label="联系人姓名" align="left">
            <div>{{ companyInfo.limkman }}</div>
          </uni-form-item>
          <!--          <uni-form-item label="尊称" align="left">-->
          <!--            <div>{{ companyInfo.registerTime }}</div>-->
          <!--          </uni-form-item>-->
          <uni-form-item label="部门职务" align="left">
            <div>{{ companyInfo.departmentPosition }}</div>
          </uni-form-item>
          <uni-form-item label="手机号码" align="left">
            <div>{{ companyInfo.linkmanMobile }}</div>
          </uni-form-item>
          <!--          <uni-form-item label="电子邮箱" align="left">-->
          <!--            <div>{{ companyInfo.registerTime }}</div>-->
          <!--          </uni-form-item>-->
        </uni-card>
      </div>
    </scroll-view>
  </view>
</template>

<script>
import uniSection from '@/components/uni-section/uni-section.vue'
import getPcaName from '@/utils/getPcaName'
export default {
  name: 'Index',
  components: {
    uniSection
  },
  data() {
    return {
      mode: 'scaleToFill',
      companyInfo: {}
    }
  },
  created() {
    this.getCompanyInfo()
  },
  methods: {
    getCompanyInfo() {
      this.fly.system.get('cim6d/system/company/info/get').then(res => {
        // console.log(res)
        this.companyInfo = res.data
        let areaCode = res.data.contactMunicipalDistrict
        let provinceCode = areaCode.slice(0, 2)
        let cityCode = areaCode.slice(0, 4)
        this.companyInfo.contactMunicipalDistrict = [provinceCode, cityCode, areaCode].map(getPcaName).join(' ')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.image-content {
  image {
    width: 750px;
    height: 300px;
  }
}
.main-body {
  padding: 10px 20px;
}
.uni-section {
  height: 80px;
}
/deep/.uni-section__content-title {
  /*font-size: 16px;*/
}
.form-item {
  padding: 18px 17px 14px;
}
.scroll-roll {
  height: 68vh;
}
</style>
