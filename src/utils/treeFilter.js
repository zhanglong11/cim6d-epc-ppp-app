import toTree from '@/utils/toTree'
import toFlat from '@/utils/toFlat'
import _ from 'lodash'

export default function (flatList, fn, parentKey = 'pid', key = 'id') {
  const treeData = toTree(flatList, parentKey, null, key)
  const flatData = toFlat(treeData, parentKey, key)
  const dict = _.keyBy(flatData, key)
  const allowItemList = flatData.filter(e => fn(e))
  const allowAncestors = _.chain(allowItemList)
    .map(e => e.ancestorIds)
    .flatten()
    .map(id => dict[id])
    .value()
  return toTree(_.union(_.compact(allowItemList.concat(allowAncestors))), parentKey, null, key)
}
