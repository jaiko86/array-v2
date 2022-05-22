export type Comparator = (a: any, b: any) => number

export type Primitive = number | boolean | string | bigint | symbol

export type Direction = 'asc' | 'desc'

export type KeyValueObject<T = any> = {
  [key: string]: Primitive | KeyValueObject<T> | T
}

export type ObjectSortingStrategyByShape = KeyValueObject<ComparatorWrapper | DirectionWrapper>

export type ComparatorWrapper = {
  priority: number
  comparator: Comparator
}

export type DirectionWrapper = {
  priority: number
  direction: Direction
}

export type GenericObjectSortingStrategy = {
  path: string[]
  direction: Direction
}

export type ObjectSortingStrategy = {
  path: string[]
  comparator: Comparator
}

// When given an item in an array, returns a primitive value that can
// be fed into a comparator function
export type Evaluator = <T>(item: T) => Primitive
