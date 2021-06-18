/*
 * @Author: 耿为刚 创建
 * @Date: 2020-04-23
 */
import { getToken } from './auth'
import { throttle } from 'lodash'
const JSEncrypt = require('@/static/js/wx_jsencrypt')
let bimUrl = process.env.VUE_APP_BASE_BIMURL
// 真机运行配置
// #ifdef APP-PLUS
// bimUrl = 'http://172.16.10.41:9001' // 测试环境
bimUrl = 'http://ly.gim6d.com:8911'
// #endif
export default {
  webBimUrl: bimUrl, // BIM模型加载地址http://luoyang.gim6d.com:18911 //本地调试地址 http://172.16.10.10:88
  bimBaseUrl: bimUrl, // Bim模型API请求地址
  /**
   * 跳转路由
   * @param {String} url  跳转地址
   * @param {Number} [type]  null:默认,保留当前页面，跳转到应用内的某个页面   1: 关闭所有页面，打开到应用内的某个页面。  2  关闭当前页面，跳转到应用内的某个页面。  3  跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
   */
  toUrl(url, type) {
    // 不验证登录白名单
    let whiteList = ['/pages/guide/index', '/pages/login/login', '/pages/main/main', '/pages/user/index']
    if (!whiteList.includes(url)) {
      let token = getToken()
      // url为空，代表功能未开发
      if (token && !url) {
        this.showToast('功能开发中，敬请期待!')
        return
      }
      // 未登录跳转逻辑
      if (!token) {
        uni.showModal({
          title: '提示',
          content: '您还未登录，是否立即登录？',
          success: e => {
            if (e.confirm) {
              this.toUrl('/pages/login/login')
            }
          }
        })
        return
      }
    }

    if (type === 1) {
      // 关闭所有页面，打开到应用内的某个页面。
      uni.reLaunch({
        url
      })
    } else if (type === 2) {
      // 关闭当前页面，跳转到应用内的某个页面。
      uni.redirectTo({
        url
      })
    } else if (type === 3) {
      // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
      uni.switchTab({
        url
      })
    } else {
      //保留当前页面，跳转到应用内的某个页面
      uni.navigateTo({
        url
      })
    }
  },
  /**
   * 显示消息提示框
   * @param title
   * @param [icon = 'none'] 左侧图标
   * @param {Object} [options]
   */
  showToast(title, icon = 'none', options = {}) {
    options = {
      title,
      duration: 1500,
      icon,
      ...options
    }
    uni.showToast(options)
  },
  /**
   * 返回上一页
   * @param {Number} [num=1] 返回的层数
   */
  goBack(num = 1) {
    uni.navigateBack({ delta: num })
  },
  /**
   * 显示 loading 提示框
   */
  showLoading(title = '加载中...') {
    uni.showLoading({
      title,
      mask: true
    })
  },
  /**
   * 隐藏 loading 提示框
   * @param {Number} [timeout=100]
   */
  hideLoading(timeout = 100) {
    setTimeout(() => {
      uni.hideLoading()
    }, timeout)
  },
  /**
   * 动态设置标题栏
   * @param title
   */
  setTitle(title) {
    uni.setNavigationBarTitle({
      title
    })
  },
  /**
   * 隐藏导航栏右侧按钮(该方法需要使用 call 调用)
   * @param {Number} [index] 隐藏第几个按钮
   */
  hideNavButton(index = 0) {
    // #ifdef  APP-PLUS
    let webView = this.$mp.page.$getAppWebview()
    webView.setTitleNViewButtonStyle(index, {
      width: 0
    })
    // #endif
  },
  /**
   * 设置导航栏右侧按钮(该方法需要使用 call 调用)
   * @param {Number} index
   * @param options
   */
  setNavButton(index = 0, options) {
    // #ifdef  APP-PLUS
    let webView = this.$mp.page.$getAppWebview()
    webView.setTitleNViewButtonStyle(index, options)
    // #endif
  },
  /*
		数组排序
		name 排序字段
		用法 Array.sort(setSort('creationTime'))
       */
  setSort(name) {
    return function (o, p) {
      let a, b
      if (typeof o === 'object' && typeof p === 'object' && o && p) {
        a = o[name]
        b = p[name]
        if (a === b) {
          return 0
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1
        }
        return typeof a < typeof b ? -1 : 1
      } else {
        throw 'error'
      }
    }
  },
  /*
		获取日期函数 返回2018-06-06
		AddDayCount 天数
		getDateStr(0) //获取当前日期
		getDateStr(-10) //获取前10天日期
		getDateStr(20) //获取后20天日期
       */
  getDateStr(AddDayCount, type = 'datetime') {
    let date = new Date()
    date.setDate(date.getDate() + AddDayCount)
    return this.getDateAll(date, type)
  },
  getDateAll(date, type) {
    let year = date.getFullYear()
    //day获取当前几号，不足10补0
    let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    //month获取当前月份的日期，不足10补0
    let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    let hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
    let minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
    let seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
    let newDate = year + '-' + month + '-' + day
    if (type === 'datetime') {
      newDate += ' ' + hours + ':' + minutes + ':' + seconds
    }
    return newDate
  },
  // uuid 生成工具
  getUuid(len = 20, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = []
    radix = radix || chars.length
    if (len) {
      for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
      let r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16)
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }

    return uuid.join('')
  },
  // 登录加密
  userEncryption(obj) {
    let PUBLIC_KEY =
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChqImB8Pz4nTh3UBbA5m9zb+YCIwvop1Zxr8Bii6xoEt6+znWy/2WVXMV/NH28Yq34cH68VdcKSikEQlGnAqhci+9rrjVo0/vS2/D6RJcihXqfST9ZOMFsRJgxAQWyIbjL/Gf7HD5NrCM54TE+YOk/P6eI5Nc8lbkxXEavrLDtOwIDAQAB'

    // 使用公钥加密
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(PUBLIC_KEY)
    let loginName = encrypt.encrypt(obj.loginName)
    let password = encrypt.encrypt(obj.password)
    return {
      loginName,
      password
    }
  },
  // 截取日期年月日时分秒
  formatData(str) {
    if (!str) {
      return ''
    }
    return str.substring(0, 10)
  },
  // 计算两个日期时间差
  getDays(startDate, endDate) {
    if (!startDate || !endDate) {
      return '-'
    }
    let startDateStr = this.formatData(startDate).split('-') //将日期字符串分隔为数组,数组元素分别为年.月.日
    //根据年 . 月 . 日的值创建Date对象
    let startDateObj = new Date(startDateStr[0], startDateStr[1] - 1, startDateStr[2])
    let endDateStr = this.formatData(endDate).split('-')
    let endDateObj = new Date(endDateStr[0], endDateStr[1] - 1, endDateStr[2])
    let t1 = startDateObj.getTime()
    let t2 = endDateObj.getTime()
    let dateTime = 1000 * 60 * 60 * 24 //每一天的毫秒数
    let minusDays = Math.floor((t2 - t1) / dateTime) //计算出两个日期的天数差
    let days = Math.abs(minusDays) //取绝对值
    return days
  }
}
