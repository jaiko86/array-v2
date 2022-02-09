import createNumber from './createNumbered'

describe('createNumber()', () => {
  it('returns an array of given size, filled with numbers that are the same as their indices', () => {
    const arr = createNumber(5)
    expect(arr).toHaveLength(5)
    expect(arr).toEqual([0, 1, 2, 3, 4])
  })
  it('returns an empty array when 0 is passed', () => {
    const arr = createNumber(0)
    expect(arr).toHaveLength(0)
    expect(arr).toEqual([])
  })
})
