/* global con */

const roomStatus = {
  WAITING: 0,
  PREPARE: 1,
  PLAYING: 2
}

function roomStatusToString (status) {
  switch (status) {
    case roomStatus.WAITING: return 'waiting'
    case roomStatus.PREPARE: return 'prepare'
    case roomStatus.PLAYING: return 'playing'
    default: throw new Error('undefined status')
  }
}

async function createRoom () {
  const id = await new Promise((resolve, reject) => {
    con.query('INSERT INTO rooms (id, status, user_count, ready_user_count) VALUES (NULL, 0, 1, 0)', function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot create room'))
      resolve(result.insertId)
    })
  })
  return findRoomById(id)
}

async function findRoomById (id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms WHERE id = ? LIMIT 1', [ id ], function (err, rooms, _) {
      if (err) return reject(err)
      if (rooms.length !== 1) return reject(new Error('room not found'))
      resolve(rooms[0])
    })
  })
}

async function findRoomsByStatus (status) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms WHERE status = ?', [ status ], function (err, rooms, _) {
      if (err) return reject(err)
      resolve(rooms)
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
  return findRoomById(id)
}

async function deltaReadyUserCount (id, delta) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE rooms SET ready_user_count = ready_user_count + ? WHERE id = ? LIMIT 1', [ delta, id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update ready user count'))
      resolve()
    })
  })
  return findRoomById(id)
}

async function updateRoomStatus (id, status) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE rooms SET status = ? WHERE id = ? LIMIT 1', [ status, id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update room status'))
      resolve()
    })
  })
  return findRoomById(id)
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
  roomStatus,
  roomStatusToString,

  createRoom,
  findRoomById,
  findRoomsByStatus,
  deltaUserCount,
  deltaReadyUserCount,
  updateRoomStatus,
  deleteRoom
}
