export const isIncreasing = (nums: number[]) => every(nums, (n1, n2) => n1 == null || n1 < n2, '[]')
export const isDecreasing = (nums: number[]) => isIncreasing(nums.reverse())
export const isNonIncreasing = (nums: number[]) =>
  every(nums, (n1, n2) => n1 == null || n1 >= n2, '[]')
export const isNonDecreasing = (nums: number[]) =>
  every(nums, (n1, n2) => n1 == null || n1 <= n2, '[]')

// Fancy way of saying "alphabetically", but including numbers and other chars
export const isLexicographicallySorted = (strs: string[]) =>
  every(strs, (s1, s2) => s1.localeCompare(s2) !== 1, '(]')

type BoundaryBrackets = '[]' | '[)' | '(]' | '()'
type BoundaryOptions = {
  includeFirst: boolean
  includeLast: boolean
}

const getBoundaryObj = (boundary: BoundaryBrackets): BoundaryOptions => ({
  includeFirst: boundary[0] === '[',
  includeLast: boundary[1] === ']',
})

const _consecutivesEvaluator =
  (type: 'every' | 'some') =>
  <T>(
    arr: T[],
    evaluator: (prev?: T, current?: T, next?: T) => boolean,
    boundary: BoundaryBrackets,
  ): boolean => {
    const { includeFirst, includeLast } = getBoundaryObj(boundary)
    const finalResult = arr[type]((elem, i, arr) => {
      const consecutiveElements = [arr[i - 1], elem, arr[i + 1]]
      let result: boolean = false
      if (i === 0) {
        if (includeFirst) {
          result = evaluator(...consecutiveElements)
        } else {
          return type === 'every'
        }
      } else if (i < arr.length - 1) {
        result = evaluator(...consecutiveElements)
      } else {
        if (includeLast) {
          result = evaluator(...consecutiveElements)
        } else {
          return type === 'every'
        }
      }
      return result
    })

    return finalResult
  }
export const every = _consecutivesEvaluator('every')
export const some = _consecutivesEvaluator('some')
// Denice
