import sort from './sort'
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
  describe('sorts primitives without argument', () => {
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
        const isSorted = isLexicographicallySorted(result)
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
    // TODO: decide whether to duplicate the work in sort.utils.spec.ts
  })
  describe('sorts array of objects', () => {
    // Re write the tests so it tests each call signature
    test('Simple objects with duplicate names', () => {
      const profiles = [
        { id: 0, name: 'Adam', age: 20 },
        { id: 1, name: 'Adam', age: 21 },
        { id: 2, name: 'Bonnie', age: 27 },
        { id: 3, name: 'Bonnie', age: 29 },
        { id: 4, name: 'Charlie', age: 38 },
        { id: 5, name: 'Charlie', age: 40 },
      ]
      const shuffled = shuffle(profiles)
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
      const shuffled = shuffle([...profiles])
      expect(shuffled.map(({ id }) => id)).not.toEqual(createNumbered(8))
      const sorted = sort(profiles, [
        ['name', 'last'],
        ['birthday', 'month'],
        ['birthday', 'year'],
      ])
      expect(sorted.map((profile) => profile.id)).toEqual([0, 3, 1, 2, 6, 4, 5, 7])
    })
  })
  // TODO: Test fails10,
  it('sort by providing shape to the value to be evaluated for comparison', () => {
    const objectA = {
      _name: 'A',
      a: {
        b: {
          c: {
            d: 1,
          },
        },
      },
    }
    const objectB = {
      _name: 'B',
      a: {
        b: {
          c: {
            d: 0,
          },
        },
      },
    }
    const objectC = {
      _name: 'C',
      a: {
        b: {
          c: {
            d: 2,
          },
        },
      },
    }
    const shapeComparator = {
      a: {
        b: {
          c: {
            d: {
              priority: 1,
              comparator: (a: number, b: number) => a - b,
            },
          },
        },
      },
    }
    const arr = [objectA, objectB, objectC]
    // @ts-ignore : TODO fix this shit
    const result = sort(arr, shapeComparator)
    expect(result.map((item) => item._name)).toEqual(['B', 'A', 'C'])
  })
})
