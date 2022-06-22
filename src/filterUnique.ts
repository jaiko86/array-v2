import { KeyValueObject, Primitive } from './types'
import { getNestedObjectValue } from './utils/misc.utils'

/**
 * The function returns an array of unique items based on some unique primitive value
 * associated with each item.
 *
 * @param array The array from which unique items will be filtered
 * @returns
 */
function filterUnique<T = Primitive>(array: T[]): T[]
/**
 * @param array The array from which unique items will be filtered
 * @param uniqueDeterminer  The array from which unique items will be filtered
 *  The array from which unique items will be filtered
 *  The array from which unique items will be filtered
 *  The array from which unique items will be filtered
 * @returns
 */
function filterUnique<T = Primitive>(array: T[], uniqueDeterminer): T[]
function filterUnique(
  array: (Primitive | KeyValueObject)[],
  uniqueDeterminer?:
    | string // key in an object
    | string[] // series of keys, or path, to a value in an object
    | ((item: KeyValueObject) => Primitive), // a function that returns a value to be considered for uniqueness
): (Primitive | KeyValueObject)[] {
  const uniqueItems: Set<Primitive> = new Set()
  let valueGetter: (item: Primitive | KeyValueObject) => Primitive
  switch (typeof uniqueDeterminer) {
    case 'undefined': // array consists of primitives
      valueGetter = (item: Primitive) => item
      break
    case 'object': // array of keys
      valueGetter = (item: KeyValueObject) => getNestedObjectValue(item, uniqueDeterminer)
      break
    case 'function':
      valueGetter = uniqueDeterminer
  }
  return array.filter((item) => {
    const uniqueValue = valueGetter(item)
    if (uniqueItems.has(uniqueValue)) {
      return false
    } else {
      uniqueItems.add(uniqueValue)
      return true
    }
  })
}

export default filterUnique
