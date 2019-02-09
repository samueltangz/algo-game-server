/* global queue */

const _ = require('lodash')

const socket = require('../utils/socket')
const model = require('../model')
const { shuffleArray } = require('../utils/game')

function getCurrentUserId (game) {
  const users = []
  const userIndexKeyMap = ['user_1_id', 'user_2_id', 'user_3_id', 'user_4_id']
  for (let userIndex = 0; userIndex < game['user_count']; userIndex++) {
    users.push(game[userIndexKeyMap[userIndex]])
  }

  return users[game['current_turn'] - 1]
}

async function initializeGame (roomId) {
  await model.startTransaction()
  await model.updateRoomStatus(roomId, model.roomStatus.WAITING)
  const roomsUsers = await model.findRoomsUsersByRoomId(roomId)

  const userIds = roomsUsers.map(roomUser => roomUser['user_id'])
  const shuffledUserIds = shuffleArray(userIds)
  const paddedUserIds = _.cloneDeep(shuffledUserIds)
  while (paddedUserIds.length < 4) {
    paddedUserIds.push(undefined)
  }
  const userCount = userIds.length

  // Create the game
  const game = await model.createGame(userCount, paddedUserIds)
  const gameId = game['id']

  // Shuffle and create the cards in the model
  const cards = []
  for (let value = 0; value < 12; value++) {
    cards.push({ value, color: model.cardColor.BLACK })
    cards.push({ value, color: model.cardColor.WHITE })
  }
  const shuffledCards = shuffleArray(cards)

  const createCardPromises = []
  for (let index = 0; index < 24; index++) {
    createCardPromises.push(model.createCard(gameId, shuffledCards[index].color, shuffledCards[index].value, index))
  }
  await Promise.all(createCardPromises)

  // Distribute the cards
  const distributeCardPromises = []
  const maxCardCount = 5 - userCount
  for (let cardCount = 0, orderIndex = 0; cardCount < maxCardCount; cardCount++) {
    for (let userIndex = 0; userIndex < userCount; userIndex++, orderIndex++) {
      const userId = shuffledUserIds[userIndex]
      distributeCardPromises.push(model.drawCard(gameId, orderIndex, userId))
    }
  }
  distributeCardPromises.push(model.deltaGameCardDeckPointer(gameId, userCount * maxCardCount))
  await Promise.all(distributeCardPromises)

  await model.updateRoomStatus(roomId, model.roomStatus.PLAYING)

  await model.commit()
  // TODO: Announce cards

  socket.roomBroadcast(roomId, `The game is starting...`)
  // Start round
  queue.create('initiate_turn', { roomId, gameId }).save()
}

async function initiateTurn (roomId, gameId) {
  // if there are cards => draw and automatically pick that card
  // set attack counter = 0
  await model.startTransaction()

  const game = await model.findGameById(gameId)
  const currentUserId = getCurrentUserId(game)

  const order = game['card_deck_pointer']
  if (order < 24) {
    await Promise.all([
      model.drawCard(gameId, order, currentUserId, true),
      model.deltaGameCardDeckPointer(gameId, 1)
    ])
  } else {
    // no more cards to draw
  }

  socket.roomMessage(roomId, `Initiate turn ${JSON.stringify(game)}`)
  socket.gameMessage(currentUserId, `You drawed a card`)

  await model.updateGameTurnInitiated(gameId, true)
  await model.commit()
}

async function endTurn (roomId, gameId) {
  // update turn
  queue.create('initiate_turn', { roomId, gameId }).save()
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
async function keepAction (roomId, gameId, userId) {
  // if attack counter >= 1
  // end turn
  const game = await model.findGameById(gameId)
  const currentUserId = getCurrentUserId(game)
  if (currentUserId !== userId) throw new Error('not the user\'s turn')

  if (game['attack_count'] === 0) throw new Error('need attack at least once first')
  await endTurn(roomId, gameId)
}

async function endGame (roomId, gameId) {
  // compute winner
  // update score
  // update room status
  // update player rating
}

module.exports = {
  initializeGame,
  initiateTurn,
  endTurn,
  pickAction,
  attackAction,
  keepAction,
  endGame
}
