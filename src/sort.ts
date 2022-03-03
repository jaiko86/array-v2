// smaller number comes first
const numberComparator = (a: number | bigint, b: number | bigint): number =>
  Number(BigInt(a) - BigInt(b))
const stringComparator = (a: string, b: string): number => a.localeCompare(b)
// true comes first
const booleanComparator = (a: boolean, b: boolean): number => Number(b) - Number(a)

export const getNestedObjectValue = (obj: KeyValueObject | Primitives, path: string[]) =>
  path.length ? getNestedObjectValue(obj[path.shift()], path) : obj

export const primitiveComparators: Comparator<Primitives> = (
  a: Primitives,
  b: Primitives,
): number => {
  if (typeof a === 'bigint' && typeof b === 'bigint') {
    return numberComparator(a, b)
  } else if (typeof a === 'number' && typeof b === 'number') {
    return numberComparator(a, b)
  } else if (typeof a === 'string' && typeof b === 'string') {
    return stringComparator(a, b)
  } else if (typeof a === 'boolean' && typeof b === 'boolean') {
    return booleanComparator(a, b)
  } else if (typeof a === 'symbol' && typeof b === 'symbol') {
    return stringComparator(a.toString(), b.toString())
  }
  return 0
}

export const getPrimitiveComparators =
  (dir: Direction) =>
  (a: Primitives, b: Primitives): number =>
    (dir === 'asc' ? 1 : -1) * primitiveComparators(a, b)

type Comparator<T> = (a: T, b: T) => number

type Primitives = number | boolean | string | bigint | symbol

type Direction = 'asc' | 'desc'

type KeyValueObject = {
  [key: string]: Primitives | KeyValueObject
}

type ObjectSortingStrategyByShape = KeyValueObject | ComparatorWrapper | DirectionWrapper

type ComparatorWrapper = {
  priority: number
  comparator: Comparator<KeyValueObject | Primitives>
}

type DirectionWrapper = {
  priority: number
  direction: Direction
}

type GenericObjectSortingStrategy = {
  path: string[]
  direction: Direction
}

type ObjectSortingStrategy = {
  path: string[]
  comparator: Comparator<KeyValueObject | Primitives>
}

const isType = (arg: any, type: string) => typeof arg === type
const isString = (arg: any) => isType(arg, 'string')
const isNumber = (arg: any) => isType(arg, 'number')
const isFunction = (arg: any) => isType(arg, 'function')
const isObject = (arg: any) => isType(arg, 'object')
const isPrimitive = (arg: any) =>
  ['number', 'boolean', 'string', 'bigint', 'symbol'].some((type) => isType(arg, type))
const isStringArray = (arg: any) => Array.isArray(arg) && arg.every(isString)
export const isDirectionWrapper = (arg: any) =>
  isObject(arg) && isNumber(arg.priority) && ['asc', 'desc'].includes(arg.direction)
export const isComparatorWrapper = (arg: any) =>
  isObject(arg) && isNumber(arg.priority) && isFunction(arg.comparator)

export const getPathsAndComparators = (
  obj: ObjectSortingStrategyByShape,
): ObjectSortingStrategy[] => {
  const internalHelper = (obj: ObjectSortingStrategyByShape, path: string[]) => {
    if (isDirectionWrapper(obj)) {
      const { direction, priority } = <DirectionWrapper>obj
      strategies[priority] = {
        path: [...path],
        comparator: getPrimitiveComparators(direction),
      }
    } else if (isComparatorWrapper(obj)) {
      const { priority, comparator } = <ComparatorWrapper>obj
      strategies[priority] = {
        path: [...path],
        comparator,
      }
    } else {
      Object.entries(obj).forEach(([key, val]) => internalHelper(val, [...path, key]))
    }
  }

  const strategies: ObjectSortingStrategy[] = []
  internalHelper(obj, [])

  return strategies.filter(Boolean)
}
export const isGenericObjectSortingStrategy = (arg: any) =>
  isObject('object') && isStringArray(arg.path) && ['asc', 'desc'].includes(arg.direction)
export const isObjectSortingStrategyByShape = (arg: any) =>
  isObject('object') && [
    (arg?.path?.every?.(isString) &&
      (isFunction(arg?.comparator) || ['asc', 'desc'].includes(arg.direction))) ||
      Object.values(arg).some(isObjectSortingStrategyByShape),
  ]

export const isObjectSortingStrategy = (arg: any) =>
  isObject('object') && arg?.path?.every?.(isString) && isFunction(arg?.comparator)

export function __normalizeSortingStrategy(arg1: any, arg2?: any): ObjectSortingStrategy[] {
  if (!arg1 && !arg2) {
    return [{ path: [], comparator: primitiveComparators }]
  } else if (['asc', 'desc'].includes(arg1) && arg2 === undefined) {
    return [{ path: [], comparator: primitiveComparators }]
  } else if (Array.isArray(arg1)) {
    if (arg1.every(isString)) {
      // arg1 is an array of keys
      return arg1.map((key) => ({
        path: [key],
        comparator: primitiveComparators,
      }))
    } else if (arg1.every((elem) => Array.isArray(elem) && elem.every(isString))) {
      return arg1.map((path) => ({
        path,
        comparator: primitiveComparators,
      }))
    } else if (arg1.every((elem) => typeof elem === 'object')) {
      if (arg1.every(isGenericObjectSortingStrategy)) {
        return arg1.map(({ path, direction }) => ({
          path,
          comparator: getPrimitiveComparators(direction),
        }))
      } else if (arg1.every(isObjectSortingStrategy)) {
        return arg1
      }
    }
  } else if (isObjectSortingStrategyByShape(arg1)) {
    return getPathsAndComparators(arg1)
  }
  return [{ path: [''], comparator: (a, b) => ([a, b].sort()[0] === a ? -1 : 1) }]
}
function sort<T = Primitives>(array: T[], direction?: Direction): T[]
function sort<T = KeyValueObject>(array: T[], key: string, direction?: Direction): T[]
function sort<T = KeyValueObject>(array: T[], keys: string[]): T[]
function sort<T = KeyValueObject>(array: T[], paths: string[][]): T[]
function sort<T = KeyValueObject>(array: T[], strategies: GenericObjectSortingStrategy[]): T[]
function sort<T = KeyValueObject>(array: T[], strategies: ObjectSortingStrategyByShape): T[]
function sort<T = KeyValueObject>(array: T[], strategies: ObjectSortingStrategy[]): T[]
// assumes the items are homogeneous (i.e. same type/shape)
function sort<T>(
  items: T[],
  sortBy:
    | Direction
    | string
    | string[]
    | string[][]
    | ObjectSortingStrategyByShape
    | GenericObjectSortingStrategy[]
    | ObjectSortingStrategy[],
  direction?: Direction,
): T[] {
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
  const normalizedSortingStrategy = __normalizeSortingStrategy(sortBy, direction)

  return items.sort(getComparator(normalizedSortingStrategy))
}

export default sort
