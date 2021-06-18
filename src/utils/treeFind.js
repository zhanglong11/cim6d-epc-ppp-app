/**
 * 在树结构中查找符合条件的节点
 * @param treeData  树结构数据
 * @param fn  匹配函数，返回true则为符合条件
 * @returns {Object}
 */
export default function(treeData, fn) {
  let result = null
  c(treeData, null)
  function c(list, parent) {
    for (let item of list) {
      if (result) return false
      if (fn(item)) {
        if (parent) item.parent = parent
        result = item
      }
      if (item.children) {
        c(item.children, item)
      }
    }
  }
  return result
}
