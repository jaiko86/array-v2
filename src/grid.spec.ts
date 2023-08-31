import { hasStraight } from './grid'

describe('grid', () => {
  describe('hasStraight', () => {
    it('returns false if the grid is empty', () => {
      const grid = []
      expect(hasStraight(grid)).toBe(false)
    })
    it('should return true if the grid has a horizontal straight', () => {
      const grid = [
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1],
      ]
      expect(hasStraight(grid, { count: 3 })).toBe(true)
      expect(hasStraight(grid, { count: 3, directions: ['horizontal'] })).toBe(true)
      expect(hasStraight(grid, { count: 5 })).toBe(true)
      expect(hasStraight(grid, { count: 6 })).toBe(false)

      const grid2 = [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
      ]
      expect(hasStraight(grid2, { count: 5 })).toBe(true)
    })
    it('should return true if the grid has a vertical straight', () => {
      const grid = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
      ]
      expect(hasStraight(grid)).toBe(true)
      expect(hasStraight(grid, { count: 5 })).toBe(false)

      // prettier-ignore
      const grid2 = [
        [0], 
        [0], 
        [0], 
        [0], 
        [0]
      ]
      expect(hasStraight(grid2, { count: 5 })).toBe(false)
      expect(
        hasStraight(
          grid2.map(() => [1]),
          { count: 5 },
        ),
      ).toBe(true)
    })
    it('should return true if the grid has a L2R diagonal straight', () => {
      const grid = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]
      expect(hasStraight(grid, { directions: ['L2RDiagonal'] })).toBe(true)

      grid.unshift([0, 0, 0])
      grid.unshift([0, 0, 0])
      expect(hasStraight(grid, { directions: ['L2RDiagonal'] })).toBe(true)

      const grid2 = [
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
      ]
      expect(hasStraight(grid2, { directions: ['L2RDiagonal'] })).toBe(true)

      grid2.push([0, 0, 0, 0, 1])
      expect(hasStraight(grid2, { directions: ['L2RDiagonal'] })).toBe(true)

      grid2.unshift([0, 0, 0, 0, 0])
      expect(hasStraight(grid2, { count: 3, directions: ['L2RDiagonal'] })).toBe(true)

      grid2[3][4] = 0
      grid2.push([0, 0, 0, 0, 0])
      expect(hasStraight(grid2, { count: 3, directions: ['L2RDiagonal'] })).toBe(false)
    })
    it('should return true if the grid has a R2L diagonal straight', () => {
      const grid = [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
      ]
      expect(hasStraight(grid, { directions: ['R2LDiagonal'] })).toBe(true)

      grid.unshift([0, 0, 0])
      grid.unshift([0, 0, 0])
      expect(hasStraight(grid, { directions: ['R2LDiagonal'] })).toBe(true)

      const grid2 = [
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
      ]
      expect(hasStraight(grid2, { directions: ['R2LDiagonal'] })).toBe(true)

      grid2.push([1, 0, 0, 0, 0])
      expect(hasStraight(grid2, { directions: ['R2LDiagonal'] })).toBe(true)

      grid2.unshift([0, 0, 0, 0, 0])
      expect(hasStraight(grid2, { count: 3, directions: ['R2LDiagonal'] })).toBe(true)

      grid2[3][0] = 0
      grid2.push([0, 0, 0, 0, 0])
      expect(hasStraight(grid2, { count: 3, directions: ['R2LDiagonal'] })).toBe(false)
    })
    it('should return false if the grid does not have a straight', () => {
      const grid = [
        [1, 0, 1, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 0],
      ]
      expect(hasStraight(grid)).toBe(false)
    })
  })
})
