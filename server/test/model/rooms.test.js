const assert = require('assert')
const sinon = require('sinon')

const mysql = require('mysql')

const { config } = require('../../src/config.example')
const rooms = require('../../src/model/rooms')
const { roomStatus } = require('../../src/model/constants')

// Test cases
const conversionTestCases = [
  {
    status: roomStatus.WAITING,
    strStatus: 'waiting'
  }, {
    status: roomStatus.PREPARE,
    strStatus: 'prepare'
  }, {
    status: roomStatus.PLAYING,
    strStatus: 'playing'
  }
]
const marshalTestCases = [
  {
    dbRoom: {
      'id': 1337,
      'status': roomStatus.PREPARE,
      'user_count': 3,
      'ready_user_count': 3
    },
    objRoom: {
      id: 1337,
      status: 'prepare',
      userCount: 3,
      readyUserCount: 3
    }
  }, {
    dbRoom: {
      'id': 5,
      'status': roomStatus.WAITING,
      'user_count': 1,
      'ready_user_count': 4
    },
    objRoom: {
      id: 5,
      status: 'waiting',
      userCount: 1,
      readyUserCount: 4
    }
  }, {
    dbRoom: {
      'id': 65536,
      'status': roomStatus.PLAYING,
      'user_count': 2,
      'ready_user_count': 2
    },
    objRoom: {
      id: 65536,
      status: 'playing',
      userCount: 2,
      readyUserCount: 2
    }
  }
]

describe('model/rooms.js', () => {
  const con = mysql.createConnection(config.mysql)
  const mysqlMock = sinon.mock(con)
  window.con = con

  describe('roomStatusToString', () => {
    const { roomStatusToString } = rooms
    test('should convert room status to string correctly', () => {
      conversionTestCases.forEach((test, index) => {
        assert.deepStrictEqual(roomStatusToString(test.status), test.strStatus, `Test case #${index} has failed`)
      })
    })
    test('should throw error when given invalid room status', () => {
      const testCases = [{
        status: 1337
      }, {
        status: -1
      }]
      // Test
      testCases.forEach((test, index) => {
        assert.throws(() => roomStatusToString(test.status), `Test case #${index} has failed`)
      })
    })
  })

  describe('stringToRoomStatus', () => {
    const { stringToRoomStatus } = rooms
    test('should convert string to room status correctly', () => {
      conversionTestCases.forEach((test, index) => {
        assert.deepStrictEqual(stringToRoomStatus(test.strStatus), test.status, `Test case #${index} has failed`)
      })
    })
    test('should throw error when given invalid room status', () => {
      const testCases = [{
        strStatus: 'wait'
      }, {
        strStatus: 'loading'
      }]
      // Test
      testCases.forEach((test, index) => {
        assert.throws(() => stringToRoomStatus(test.strStatus), `Test case #${index} has failed`)
      })
    })
  })

  describe('marshal', () => {
    const { marshal } = rooms
    test('should marshal database objects correctly', () => {
      marshalTestCases.forEach((test, index) => {
        assert.deepStrictEqual(marshal(test.dbRoom), test.objRoom, `Test case #${index} has failed`)
      })
    })
  })

  describe('unmarshal', () => {
    const { unmarshal } = rooms
    test('should unmarshal database objects correctly', () => {
      marshalTestCases.forEach((test, index) => {
        assert.deepStrictEqual(unmarshal(test.objRoom), test.dbRoom, `Test case #${index} has failed`)
      })
    })
  })

  describe('create', () => {
    const { create } = rooms
    test('should be able to create a new room', async () => {
      // Mock
      mysqlMock
        .expects('query')
        .withArgs(
          'INSERT INTO `rooms` (`id`, `status`, `user_count`, `ready_user_count`) VALUES (NULL, 0, 1, 0)'
        )
        .callsArgWith(1, null, { affectedRows: 1, insertId: 1337 })
      mysqlMock
        .expects('query')
        .withArgs(
          'SELECT * FROM `rooms` WHERE `id` = ? LIMIT 1',
          [ 1337 ]
        )
        .callsArgWith(2, null, [
          {
            'id': 1337,
            'status': roomStatus.WAITING,
            'user_count': 1,
            'ready_user_count': 0
          }
        ])

      // Test
      const room = await create()
      assert.deepStrictEqual(room, {
        id: 1337,
        status: 'waiting',
        userCount: 1,
        readyUserCount: 0
      }, 'Unmatch marshaled room')
    })

    test('should throw "cannot create room" error when unable to create rooms', async () => {
      // Mock
      mysqlMock
        .expects('query')
        .withArgs(
          'INSERT INTO `rooms` (`id`, `status`, `user_count`, `ready_user_count`) VALUES (NULL, 0, 1, 0)'
        )
        .callsArgWith(1, null, { affectedRows: 0 })

      // Test
      await assert.rejects(async () => {
        await create()
      }, {
        name: 'Error',
        message: 'cannot create room'
      }, 'Should throw an error with cannot create room')
    })

    test('should throw custom errors when met', async () => {
      // Mock
      mysqlMock
        .expects('query')
        .withArgs(
          'INSERT INTO `rooms` (`id`, `status`, `user_count`, `ready_user_count`) VALUES (NULL, 0, 1, 0)'
        )
        .callsArgWith(1, new Error('it sucks to meet errors'), undefined)

      // Test
      await assert.rejects(async () => {
        await create()
      }, {
        name: 'Error',
        message: 'it sucks to meet errors'
      }, 'Should throw a custom error')
    })
  })
})
