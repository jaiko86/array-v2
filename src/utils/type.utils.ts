// Native JS types: doesn't include null
enum PrimitiveTypes {
  BIGINT = 'bigint',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  STRING = 'string',
  SYMBOL = 'symbol',
  UNDEFINED = 'undefined',
}

enum ObjectTypes {
  FUNCTION = 'function',
  OBJECT = 'object',
}

export const isType = (type: string) => (arg: any) => typeof arg === type
export const isBoolean = isType(PrimitiveTypes.BOOLEAN)
export const isString = isType(PrimitiveTypes.STRING)
export const isNumber = isType(PrimitiveTypes.NUMBER)
export const isSymbol = isType(PrimitiveTypes.SYMBOL)
export const isBigInt = isType(PrimitiveTypes.BIGINT)
export const isUndefined = isType(PrimitiveTypes.UNDEFINED)
export const isNull = (arg: any) => arg === null
export const isFunction = isType(ObjectTypes.FUNCTION)
// typeof null is 'object'
export const isObject = (arg: any) =>
  !isNull(arg) && !Array.isArray(arg) && isType(ObjectTypes.OBJECT)(arg)
// except undefined
export const isPrimitive = (arg: any) =>
  [isNumber, isBigInt, isBoolean, isString, isSymbol].some((isPrimitive) => isPrimitive(arg))
export const isStringArray = (arg: any) => Array.isArray(arg) && arg.every(isString)

// Arraze types
export const isDirectionWrapper = (arg: any) =>
  isObject(arg) && isNumber(arg.priority) && ['asc', 'desc'].includes(arg.direction)
export const isComparatorWrapper = (arg: any) =>
  isObject(arg) && isNumber(arg.priority) && isFunction(arg.comparator)
