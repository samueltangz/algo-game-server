const socket = require('../utils/socket')

async function initializeGame (roomId) {
  socket.roomBroadcast(roomId, `Let the game begin in room #${roomId}`)
}

module.exports = {
  initializeGame
}
