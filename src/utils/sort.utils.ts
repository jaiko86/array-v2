import {
  ComparatorWrapper,
  Direction,
  DirectionWrapper,
  ObjectSortingStrategy,
  ObjectSortingStrategyByShape,
  Primitive,
  Comparator,
  KeyValueObject,
} from '../types'
import {
  isBigInt,
  isBoolean,
  isComparatorWrapper,
  isDirectionWrapper,
  isFunction,
  isNumber,
  isObject,
  isString,
  isStringArray,
  isSymbol,
  isUndefined,
} from '../utils/type.utils'

export const DIRECTIONS: Direction[] = ['asc', 'desc']

export const jsNativeComparator = (a: any, b: any) => ([a, b].sort()[0] === a ? -1 : 1)

export const primitiveComparator: Comparator = (a: Primitive, b: Primitive): number => {
  const numberComparator = (a: number | bigint, b: number | bigint): number =>
    Number(BigInt(a) - BigInt(b))
  const stringComparator = (a: string, b: string): number => a.localeCompare(b)
  const booleanComparator = (a: boolean, b: boolean): number => Number(b) - Number(a)
  const args = [a, b]

  if (args.every(isBigInt)) {
    return numberComparator(a as bigint, b as bigint)
  } else if (args.every(isNumber)) {
    return numberComparator(a as number, b as number)
  } else if (args.every(isString)) {
    return stringComparator(a as string, b as string)
  } else if (args.every(isBoolean)) {
    return booleanComparator(a as boolean, b as boolean)
  } else if (args.every(isSymbol)) {
    return stringComparator(a.toString(), b.toString())
  }

  throw new Error(`Invalid comparison: ${String(a)} and ${String(b)} cannot be compared.`)
}

// TODO: consider sorting numbers in ascending order, and everything else
// in descending order. i.e. numbers get bigger, but strings go a->z
export const getPrimitiveComparator =
  (dir: Direction) =>
  (a: Primitive, b: Primitive): number =>
    (dir === 'asc' ? 1 : -1) * primitiveComparator(a, b)

export const getPathsAndComparators = (
  obj: ObjectSortingStrategyByShape,
): ObjectSortingStrategy[] => {
  const internalHelper = (obj: ObjectSortingStrategyByShape, path: string[]) => {
    if (isDirectionWrapper(obj)) {
      const { direction, priority } = <DirectionWrapper>obj
      strategies[priority] = {
        path: [...path],
        comparator: getPrimitiveComparator(direction),
      }
    } else if (isComparatorWrapper(obj)) {
      // TODO: fix typing
      const { priority, comparator } = obj as unknown as ComparatorWrapper
      strategies[priority] = {
        path: [...path],
        comparator,
      }
    } else {
      Object.entries(obj).forEach(
        //@ts-ignore TODO: fix typing
        ([key, val]) => internalHelper(val, [...path, key]),
      )
    }
  }

  const strategies: ObjectSortingStrategy[] = []
  internalHelper(obj, [])

  return strategies.filter(Boolean)
}
export const isGenericObjectSortingStrategy = (arg: any) =>
  isObject(arg) && isStringArray(arg.path) && DIRECTIONS.includes(arg.direction)

/**
 * Sorting can be done by passing an object that has the shape of the paths
 * to props to be sorted. isObjectSortingStrategyByShape() checks if an object
 * is valid for such purpose. See spec for details.
 *
 * @param arg
 * @returns boolean
 */
export const isObjectSortingStrategyByShape = (arg: any) => {
  const inSet = <T>(arg: T, set: Set<T>): boolean => set.has(arg) || !set.add(arg)
  const isValidShape = (arg: any) =>
    isObject(arg) &&
    (isComparatorWrapper(arg) || isDirectionWrapper(arg) || Object.values(arg).some(isValidShape))
  const hasValidPriorities = (arg: any, prioritiesMarker = new Set<number>()) =>
    Object.entries(arg).every(([key, val]) =>
      key === 'priority'
        ? !inSet(val, prioritiesMarker)
        : !isObject(val) || hasValidPriorities(val, prioritiesMarker),
    )

  return isValidShape(arg) && hasValidPriorities(arg)
}

export const isObjectSortingStrategy = (arg: any) =>
  isObject(arg) && isString(arg?.path) && isFunction(arg?.comparator)

export function normalizeSortingStrategy(arg1: any, arg2?: any): ObjectSortingStrategy[] {
  if ([arg1, arg2].every(isUndefined)) {
    return [{ path: [], comparator: primitiveComparator }]
  } else if (DIRECTIONS.includes(arg1) && isUndefined(arg2)) {
    return [{ path: [], comparator: primitiveComparator }]
  } else if (Array.isArray(arg1)) {
    if (arg1.every(isString)) {
      // arg1 is an array of keys
      return arg1.map((key) => ({
        path: [key],
        comparator: primitiveComparator,
      }))
    } else if (arg1.every(isStringArray)) {
      return arg1.map((path) => ({
        path,
        comparator: primitiveComparator,
      }))
    } else if (arg1.every((elem) => typeof elem === 'object')) {
      if (arg1.every(isGenericObjectSortingStrategy)) {
        return arg1.map(({ path, direction }) => ({
          path,
          comparator: getPrimitiveComparator(direction),
        }))
      } else if (arg1.every(isObjectSortingStrategy)) {
        return arg1
      }
    }
  }
  if (isObjectSortingStrategyByShape(arg1)) {
    return getPathsAndComparators(arg1)
  }
  return [{ path: [''], comparator: (a, b) => ([a, b].sort()[0] === a ? -1 : 1) }]
}
