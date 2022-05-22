export type Comparator<T> = (a: T, b: T) => number

export type Primitive = number | boolean | string | bigint | symbol

export type Direction = 'asc' | 'desc'

/* TODO: Maybe change to 
  export type KeyValueObject<T> = {
    [key: string]: Primitive | KeyValueObject<T> | T
  }
*/
export type KeyValueObject<T> = {
  [key: string]: Primitive | KeyValueObject<T> | T
}

// TODO: This needs to be fixed; it should really be something like
// KeyValueObject<ComparatorWrapper | DirectionWrapper>
export type ObjectSortingStrategyByShape = KeyValueObject<ComparatorWrapper | DirectionWrapper>

export type ComparatorWrapper = {
  priority: number
  comparator: Comparator<KeyValueObject<any> | Primitive>
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
  comparator: Comparator<KeyValueObject<any> | Primitive>
}

// When given an item in an array, returns a primitive value that can
// be fed into a comparator function
export type Evaluator = <T>(item: T) => Primitive
