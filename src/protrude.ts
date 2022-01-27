export type NestedArray<T> = Array<T | undefined | NestedArray<T>>

// basically opposite of Array.protoype.flat()
export function protrude<Type>(items: Array<Type>, dimensions: number[]):NestedArray<Type> {
  function __protrude<Type>(items: Array<Type>, dimensions: number[]):NestedArray<Type> {
    if(!dimensions.length) {
      return [...items]
    }
    const outerArr: NestedArray<Type> = []
    const count = dimensions.shift() || 0
    const nestedArray = __protrude(items, dimensions)
    while(nestedArray.length) {
      const innerArr: NestedArray<Type> = []
      for(let i = 0; i < count; i++) {
        innerArr.push(nestedArray.shift())
      }
      outerArr.push(innerArr);
    }
    return outerArr
  }
  const total = dimensions.reduce((a, b) => a * b)
  if(total !== items.length) {
    throw new Error(`The array to be constructed with \`dimensions\` won't
      have the same number of items as \`items\`. ${items.length} items given, 
      but \`dimension\` totals to ${total}.`.replace(/\s+/g, ' '))
  }
  return __protrude(items, dimensions)
}