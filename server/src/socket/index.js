const { findUserByToken } = require('../model/users.js')
const { findOpenRoomsByUserId } = require('../model/rooms_users.js')

async function token (socket, token) {
  const user = await findUserByToken(token)
  const rooms = await findOpenRoomsByUserId(user.id)

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
}

module.exports = {
  token
}
