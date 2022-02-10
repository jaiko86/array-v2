import { protrude } from './protrude'
import createNumbered from './createNumbered'

describe('protrude()', () => {
  describe('returns an array of items in nested array of specific dimension', () => {
    const result3 = [
      [
        [
          [
            [[0], [1], [2]],
            [[3], [4], [5]],
          ],
          [
            [[6], [7], [8]],
            [[9], [10], [11]],
          ],
        ],
        [
          [
            [[12], [13], [14]],
            [[15], [16], [17]],
          ],
          [
            [[18], [19], [20]],
            [[21], [22], [23]],
          ],
        ],
      ],
    ]
    // prettier-ignore
    const matrix= // this can be thought of as 2x2 matrices in a 5x3 matrix
    [// -------- COL 0 -------- | --------- COL 1 --------- | --------- COL 2 ---------
      [[ [  0,  1], [  2,  3] ],   [ [  4,  5], [  6,  7] ],   [ [  8,  9], [  10,  11] ]], // ROW 0
      [[ [ 12, 13], [ 14, 15] ],   [ [ 16, 17], [ 18, 19] ],   [ [ 20, 21], [  22,  23] ]], // ROW 1
      [[ [ 24, 25], [ 26, 27] ],   [ [ 28, 29], [ 30, 31] ],   [ [ 32, 33], [  34,  35] ]], // ROW 2
      [[ [ 36, 37], [ 38, 39] ],   [ [ 40, 41], [ 42, 43] ],   [ [ 44, 45], [  46,  47] ]], // ROW 3
      [[ [ 48, 49], [ 50, 51] ],   [ [ 52, 53], [ 54, 55] ],   [ [ 56, 57], [  58,  59] ]], // ROW 4
    ]

    test.each`
      description              | itemCount | dimensions            | expected
      ${'Simple case'}         | ${3}      | ${[3]}                | ${[0, 1, 2]}
      ${'Simple nested case'}  | ${6}      | ${[2, 3]}             | ${[[0, 1, 2], [3, 4, 5]]}
      ${'5 levels deep'}       | ${24}     | ${[1, 2, 2, 2, 3, 1]} | ${result3}
      ${'4 level deep matrix'} | ${60}     | ${[5, 3, 2, 2]}       | ${matrix}
    `('$description', (arg) => {
      const items = createNumbered(arg.itemCount)
      const result = protrude(arg.dimensions, items)
      expect(result).toEqual(arg.expected)
    })
  })
  describe('when the item count is less than the total space in the protruded array, `null` is filled', () => {
    const result = protrude([2, 3, 3], createNumbered(9))
    expect(result).toEqual([
      [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
      [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)],
    ])
  })
})
