const assert = require('assert')

const random = require('./../../src/utils/random.js')

describe('utils/random.js', () => {
  describe('randBetween', () => {
    const fn = random.randBetween
    test('should return different values', () => {
      let tally = (new Array(100)).fill(0)
      for (let i = 0; i < 100000; i++) {
        const v = fn(0, 100)
        tally[v] += 1
      }
      for (let i = 0; i < 100; i++) {
        assert.ok(tally[i] >= 800 && tally[i] <= 1200)
      }
    })
  })
})
