/* global con */
const { booleanToInt } = require('../utils/utils')

async function findRoomUserByUserId (userId) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms_users WHERE user_id = ?', [ userId ], function (err, roomsUsers, _) {
      if (err) return reject(err)
      if (roomsUsers.length !== 1) return reject(new Error('user is not in a room'))
      resolve(roomsUsers[0])
    })
  })
}

async function findRoomsUsersByRoomId (roomId) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms_users WHERE room_id = ?', [ roomId ], function (err, roomsUsers, _) {
      if (err) return reject(err)
      resolve(roomsUsers)
    })
  })
}

async function joinRoom (userId, roomId) {
  await new Promise((resolve, reject) => {
    con.query('INSERT INTO rooms_users (id, room_id, user_id, is_ready) VALUES (NULL, ?, ?, 0)', [ roomId, userId ], function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot join room'))
      resolve()
    })
  })
}

async function leaveRoom (userId) {
  await new Promise((resolve, reject) => {
    con.query('DELETE FROM rooms_users WHERE user_id = ? LIMIT 1', [ userId ], function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot leave room'))
      resolve()
    })
  })
}

async function updateReady (userId, isReady) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE rooms_users SET is_ready = ? WHERE user_id = ? LIMIT 1', [ booleanToInt(isReady), userId ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update ready status'))
      resolve()
    })
  })
}

module.exports = {
  findRoomUserByUserId,
  findRoomsUsersByRoomId,

  joinRoom,
  leaveRoom,
  updateReady
}
