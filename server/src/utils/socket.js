/* global io */

function getSocketByUser (user) {
  const obj = io.sockets.sockets
  const key = Object.keys(obj).find(key => Object.keys(obj[key].rooms).includes(`user/${user}`))
  if (!key) throw new Error('user not connected')
  return obj[key]
}

// messaging and broadcasting
function roomBroadcast (roomId, message) {
  io.sockets.in(`room/${roomId}`).emit('room_broadcast', message)
}

function gameBroadcast (user, message) {
  io.sockets.in(`user/${user}`).emit('game_broadcast', message)
}

function roomMessage (roomId, message) {
  io.sockets.in(`room/${roomId}`).emit('room_message', message)
}

function gameMessage (user, message) {
  io.sockets.in(`user/${user}`).emit('game_message', message)
}

// joining and leaving rooms
async function joinRoom (user, roomId) {
  try {
    await new Promise(function (resolve, reject) {
      getSocketByUser(user).join(`room/${roomId}`, function () {
        resolve()
      })
    })
  } catch (err) {}
}

async function leaveRoom (user, roomId) {
  try {
    await new Promise(function (resolve, reject) {
      getSocketByUser(user).leave(`room/${roomId}`, function () {
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

  joinRoom,
  leaveRoom
}
