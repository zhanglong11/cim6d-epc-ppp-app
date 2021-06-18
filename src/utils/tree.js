function toTree(data, rootKey = null, key = 'id', pKey = 'pid', childrenKey = 'children') {
  console.log(data)
  data.forEach(item => {
    let filt = data.filter(i => i[pKey] === item[key])
    if (filt.length > 0) {
      item[childrenKey] = filt
    } else {
      item[childrenKey] = null
    }
  })
  let result = []
  for (let i = 0; i < data.length; i++) {
    if (data[i][pKey] === rootKey) {
      result.push(data[i])
    }
  }
  return result
}
export default toTree
