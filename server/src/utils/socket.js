/* global io */

function getSocketByUserId (userId) {
  const obj = io.sockets.sockets
  const key = Object.keys(obj).find(key => Object.keys(obj[key].rooms).includes(`user/${userId}`))
  if (!key) throw new Error('user not connected')
  return obj[key]
}

// messaging and broadcasting
function roomBroadcast (roomId, message) {
  io.sockets.in(`room/${roomId}`).emit('room_broadcast', message)
}

function gameBroadcast (userId, message) {
  io.sockets.in(`user/${userId}`).emit('game_broadcast', message)
}

function roomMessage (roomId, message) {
  io.sockets.in(`room/${roomId}`).emit('room_message', message)
}

function gameMessage (userId, message) {
  io.sockets.in(`user/${userId}`).emit('game_message', message)
}

function gameBoardState (userId, boardState) {
  io.sockets.in(`user/${userId}`).emit('game_board_state', boardState)
}

// joining and leaving rooms
async function joinRoom (userId, roomId) {
  try {
    await new Promise(function (resolve, reject) {
      getSocketByUserId(userId).join(`room/${roomId}`, function () {
        resolve()
      })
    })
  } catch (err) {}
}

async function leaveRoom (userId, roomId) {
  try {
    await new Promise(function (resolve, reject) {
      getSocketByUserId(userId).leave(`room/${roomId}`, function () {
        resolve()
      })
    })
  } catch (err) {}
}

module.exports = {
  roomBroadcast,
  gameBroadcast,
  roomMessage,
  gameMessage,
  gameBoardState,

  joinRoom,
  leaveRoom
}
