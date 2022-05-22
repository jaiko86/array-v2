import shuffle from '../shuffle'
import slices from '../slices'
import {
  getPrimitiveComparator,
  primitiveComparator,
  getPathsAndComparators,
  isObjectSortingStrategyByShape,
} from './sort.utils'

describe('sort.utils.ts', () => {
  describe('primitiveComparator()', () => {
    it('returns smaller number first', () => {
      const arr = [3, 1, 2]
      arr.sort(primitiveComparator)
      expect(arr).toEqual([1, 2, 3])
    })
    it('returns smaller BigInt first', () => {
      const arr2 = [3n, 1n, 2n]
      arr2.sort(primitiveComparator)
      expect(arr2).toEqual([1n, 2n, 3n])
    })
    it('returns lexicographically', () => {
      const arr = ['c', 'a', 'b', 'bb']
      arr.sort(primitiveComparator)
      expect(arr).toEqual(['a', 'b', 'bb', 'c'])
    })
    it('returns `true` before `false`', () => {
      const arr = shuffle([...Array(5).fill(true), ...Array(5).fill(false)])
      arr.sort(primitiveComparator)
      const [trues, falses] = slices(arr, [5, 5])
      expect(trues.every((e) => e === true))
      expect(falses.every((e) => e === false))
    })
    it('compares symbols by their string value', () => {
      const arr = shuffle([
        Symbol('a'),
        Symbol('aa'),
        Symbol('aaa'),
        Symbol('b'),
        Symbol('bb'),
        Symbol('bbb'),
        Symbol('c'),
        Symbol('cc'),
        Symbol('ccc'),
      ])
      arr.sort(primitiveComparator)
      expect(arr.map((s) => s.toString())).toEqual([
        'Symbol(a)',
        'Symbol(aa)',
        'Symbol(aaa)',
        'Symbol(b)',
        'Symbol(bb)',
        'Symbol(bbb)',
        'Symbol(c)',
        'Symbol(cc)',
        'Symbol(ccc)',
      ])
    })
  })

  describe('getPrimitiveComparator', () => {
    it('gets a comparator that sorts string lexicographically ascending (a->z)', () => {
      const comparator = getPrimitiveComparator('asc')
      const arr = shuffle(['a', 'b', 'c', 'd', 'e'])
    })
  })

  describe('getPathsAndComparators()', () => {
    it('returns a path and comparator for a given shape with priorities and comparator', () => {
      const sortingShape = {
        a: {
          b1: {
            c: {
              priority: 10,
              comparator: () => 10,
            },
          },
          b2: {
            priority: 5,
            comparator: () => 5,
          },
          b3: {
            c: {
              d: {
                priority: 20,
                comparator: () => 20,
              },
            },
          },
        },
      }
      const sortingStrategy = getPathsAndComparators(sortingShape)
      expect(sortingStrategy.map((s) => ({ path: s.path }))).toEqual([
        {
          path: ['a', 'b2'],
        },
        {
          path: ['a', 'b1', 'c'],
        },
        {
          path: ['a', 'b3', 'c', 'd'],
        },
      ])
      expect(sortingStrategy.map((s) => s.comparator(1, 1))).toEqual([5, 10, 20])
    })
    it('returns a path and comparator for a given shape with priorities and directions', () => {
      const sortingShape = {
        a: {
          b1: {
            c: {
              priority: 10,
              direction: 'asc',
            },
          },
          b2: {
            priority: 5,
            direction: 'desc',
          },
          b3: {
            c: {
              d: {
                priority: 20,
                direction: 'asc',
              },
            },
          },
        },
      }
      const sortingStrategy = getPathsAndComparators(sortingShape)
      expect(sortingStrategy.map((s) => ({ path: s.path }))).toEqual([
        {
          path: ['a', 'b2'],
        },
        {
          path: ['a', 'b1', 'c'],
        },
        {
          path: ['a', 'b3', 'c', 'd'],
        },
      ])
      expect(sortingStrategy.map((s) => s.comparator(0, 1))).toEqual([
        1, // descending
        -1, // ascending
        -1, // ascending
      ])
    })
  })
  describe('isObjectSortingStrategyByShape()', () => {
    describe('valid shapes', () => {
      it('a single direction wrapper', () => {
        const shape = {
          a: {
            direction: 'asc',
            priority: 1,
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(true)
      })
      it('a single comparator wrapper', () => {
        const shape = {
          a: {
            comparator: () => {},
            priority: 1,
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(true)
      })
      it('a single nested direction wrapper', () => {
        const shape = {
          a: {
            b: {
              c: {
                direction: 'asc',
                priority: 1,
              },
            },
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(true)
      })
      it('a single nested comparator wrapper', () => {
        const shape = {
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
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(true)
      })
      it('multiple nested direction wrapper', () => {
        const shape = {
          a: {
            b: {
              c: {
                direction: 'asc',
                priority: 1,
              },
            },
            b2: {
              direction: 'asc',
              priority: 2,
            },
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(true)
      })
      it('multiple nested comparator wrapper', () => {
        const shape = {
          a: {
            b: {
              c: {
                comparator: () => {},
                priority: 1,
              },
            },
            b2: {
              comparator: () => {},
              priority: 2,
            },
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(true)
      })
    })
    describe('invalid shapes', () => {
      it('case #0: empty object', () => {
        const shape = {}
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(false)
      })
      test('case #1: invalid comparator, simple case', () => {
        const shape = {
          comparator: 'invalid',
          priority: 1,
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(false)
      })
      test('case #2: invalid comparator, nested case', () => {
        const shape = {
          a: {
            b: {
              c: {
                comparator: 'invalid',
                priority: 1,
              },
            },
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(false)
      })
      test('case #2: invalid direction', () => {
        const shape = {
          a: {
            b: {
              c: {
                direction: 'invalid',
                priority: 1,
              },
            },
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(false)
      })
      test('case #3: invalid priority', () => {
        const shape = {
          a: {
            b: {
              c: {
                direction: ['asc'],
                priority: 'invalid',
              },
            },
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(false)
      })
      test('case #4: comparators with same priority', () => {
        const shape = {
          a: {
            b: {
              c: {
                comparator: () => {},
                priority: 1,
              },
            },
            b2: {
              comparator: () => {},
              priority: 1,
            },
          },
        }
        const result = isObjectSortingStrategyByShape(shape)
        expect(result).toBe(false)
      })
    })
  })
})
