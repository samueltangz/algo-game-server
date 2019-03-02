const assert = require('assert')

const constants = require('../../src/model/constants')

describe('model/constants.test.js', () => {
  describe('roomStatus', () => {
    const { roomStatus } = constants
    test('should have the given room statuses defined', () => {
      assert.notStrictEqual(roomStatus.PREPARE, undefined, 'there should be a prepare status')
      assert.notStrictEqual(roomStatus.WAITING, undefined, 'there should be a waiting status')
      assert.notStrictEqual(roomStatus.PLAYING, undefined, 'there should be a playing status')
    })
  })
})
