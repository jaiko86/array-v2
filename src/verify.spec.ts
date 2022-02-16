import createNumbered from './createNumbered'
import { isIncreasing, isNonDecreasing, isLexicographicallySorted } from './verify'

// TODO: add tests for various lengths: 0, 1, 2, 3, 10, and various boundary conditions
describe('verify.ts', () => {
  describe('isIncreasing()', () => {
    describe('returns true if a given number array is strictly increasing', () => {
      test('array with 0 numbers', () => {
        const nums = createNumbered(0)
        expect(isIncreasing(nums))
      })
      test('array with 1 number', () => {
        const nums = createNumbered(1)
        expect(isIncreasing(nums))
      })
      test('array with 2 numbers', () => {
        const nums = createNumbered(2)
        expect(isIncreasing(nums))
      })
      test('array with 3 numbers', () => {
        const nums = createNumbered(2)
        expect(isIncreasing(nums))
      })
      test('array with 10 numbers', () => {
        const nums = createNumbered(10)
        expect(isIncreasing(nums))
      })
    })
    it('returns false if there are consecutive numbers', () => {
      expect(isIncreasing([0, 0])).toBe(false)
    })
    describe('returns false if number is decreasing even in one place', () => {
      test('array with 2 numbers', () => {
        expect(isIncreasing([1, 0]))
      })
      test('array with 3 numbers', () => {
        expect(isIncreasing([0, 1, 0]))
      })
      test('array with 10 numbers', () => {
        const nums = createNumbered(10)
        nums.push(7)
        expect(isIncreasing(nums))
      })
    })
  })
  describe('isNonDecreasing()', () => {
    describe('returns true if a given number array is not decreasing', () => {
      test('array with 0 numbers', () => {
        const nums = createNumbered(0)
        expect(isNonDecreasing(nums))
      })
      test('array with 1 number', () => {
        const nums = createNumbered(1)
        expect(isNonDecreasing(nums))
      })
      test('array with 2 numbers', () => {
        expect(isNonDecreasing([0, 0]))
      })
      test('array with 3 numbers', () => {
        expect(isNonDecreasing([0, 1, 1]))
      })
      test('array with 10 numbers', () => {
        const nums = createNumbered(10).map((n) => Math.floor(n / 2))
        expect(isNonDecreasing(nums))
      })
    })
    describe('returns false if number is decreasing even in one place', () => {
      test('array with 2 numbers', () => {
        expect(isNonDecreasing([1, 0]))
      })
      test('array with 3 numbers', () => {
        const nums = createNumbered(2)
        expect(isNonDecreasing([0, 1, 0]))
      })
      test('array with 10 numbers', () => {
        const nums = createNumbered(10)
        nums.push(7)
        expect(isNonDecreasing(nums))
      })
    })
  })
  describe('isLexicographicallySorted()', () => {
    it('returns true if the given strings are lexicographically sorted', () => {
      const abc = 'abcdefghijklmnopqrstuvwxyz'.split('')
      expect(isLexicographicallySorted(abc))
      const double = abc.map((letter) => [letter, letter]).flat(2)
      expect(isLexicographicallySorted(double))
    })
  })
})
