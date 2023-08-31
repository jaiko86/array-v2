export const toGrid = <T>(arr: T[], cols: number): T[][] => {
  const grid: T[][] = []
  let index = 0
  while (index < arr.length) {
    grid.push(arr.slice(index, index + cols))
    index += cols
  }
  return grid
}

export const transpose = <T>(grid: T[][]): T[][] => {
  const transposed: T[][] = Array(grid[0].length)
    .fill(true)
    .map(() => [])
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      transposed[j][i] = grid[i][j]
    }
  }

  return transposed
}

type Directions = 'horizontal' | 'vertical' | 'L2RDiagonal' | 'R2LDiagonal'

type StraightOptions<T> = {
  determiner: (item: T) => boolean
  count: number
  directions: Directions[]
}

const getOptions = <T>(grid, options?: Partial<StraightOptions<T>>): StraightOptions<T> => ({
  determiner: (item: T) => !!item,
  count: Math.min(grid.length, grid[0].length),
  directions: ['horizontal', 'vertical', 'L2RDiagonal', 'R2LDiagonal'],
  ...options,
})

export const hasStraight = <T>(grid: T[][], options?: Partial<StraightOptions<T>>) => {
  if (!grid.length || !grid[0].length) {
    return false
  }
  const { determiner, count, directions } = getOptions(grid, options)
  if (count < 1) {
    return false
  }

  const recursion = (row: number, col: number, direction: Directions, count: number): boolean => {
    if (count === 0) {
      return true
    }
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      return false
    }
    if (!determiner(grid[row]?.[col])) {
      return false
    }

    switch (direction) {
      case 'horizontal':
        return recursion(row, col + 1, direction, count - 1)
      case 'vertical':
        return recursion(row + 1, col, direction, count - 1)
      case 'L2RDiagonal':
        return recursion(row + 1, col + 1, direction, count - 1)
      case 'R2LDiagonal':
        return recursion(row + 1, col - 1, direction, count - 1)
    }
  }

  return directions.some((direction) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (recursion(row, col, direction, count)) {
          return true
        }
      }
    }
    return false
  })
}
