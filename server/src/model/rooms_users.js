/* global con */
const { roomStatus, findRoomById } = require('./rooms')

async function findOpenRoomsByUserId (userId) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT rooms.* FROM rooms LEFT JOIN rooms_users
      ON rooms.id = rooms_users.room_id
      WHERE rooms_users.user_id = ? AND rooms.status != ?`, [ userId, roomStatus.FINISHED ],
    function (err, rooms, _) {
      if (err) return reject(err)
      resolve(rooms)
    })
  })
}

async function joinRoom (userId, roomId) {
  const [ roomsJoined, room ] = await Promise.all([
    findOpenRoomsByUserId(userId), findRoomById(roomId)
  ])
  if (roomsJoined.length > 0) throw new Error('user has joined another room')
  if (room['status'] !== roomStatus.WAITING) throw new Error('room is not waiting')
  // TODO: check if the room is not full
  return new Promise((resolve, reject) => {
    con.query('INSERT INTO rooms_users (id, room_id, user_id, is_ready) VALUES (NULL, ?, ?, 0)', [ roomId, userId ], function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot join room'))
      resolve()
    })
  })
}

async function leaveRoom (userId) {
  const roomsJoined = await findOpenRoomsByUserId(userId)
  if (roomsJoined.length === 0) throw new Error('user is not in a room')
  const room = roomsJoined[0]
  const roomId = room['id']
  if (room['status'] !== roomStatus.WAITING) throw new Error('room is not waiting')
  return new Promise((resolve, reject) => {
    con.query('DELETE FROM rooms_users WHERE room_id = ? AND user_id = ? LIMIT 1', [ roomId, userId ], function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot leave room'))
      resolve()
    })
  })
}

async function updateReady (userId, isReady) {
  const roomsJoined = await findOpenRoomsByUserId(userId)
  if (roomsJoined.length === 0) throw new Error('user is not in a room')
  const room = roomsJoined[0]
  const roomId = room['id']
  if (room['status'] !== roomStatus.WAITING) throw new Error('room is not waiting')
  return new Promise((resolve, reject) => {
    con.query('UPDATE rooms_users SET is_ready = ? WHERE room_id = ? AND user_id = ? LIMIT 1', [ isReady, roomId, userId ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update ready status'))
      resolve()
    })
  })
}

module.exports = {
  findOpenRoomsByUserId,
  joinRoom,
  leaveRoom,
  updateReady
}
