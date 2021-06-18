let tokenName = 'token'

// 获取token
export const getToken = () => {
  return uni.getStorageSync(tokenName) || ''
}

// 设置token
export const setToken = token => {
  uni.setStorageSync(tokenName, token)
}

// 删除token
export const removeToken = () => {
  uni.removeStorageSync(tokenName)
}
