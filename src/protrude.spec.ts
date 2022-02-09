import { protrude } from './protrude'
import createNumbered from './createNumbered'

describe('array.util.ts', () => {
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
        description             | itemCount | dimensions         | expected
        ${'Simple case'}        | ${3}      | ${[3]}             | ${[[0, 1, 2]]}
        ${'Simple nested case'} | ${6}      | ${[2, 3]}          | ${[[[0, 1, 2], [3, 4, 5]]]}
        ${'5 levels deep'}      | ${24}     | ${[2, 2, 2, 3, 1]} | ${result3}
      `('$description', (arg) => {
        const items = createNumbered(arg.itemCount)
        const result = protrude(items, arg.dimensions)

        expect(result).toEqual(arg.expected)
      })
    })
  })
})
