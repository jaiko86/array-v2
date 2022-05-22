import {
  Direction,
  Evaluator,
  GenericObjectSortingStrategy,
  KeyValueObject,
  ObjectSortingStrategy,
  ObjectSortingStrategyByShape,
  Primitive,
} from './types'
import { getNestedObjectValue } from './utils/misc.utils'
import { normalizeSortingStrategy } from './utils/sort.utils'

function sort<T = Primitive>(items: T[], direction?: Direction): typeof items
function sort<T = KeyValueObject>(items: T[], key: string, direction?: Direction): typeof items
function sort<T = KeyValueObject>(items: T[], keys: string[]): typeof items
/**
 *
 * @param items is a set of items to be sorted.
 * @param paths is an array of paths to a primitive value in an object. sort()
 * will use the first path to compare the object A and B. If the two objects cannot
 * be sorted using the first path, then it will use the second path, and so on.
 * See the spec for examples.
 */
function sort<T = KeyValueObject>(items: T[], paths: string[][]): typeof items
function sort<T = KeyValueObject>(
  items: T[],
  strategies: GenericObjectSortingStrategy[],
): typeof items
function sort<T = KeyValueObject>(
  items: T[],
  strategies: ObjectSortingStrategyByShape,
): typeof items
function sort<T = KeyValueObject>(items: T[], evaluator: Evaluator): typeof items
function sort<T = KeyValueObject>(items: T[], evaluators: Evaluator[]): typeof items

function sort<T = KeyValueObject>(items: T[], strategies: ObjectSortingStrategy[]): typeof items
// assumes the items are homogeneous (i.e. same type/shape)
function sort<T>(
  items: T[],
  strategy:
    | Direction
    | string
    | string[]
    | string[][]
    | ObjectSortingStrategyByShape
    | GenericObjectSortingStrategy[]
    | ObjectSortingStrategy[]
    | Evaluator
    | Evaluator[],
  direction?: Direction,
): typeof items {
  const getComparator =
    (normalizedSortingStrategy) =>
    (a: T, b: T): number => {
      let comparison = 0
      const strategyClone = [...normalizedSortingStrategy]
      while (!comparison && strategyClone.length) {
        const { path, comparator } = strategyClone.shift()
        const aVal = getNestedObjectValue(a as unknown as KeyValueObject, [...path])
        const bVal = getNestedObjectValue(b as unknown as KeyValueObject, [...path])
        comparison = comparator(aVal, bVal)
      }
      return comparison
    }
  const normalizedSortingStrategy = normalizeSortingStrategy(strategy, direction)

  return items.sort(getComparator(normalizedSortingStrategy))
}

export default sort
