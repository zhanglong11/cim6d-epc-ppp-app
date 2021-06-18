/**
 *
 * @param {Array} treeList
 * @param {String} [parentKey]
 * @param {String} [key]
 * @returns {Array}
 */
export default function(treeList, parentKey = 'pid', key = 'id') {
  treeList = _.cloneDeep(treeList)
  const result = []
  c(treeList)
  function c(list, parent) {
    _.forEach(list, (item, index) => {
      result.push(_.assign(item))
      if (item.children) c(item.children, item)
    })
  }
  result.forEach(e => _.unset(e, 'children'))
  return result
}
