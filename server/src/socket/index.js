const { findUserByToken } = require('../model/users.js')
const { findRoomUserByUserId } = require('../model/rooms_users.js')

function socketAPIs (socket) {
  console.log(`New socket (ID: ${socket.id}) connected`)
  socket.on('token', function (tokenValue) {
    token(socket, tokenValue)
  })
}

async function token (socket, token) {
  try {
    const user = await findUserByToken(token)

    await new Promise(function (resolve, reject) {
      socket.join(`user/${user.id}`, function () {
        resolve()
      })
      socket.emit('game_broadcast', `You have joined group "user/${user.id}"`)
    })
    try {
      const roomUser = await findRoomUserByUserId(user.id)
      const roomId = roomUser['room_id']
      await new Promise(function (resolve, reject) {
        socket.join(`room/${roomId}`, function () {
          resolve()
        })
        socket.emit('room_status', roomId)
        socket.emit('game_broadcast', `You have joined group "room/${roomId}"`)
      })
    } catch (err) {}
  } catch (err) {
    socket.disconnect()
  }
}

module.exports = {
  socketAPIs
}
