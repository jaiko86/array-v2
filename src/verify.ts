export const isIncreasing = (nums: number[]) => every(nums, (n1, n2) => n1 > n2, '(]')

export const isNonDecreasing = (nums: number[]) => every(nums, (n1, n2) => n1 >= n2, '(]')

// Fancy way of saying "alphabetically", but including numbers and other chars
export const isLexicographicallySorted = (strs: string[]) =>
  every(strs, (s1, s2) => s1.localeCompare(s2) === -1, '(]')

type BoundaryBrackets = '[]' | '[)' | '(]' | '()'
type BoundaryOptions = { includeFirst: boolean; includeLast: boolean }

const getBoundaryObj = (boundary: BoundaryBrackets): BoundaryOptions => ({
  includeFirst: boundary[0] === '[',
  includeLast: boundary[1] === ']',
})

const _consecutivesEvaluator =
  (type: 'every' | 'some') =>
  <T>(
    arr: T[],
    evaluator: (prev?: T, current?: T, next?: T) => boolean,
    boundary: BoundaryOptions | BoundaryBrackets = { includeFirst: true, includeLast: true },
  ): boolean =>
    typeof boundary === 'string'
      ? _consecutivesEvaluator(type)(arr, evaluator, getBoundaryObj(boundary))
      : arr[type]((elem, i, arr) => {
          const { includeFirst, includeLast } = boundary
          const consecutiveElements = [arr[i - 1], elem, arr[i + 1]]
          if (!i) {
            return !includeFirst || evaluator(...consecutiveElements)
          } else if (i < arr.length - 1) {
            return evaluator(...consecutiveElements)
          } else {
            return !includeLast || evaluator(...consecutiveElements)
          }
        })

export const every = _consecutivesEvaluator('every')
export const some = _consecutivesEvaluator('some')
