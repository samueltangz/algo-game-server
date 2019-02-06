const assert = require('assert')

const utils = require('./../../src/utils/utils.js')

describe('utils/utils.js', () => {
  describe('intToBoolean', () => {
    const fn = utils.intToBoolean
    test('should return for valid inputs', () => {
      assert.strictEqual(fn(0), false)
      assert.strictEqual(fn(1), true)
    })
    test('should throw errors for invalid inputs', () => {
      assert.throws(() => { fn('0') }, 'Error: invalid input')
      assert.throws(() => { fn(true) }, 'Error: invalid input')
      assert.throws(() => { fn(2) }, 'Error: invalid input')
    })
  })
  describe('booleanToInt', () => {
    const fn = utils.booleanToInt
    test('should return for valid inputs', () => {
      assert.strictEqual(fn(false), 0)
      assert.strictEqual(fn(true), 1)
    })
    test('should throw errors for invalid inputs', () => {
      assert.throws(() => { fn('false') }, 'Error: invalid input')
      assert.throws(() => { fn(0) }, 'Error: invalid input')
    })
  })
})
