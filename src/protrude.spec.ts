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

    test.each`
      description             | itemCount | dimensions            | expected
      ${'Simple case'}        | ${3}      | ${[3]}                | ${[0, 1, 2]}
      ${'Simple nested case'} | ${6}      | ${[2, 3]}             | ${[[0, 1, 2], [3, 4, 5]]}
      ${'5 levels deep'}      | ${24}     | ${[1, 2, 2, 2, 3, 1]} | ${result3}
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
