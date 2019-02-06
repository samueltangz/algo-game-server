const { findUserByToken } = require('../model/users.js')
const { findRoomsByUserId } = require('../model/rooms_users.js')

function socketAPIs (socket) {
  socket.on('token', function (tokenValue) {
    token(socket, tokenValue)
  })
}

async function token (socket, token) {
  try {
    const user = await findUserByToken(token)
    const rooms = await findRoomsByUserId(user.id)

    await new Promise(function (resolve, reject) {
      socket.join(`user/${user.name}`, function () {
        resolve()
      })
      socket.emit('game_message', `You have joined group "user/${user.name}"`)
    })
    if (rooms.length > 0) {
      const roomId = rooms[0]['id']
      await new Promise(function (resolve, reject) {
        socket.join(`room/${roomId}`, function () {
          resolve()
        })
        socket.emit('game_message', `You have joined group "room/${roomId}"`)
      })
    }
  } catch (err) {
    socket.disconnect()
  }
}

module.exports = {
  socketAPIs
}
