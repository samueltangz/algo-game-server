const socket = require('../utils/socket')
const model = require('../model')

async function initializeGame (roomId) {
  socket.roomBroadcast(roomId, `Think again - you guys are not ready`)
  const roomsUsers = await model.findRoomsUsersByRoomId(roomId)

  roomsUsers.forEach(async roomUser => {
    const userId = roomUser['user_id']
    await model.updateReady(userId, roomId, false)
  })
  await model.deltaReadyUserCount(roomId, -roomsUsers.length)
  await model.updateRoomStatus(roomId, model.roomStatus.WAITING)
}

module.exports = {
  initializeGame
}
