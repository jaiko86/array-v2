import sort, { primitiveComparators, getNestedObjectValue } from './sort'
import createNumbered from './createNumbered'
import shuffle from './shuffle'
import slices from './slices'
import { isIncreasing, isLexicographicallySorted } from './verify'

const randomString = () => {
  const chars = createNumbered(122).map((n) => String.fromCharCode(n + 1))
  const randomChars = shuffle(chars).slice(0, 10)

  return randomChars.join('')
}

describe('sort()', () => {
  describe('auxiliary functions', () => {
    describe('primitiveComparators()', () => {
      it('returns smaller one first when sorting BigInt or number', () => {
        const arr = [3, 1, 2]
        arr.sort(primitiveComparators)
        expect(arr).toEqual([1, 2, 3])

        const arr2 = [3n, 1n, 2n]
        arr2.sort(primitiveComparators)
        expect(arr2).toEqual([1n, 2n, 3n])
      })
      it('returns lexicographically', () => {
        const arr = ['c', 'a', 'b', 'bb']
        arr.sort(primitiveComparators)
        expect(arr).toEqual(['a', 'b', 'bb', 'c'])
      })
    })
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
  })
  describe('sorts array of numbers', () => {
    test('Simple number array', () => {
      const sorted = createNumbered(10)
      const shuffled = shuffle([...sorted])
      expect(shuffled).not.toEqual(sorted)
      const result = sort(shuffled)
      expect(result).toEqual(sorted)
    })
    test('Large number array', () => {
      const sorted = createNumbered(100000)
      const shuffled = shuffle([...sorted])
      expect(shuffled).not.toEqual(sorted)
      const result = sort(shuffled)
      expect(result).toEqual(sorted)
    })
  })
  describe('sorts array of strings', () => {
    test('Simple string array', () => {
      const randomStrings = createNumbered(10).map(randomString)
      const result = sort(randomStrings)
      const isSorted = result.map((str, i, arr) =>
        i ? str.localeCompare(arr[i - 1]) === -1 : true,
      )
      expect(isSorted)
    })
    test('Large string array', () => {
      const randomStrings = createNumbered(1000).map(randomString)
      const result = sort(randomStrings)
      expect(isLexicographicallySorted(result))
    })
  })
  describe('sorts array of booleans', () => {
    test('Simple boolean array', () => {
      const bools = createNumbered(100).map((n) => !!(n % 2))
      const shuffled = shuffle(bools)
      const sorted = sort(shuffled)
      const [trues, falses] = slices(sorted, [50, 50])
      expect(trues.every(Boolean))
      expect(falses.every((b) => !Boolean(b)))
    })
  })
  describe('sorts array of objects', () => {
    test('Simple objects with duplicate names', () => {
      const profiles = [
        { id: 0, name: 'Adam', age: 20 },
        { id: 1, name: 'Adam', age: 21 },
        { id: 2, name: 'Bonnie', age: 27 },
        { id: 3, name: 'Bonnie', age: 29 },
        { id: 4, name: 'Charlie', age: 38 },
        { id: 5, name: 'Charlie', age: 40 },
      ]
      const shuffled = shuffle<typeof profiles[0]>(profiles)
      const sorted = sort(shuffled, ['name', 'age'])
      expect(isIncreasing(sorted.map((profile) => profile.id)))
      expect(isIncreasing(sorted.map((profile) => profile.age)))
      expect(isLexicographicallySorted(sorted.map((profile) => profile.name)))
    })

    test('Complex objects with duplicate fields', () => {
      const profiles = [
        { id: 0, name: { first: 'B', last: 'A' }, birthday: { year: 0, month: 0, date: 0 } },
        { id: 1, name: { first: 'B', last: 'A' }, birthday: { year: 1, month: 1, date: 0 } },
        { id: 2, name: { first: 'C', last: 'A' }, birthday: { year: 0, month: 2, date: 0 } },
        { id: 3, name: { first: 'C', last: 'A' }, birthday: { year: 1, month: 0, date: 0 } },
        { id: 4, name: { first: 'D', last: 'B' }, birthday: { year: 0, month: 1, date: 0 } },
        { id: 5, name: { first: 'D', last: 'B' }, birthday: { year: 1, month: 2, date: 0 } },
        { id: 6, name: { first: 'E', last: 'B' }, birthday: { year: 0, month: 0, date: 0 } },
        { id: 7, name: { first: 'E', last: 'B' }, birthday: { year: 1, month: 3, date: 0 } },
      ]
      const shuffled = shuffle<typeof profiles[0]>([...profiles])
      expect(shuffled.map(({ id }) => id)).not.toEqual(createNumbered(8))
      const sorted = sort(profiles, [
        ['name', 'last'],
        ['birthday', 'month'],
        ['birthday', 'year'],
      ])
      expect(sorted.map((profile) => profile.id)).toEqual([0, 3, 1, 2, 6, 4, 5, 7])
    })
  })
})
