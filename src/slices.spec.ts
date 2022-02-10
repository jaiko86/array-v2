import slices from './slices'
import createNumbered from './createNumbered'

describe('slices()', () => {
  it('returns the given values in given sizes', () => {
    const items = createNumbered(15)
    const sizes = createNumbered(5).map((n) => n + 1)
    const result = slices(items, sizes)
    // prettier-ignore
    expect(result).toEqual([
      [0],
      [1, 2],
      [3, 4, 5],
      [6, 7, 8, 9],
      [10, 11, 12, 13, 14]
    ])
  })
  it('when passed a number, it works like Array.prototype.slice()', () => {
    const items = createNumbered(10)
    const result = slices(items, 5)
    const expected = createNumbered(5)
    expect(result).toEqual(expected)
  })
})
