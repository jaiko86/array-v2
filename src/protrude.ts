export type NestedArray<T> = Array<T | undefined | NestedArray<T>>

// basically opposite of Array.protoype.flat()
export function protrude<Type>(
  dimensions: number[] = [0],
  items: Array<Type> = [],
): NestedArray<Type> {
  const size = dimensions.shift()
  const arr = []
  while (arr.length < size) {
    arr.push(dimensions.length ? protrude([...dimensions], items) : items.shift() ?? null)
  }
  return arr
}
