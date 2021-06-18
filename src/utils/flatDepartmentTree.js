const renderTreeList = function(arr) {
  return function _renderTreeList(list = [], idKey = 'id', rangeKey = 'name', rank = 0, parentId = [], parents = []) {
    list.forEach(item => {
      arr.push({
        id: item[idKey],
        name: item[rangeKey],
        source: item,
        parentId, // 父级id数组
        parents, // 父级id数组
        rank, // 层级
        showChild: false, //子级是否显示
        open: false, //是否打开
        show: rank === 0, // 自身是否显示
        hideArr: [],
        orChecked: item.checked ? item.checked : false,
        checked: item.checked ? item.checked : false
      })
      if (Array.isArray(item.children) && item.children.length > 0) {
        // console.log(item)
        let parentid = [...parentId],
          parentArr = [...parents],
          childrenid = [...childrenid]
        delete parentArr.children
        parentid.push(item[idKey])
        parentArr.push({
          [idKey]: item[idKey],
          [rangeKey]: item[rangeKey]
        })
        _renderTreeList(item.children, idKey, rangeKey, rank + 1, parentid, parentArr)
      } else {
        arr[arr.length - 1].lastRank = true
      }
    })
  }
}
export default renderTreeList
