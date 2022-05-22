import { KeyValueObject, Primitive } from '../types'

export const getNestedObjectValue = (obj: KeyValueObject | Primitive, path: string[]) =>
  path.length ? getNestedObjectValue(obj[path.shift()], path) : obj
