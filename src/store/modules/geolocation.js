export default {
  namespaced: true,
  state: {
    location: {},
    locationName: '', //名称
    longitude: '', //经度
    latitude: '', //纬度
    address: {},
    province: '',
    city: '',
    district: ''
  },
  mutations: {
    getLocation(state, data) {
      let { name, longitude, latitude, address, province, city, district } = data
      uni.setStorageSync('location', data)
      uni.setStorageSync('locationName', name)
      uni.setStorageSync('longitude', longitude)
      uni.setStorageSync('latitude', latitude)
      uni.setStorageSync('address', address)
      uni.setStorageSync('province', province)
      uni.setStorageSync('city', city)
      uni.setStorageSync('district', district)
      state.location = data
      state.locationName = name
      state.longitude = longitude
      state.latitude = latitude
      state.address = address
      state.province = province
      state.city = city
      state.district = district
    }
  },
  actions: {
    getLocation({ commit }) {
      uni.getLocation({
        type: 'wgs84',
        geocode: true,
        success: function(res) {
          commit('getLocation', res)
        },
        error: function(res) {
          // console.log(res)
          commit('getLocation', res)
        },
        complete: function(res) {
          // console.log(res)
          commit('getLocation', res)
        }
      })
    }
  }
}
