import { getRandomIntGenerator } from './utils/random.utils'

export const getRandomItem = <T>(array: T[]): T => {
  const randomIntGenerator = getRandomIntGenerator(array.length)
  return array[randomIntGenerator()]
}
