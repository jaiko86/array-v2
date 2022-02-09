import shuffle from './shuffle'
import createNumbered from './createNumbered'

describe('shuffle', () => {
  it('never returns the same array', () => {
    const SHUFFLED_ARRAY_COUNT = 10000
    const shuffledArrays = createNumbered(SHUFFLED_ARRAY_COUNT)
      .map(() => createNumbered(30))
      .map(shuffle)
      .map(String)
    const deduped = new Set(shuffledArrays)
    expect(deduped.size).toBe(SHUFFLED_ARRAY_COUNT)
  })
})
