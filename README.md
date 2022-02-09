# Array-v2

Have you ever done a common array operation such as shuffle, and wondered, "why isn't this built
in?".

With Array-v2, it's still not built in, but at least you don't have to re-implement it.

## Functions

As of this writing, this library only has two functions, and they'll grow as I discover more common
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
const zeroThruNine = Array.from(Array(15).keys())
const matrix3x5 = protrude(zeroThruNine, [5, 3])
/* 
  matrix3x3 is equal to 
  [
    [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
    ]
  ]
*/
```

The unnecessary outer most layer of array is a known issue.
