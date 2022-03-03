# Arraze

Have you ever done a common array operation such as shuffle, and wondered, "why isn't this built
in?". With Arraze, it's still not built in, but at least you don't have to re-implement it.

I am hoping for this library to become the go-to library for your array needs.

> The Github repo's name is `array-v2`, because I wanted to use that name. Unfortunately, a
> similarly named library already exists and npm won't let me use that name, so it's been renamed to
> Arraze.

## Functions

As of this writing, this library only has four functions, and they'll grow as I discover more common
array operations, or as I get more requests.

### Create Numbered

The `createNumbered()` method will return an array filled with numbers according to its index.

#### Usage

```javascript
createNumbered(5) // returns [0, 1, 2, 3, 4]
createNumbered(0) // returns []
```

### Shuffle

`shuffle()` uses Fisher-Yates (aka Knuth) Shuffle to shuffle an array **in place**. So if you don't
want your original array shuffled, pass a copy.

#### Usage

```javascript
// Pass an array into the function
const arr = createNumbered(3) // [0, 1, 2]
const shuffledArr = shuffle(arr) // could be any of [0, 1, 2], [0, 2, 1], ... , [2, 1, 0]

// Flip a coin
const isHeads = shuffle(['head', 'tail']).shift() === 'head'

// Draw a winning lotto number; pick 6 random numbers from 1 through 49
const chickenDinner = shuffle(createNumbered(49))
  .slice(0, 6)
  .map((n) => n + 1))
```

### Protrude

This function, `protrude()` can be thought of as an opposite to `Array.prototype.flat()`. Given an
array, it returns a nested set of arrays according to the second argument.

This can be used to easily create matrices, among others things.

#### Usage

```javascript
const length12 = createNumbered(12)
const matrix4x3 = protrude(length12)
/*
  matrix4x3 is
  [
    [0,  1,  2],
    [3,  4,  5],
    [6,  7,  8],
    [9, 10, 11]
  ]
*/

const length60 = createNumbered(60) // [0, 1, ... , 59]
const level4Matrix = protrude(length60, [5, 3, 2, 2]) // think 2x2 matrices in 5x3 matrix
/* 
  level4Matrix is 
  [//  -------- COL 0 -------- | --------- COL 1 --------- | --------- COL 2 ---------
    [[ [  0,  1], [  2,  3] ],   [ [  4,  5], [  6,  7] ],   [ [  8,  9], [  10,  11] ]], // ROW 0
    [[ [ 12, 13], [ 14, 15] ],   [ [ 16, 17], [ 18, 19] ],   [ [ 20, 21], [  22,  23] ]], // ROW 1
    [[ [ 24, 25], [ 26, 27] ],   [ [ 28, 29], [ 30, 31] ],   [ [ 32, 33], [  34,  35] ]], // ROW 2
    [[ [ 36, 37], [ 38, 39] ],   [ [ 40, 41], [ 42, 43] ],   [ [ 44, 45], [  46,  47] ]], // ROW 3
    [[ [ 48, 49], [ 50, 51] ],   [ [ 52, 53], [ 54, 55] ],   [ [ 56, 57], [  58,  59] ]], // ROW 4
  ]

  In a simpler view, it's like the following, where each value is another 2x2 matrix
  [
    mtx0,  mtx1,  mtx2,
    mtx3,  mtx4,  mtx5,
    mtx6,  mtx7,  mtx8,
    mtx9,  mtx10, mtx11,
    mtx12, mtx13, mtx14,
  ]
*/
```

### Slices

Do more than one `Array.prototype.slice()` with `slices()`. Given an array and sizes you want them
to be cut into, it'll return an array of arrays of the items.

#### Usage

```javascript
const length15 = createNumbered(15) // [0, 1, ... , 14]
const sizes = createNumbered(5).map((n) => n + 1) // [1, 2, 3, 4, 5]
const sliced = slices(length15, sizes)
/*
slices is equal to 
[
  [ 0],                 // length is sizes[0], 1 
  [ 1,  2],             // length is sizes[1], 2
  [ 3,  4,  5],         // length is sizes[2], 3
  [ 6,  7,  8,  9],     // length is sizes[3], 4
  [10, 11, 12, 13, 14]  // length is sizes[4], 5
]
*/

// another example
const length15 = createNumbered(15) // [0, 1, ... , 14]
const sizes = createNumbered(5)
  .map((n) => n + 1)
  .reverse() // [5, 4, 3, 2, 1]
const sliced = slices(length15, sizes)
/*
slices is equal to 
[
  [ 0,  1,  2,  3,  4], // length is sizes[0], 5
  [ 5,  6,  7,  8],     // length is sizes[1], 4
  [ 9, 10, 11],         // length is sizes[2], 3
  [12, 13],             // length is sizes[3], 2
  [14]                  // length is sizes[4], 1
]
*/
```

### Sort

There comes a time when you need to perform some complex sorting operation. `sort()` provides a
succinct yet comprehensive set of APIs to sort any arrays, ranging from simple primitives to
objects.

#### Basic usage

TODO: Make the tests more comprehensive:

- sorting primitives, both ascending and descending
- consider edge cases, like empty array or something
- figure out what would happen if the value at the end of the path is an array or something.
