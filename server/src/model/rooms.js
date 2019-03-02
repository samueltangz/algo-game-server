/* global con */
const { roomStatus } = require('./constants')

/**
 * Convert the room status constants to string.
 * @param {number} status The room status.
 * @returns {string} The string representation of the room status.
 */
function roomStatusToString (status) {
  switch (status) {
    case roomStatus.WAITING: return 'waiting'
    case roomStatus.PREPARE: return 'prepare'
    case roomStatus.PLAYING: return 'playing'
    default: throw new Error('undefined status')
  }
}

/**
 * Convert the string representation of room status into string.
 * @param {string} strStatus The string representation of the room status.
 * @returns {number} The room status.
 */
function stringToRoomStatus (strStatus) {
  switch (strStatus) {
    case 'waiting': return roomStatus.WAITING
    case 'prepare': return roomStatus.PREPARE
    case 'playing': return roomStatus.PLAYING
    default: throw new Error('undefined status')
  }
}

/**
 * Convert the room object for database to a JS object.
 * @param {object} dbRoom The room object for database.
 * @returns {object} The room object for JS.
 */
function marshal (dbRoom) {
  return {
    id: dbRoom['id'],
    status: roomStatusToString(dbRoom['status']),
    userCount: dbRoom['user_count'],
    readyUserCount: dbRoom['ready_user_count']
  }
}

/**
 * Convert the room object for JS to a database object.
 * @param {object} objRoom The room object for JS.
 * @returns {object} The room object for database.
 */
function unmarshal (objRoom) {
  return {
    'id': objRoom.id,
    'status': stringToRoomStatus(objRoom.status),
    'user_count': objRoom.userCount,
    'ready_user_count': objRoom.readyUserCount
  }
}

/**
 * Create a room and returns the room object.
 * @returns {object} The marshaled room object.
 */
async function create () {
  const id = await new Promise((resolve, reject) => {
    con.query('INSERT INTO `rooms` (`id`, `status`, `user_count`, `ready_user_count`) VALUES (NULL, 0, 1, 0)',
      function (err, result) {
        if (err) return reject(err)
        if (result.affectedRows !== 1) return reject(new Error('cannot create room'))
        resolve(result.insertId)
      }
    )
  })
  const room = await findById(id)
  return room
}

/**
 * List the rooms exist in the current state.
 * @returns {array[object]} An array of marshaled room objects.
 */
async function findAll () {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms', function (err, rooms, _) {
      if (err) return reject(err)
      resolve(rooms.map(marshal))
    })
  })
}

/**
 * Find a room with given room id.
 * @param {number} id The room id.
 * @returns {object} The marshaled room object.
 */
async function findById (id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM `rooms` WHERE `id` = ? LIMIT 1', [ id ], function (err, rooms, _) {
      if (err) return reject(err)
      if (rooms.length !== 1) return reject(new Error('cannot find room'))
      resolve(marshal(rooms[0]))
    })
  })
}

/**
 * Find all rooms with given status.
 * @param {number} status
 * @return {array[object]} An array of marshaled room objects.
 */
async function findAllByStatus (status) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms WHERE status = ?', [ status ], function (err, rooms, _) {
      if (err) return reject(err)
      resolve(rooms.map(marshal))
    })
  })
}

async function deltaUserCount (id, delta) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE rooms SET user_count = user_count + ? WHERE id = ? LIMIT 1', [ delta, id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update user count'))
      resolve()
    })
  })
  return findById(id)
}

async function deltaReadyUserCount (id, delta) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE rooms SET ready_user_count = ready_user_count + ? WHERE id = ? LIMIT 1', [ delta, id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update ready user count'))
      resolve()
    })
  })
  return findById(id)
}

async function updateRoomStatus (id, status) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE rooms SET status = ? WHERE id = ? LIMIT 1', [ status, id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update room status'))
      resolve()
    })
  })
  return findById(id)
}

async function deleteRoom (id) {
  return new Promise((resolve, reject) => {
    con.query('DELETE FROM rooms WHERE id = ? LIMIT 1', [ id ], function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot leave room'))
      resolve()
    })
  })
}

module.exports = {
  roomStatusToString,
  stringToRoomStatus,
  marshal,
  unmarshal,

  create,
  findAll,
  findById,
  findAllByStatus,
  deltaUserCount,
  deltaReadyUserCount,
  updateRoomStatus,
  deleteRoom
}
