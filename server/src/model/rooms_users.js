/* global con */
const { findRoomById } = require('./rooms')
const { booleanToInt } = require('../utils/utils')

async function findRoomsByUserId (userId) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT rooms.* FROM rooms LEFT JOIN rooms_users
      ON rooms.id = rooms_users.room_id
      WHERE rooms_users.user_id = ?`, [ userId ],
    function (err, rooms, _) {
      if (err) return reject(err)
      resolve(rooms)
    })
  })
}

async function findRoomsUsersByUserIdAndRoomId (userId, roomId) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms_users WHERE user_id = ? AND room_id = ?', [ userId, roomId ], function (err, roomsUsers, _) {
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
  return findRoomById(roomId)
}

async function leaveRoom (userId, roomId) {
  await new Promise((resolve, reject) => {
    con.query('DELETE FROM rooms_users WHERE room_id = ? AND user_id = ? LIMIT 1', [ roomId, userId ], function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot leave room'))
      resolve()
    })
  })
  return findRoomById(roomId)
}

async function updateReady (userId, roomId, isReady) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE rooms_users SET is_ready = ? WHERE room_id = ? AND user_id = ? LIMIT 1', [ booleanToInt(isReady), roomId, userId ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update ready status'))
      resolve()
    })
  })
  return findRoomById(roomId)
}

module.exports = {
  findRoomsByUserId,
  findRoomsUsersByUserIdAndRoomId,

  joinRoom,
  leaveRoom,
  updateReady
}
