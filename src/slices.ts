const slices = <T>(items: T[], sizes: number | number[]) =>
  Array.isArray(sizes) ? sizes.map((s) => items.splice(0, s)) : slices(items, [sizes]).shift()

export default slices
