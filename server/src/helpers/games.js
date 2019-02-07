const socket = require('../utils/socket')
const model = require('../model')
const { shuffleCards } = require('../utils/game')

async function initializeGame (roomId) {
  socket.roomBroadcast(roomId, `Think again - you guys are not ready`)
  const roomsUsers = await model.findRoomsUsersByRoomId(roomId)

  roomsUsers.forEach(async roomUser => {
    const userId = roomUser['user_id']
    await model.updateReady(userId, roomId, false)
  })
  await model.deltaReadyUserCount(roomId, -roomsUsers.length)
  await model.updateRoomStatus(roomId, model.roomStatus.WAITING)

  const cards = []
  for (let i = 0; i < 12; i++) {
    cards.push({ value: i, color: 'black' })
    cards.push({ value: i, color: 'white' })
  }
  const shuffledCards = shuffleCards(cards)

  /**
   * decide player order
   *
   * shuffle cards
   * store into the database
   * announce cards to the users
   */
}

async function initiateTurn () {
  // if there are cards => draw and automatically pick that card
  // set attack counter = 0
}

// user picks a card to attack
async function pickAction () {
  // if the user did not draw a card at the beginning
  // can only pick self unrevealed cards
  // cannot be changed after the player has attacked
}

// user attacks
async function attackAction () {
  // if the user has picked a card
  // can only pick opponent's unrevealed cards
  // need to input a number 0-11 as well

  // success: attack counter += 1
  // fail: reveal and end turn
}

// user keeps
async function keepAction () {
  // if attack counter >= 1
  // end turn
}

module.exports = {
  initializeGame,
  initiateTurn
}
