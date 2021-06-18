/*
 * @Author: 耿为刚 创建
 * @Date: 2020-04-30
 * @Last Modified by: gengweigang
 * @Desc 全局过滤器
 */

// 时间截取年月日
export const formatData = str => {
  if (!str) {
    return ''
  }
  return str.substring(0, 10)
}
/**
 * 日期格式化，返回YYYY-MM
 * @param str
 * @returns {string} YYYY-MM
 */
export const ym = str => {
  if (!str) {
    return ''
  }
  return str.substring(0, 7)
}
/**
 * 日期格式化，返回YYYY-MM-DD
 * @param str
 * @returns {string} YYYY-MM-DD
 */
export const ymd = str => {
  if (!str) {
    return ''
  }
  return str.substring(0, 10)
}

export const ymdhm = str => {
  if (!str) {
    return ''
  }
  return str.substring(0, 16)
}

// 时间截取年月日时分秒
export const formatDataTime = str => {
  if (!str) {
    return ''
  }
  return str.substring(0, 19)
}

// 获取工序状态
export const getWorkingStatus = str => {
  let statusStr = ''
  switch (str) {
    case 0:
      statusStr = '未开始'
      break
    case 1:
      statusStr = '进行中'
      break
    case 2:
      statusStr = '待确认'
      break
    case 3:
      statusStr = '已完成'
      break
    default:
      statusStr = '未开始'
  }
  return statusStr
}

// 格式化金额
export const formatMoney = (number, n = 2) => {
  if (!number) {
    return 0
  }
  n = n > 0 && n <= 20 ? n : 2
  number = parseFloat((number + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
  var l = number.split('.')[0].split('').reverse(),
    r = number.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
  }
  return t.split('').reverse().join('') + '.' + r
}
/**
 *  以万为单位格式化money
 * number:金额，大于10万，以万为单位计数，否则以元为单位
 * n：小数点后保留几位，默认两位
 * **/
export const formatMoneyBaseWan = (number, n = 2) => {
  if (!number) {
    return 0
  }
  let base = 10000

  if (number < 10 * base) {
    return Number(number).toFixed(n) + '元'
  } else {
    return Number(number / 10000).toFixed(n) + '万'
  }
}
// 处理空字符串
export const formatStr = str => {
  let newStr = str || '--'
  return newStr
}
export const formatFileSize = value => {
  if (null === value || value === '') {
    return '0 Bytes'
  }
  var unitArr = new Array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
  var index = 0
  var srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  var size = srcsize / Math.pow(1024, index)
  size = size.toFixed(2) //保留的小数位数
  return size + unitArr[index]
}

/***
 * 转化分钟为时分
 * 如93分钟转化为1小时33分钟
 * ***/
export const formatTimeText = time => {
  let mm = Number(time)
  if (isNaN(mm) || mm === 0) return null
  let str = ''
  let HH = Math.floor(mm / 60)
  str += HH > 0 ? `${HH}小时` : ''
  let MM = mm % 60
  str += MM > 0 ? `${MM}分钟` : ''
  return str
}
