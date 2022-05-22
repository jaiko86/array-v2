import { getNestedObjectValue } from '../utils/misc.utils'

describe('getNestedObjectValue()', () => {
  it('returns the value at the end of a given path', () => {
    const value = getNestedObjectValue({ a: { b: { c: 'value' } } }, ['a', 'b', 'c'])
    expect(value).toBe('value')
  })
  it('returns the first argument if path is empty', () => {
    const value = getNestedObjectValue(12345, [])
    expect(value).toBe(12345)
  })
})
