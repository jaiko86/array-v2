import shuffle from './shuffle'

describe('shuffle', () => {
  it('never returns the same array', () => {
    const SHUFFLED_ARRAY_COUNT = 10000
    const shuffledArrays = Array(SHUFFLED_ARRAY_COUNT)
      .fill(true)
      .map(() => Array.from(Array(30).keys()))
      .map(shuffle)
      .map(String)
    const deduped = new Set(shuffledArrays)
    expect(deduped.size).toBe(SHUFFLED_ARRAY_COUNT)
  })
})
