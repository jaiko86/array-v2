export default function shuffle<T>(array): Array<T> {
  let currentIndex = array.length
  let randomIndex: number
  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
