import toFlat from './toFlat'
/**
 * 列表对比
 * @param newList
 * @param oldList
 * @param key
 * @returns {{addTaskList: *, deleteIds: *, updateTaskList: *}}
 */
export default function(newList, oldList, key = 'id') {
  newList = toFlat(newList, 'parentTaskUniqueId', 'taskUniqueId').map(e =>
    _.omit(e, ['parent', 'ancestorIds', 'ancestorNames', 'children'])
  )
  oldList = toFlat(oldList, 'parentTaskUniqueId', 'taskUniqueId').map(e =>
    _.omit(e, ['parent', 'ancestorIds', 'ancestorNames', 'children'])
  )
  let intersection = _.intersectionBy(newList, oldList, key)
  let addTaskList = _.differenceBy(newList, oldList, key)
  let deleteIds = _.differenceBy(oldList, newList, key).map(e => e.id)
  let updateTaskList = intersection.filter(
    e => !_.isEqual(_.omit(_.find(newList, { id: e.id }), '_XID'), _.omit(_.find(oldList, { id: e.id }), '_XID'))
  )
  return {
    addTaskList,
    deleteIds,
    updateTaskList
  }
}
