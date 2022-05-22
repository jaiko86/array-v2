import { getRandomIntGenerator } from './utils/random.utils'

export default function shuffle<T>(array: T[]): typeof array {
  let currentIndex = array.length
  let randomIndex: number
  const randomIntGenerator = getRandomIntGenerator(array.length)
  while (currentIndex) {
    randomIndex = randomIntGenerator()
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
