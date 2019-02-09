/* global queue */

const _ = require('lodash')

const socket = require('../utils/socket')
const model = require('../model')
const { shuffleArray, sortCards } = require('../utils/game')
const { cardColor, marshalCard } = require('./cards')
const { roomStatus } = require('./rooms')

// private functions
function getUserList (game) {
  const users = []
  const userIndexKeyMap = ['user_1_id', 'user_2_id', 'user_3_id', 'user_4_id']
  for (let userIndex = 0; userIndex < game['user_count']; userIndex++) {
    users.push(game[userIndexKeyMap[userIndex]])
  }
  return users
}

function getCurrentUserId (game) {
  return getUserList(game)[game['current_turn'] - 1]
}

function getCurrentBoardState (game, cardList) {
  const userList = getUserList(game)
  const hands = userList.map(userId =>
    sortCards(
      cardList.filter(card => card['user_id'] === userId)
    ).map(marshalCard)
  )

  return {
    players: userList,
    hands: hands,
    metadata: {
      currentTurn: game['current_turn'],
      attackCount: game['attack_count'],
      deckSize: Math.max(0, 23 - game['card_deck_pointer'])
    }
  }
}

function maskBoardState (userId, boardState) {
  const maskedBoardState = _.cloneDeep(boardState)
  maskedBoardState.players.forEach((boardUserId, index) => {
    if (boardUserId === userId) {
      console.log(maskedBoardState.hands[index])
      maskedBoardState.hands[index] = maskedBoardState.hands[index].map(card => {
        return {
          id: card.id,
          color: card.color,
          value: card.value,
          isPicked: card.isPicked,
          isRevealed: card.isRevealed
        }
      })
    } else {
      maskedBoardState.hands[index] = maskedBoardState.hands[index].map(card => {
        if (card.isRevealed) {
          return {
            id: card.id,
            color: card.color,
            value: card.value,
            isPicked: card.isPicked,
            isRevealed: card.isRevealed
          }
        } else {
          return {
            id: card.id,
            color: card.color,
            isPicked: card.isPicked,
            isRevealed: card.isRevealed
          }
        }
      })
    }
  })
  return maskedBoardState
}

// public functions
async function initializeGame (roomId) {
  await model.startTransaction()
  await model.updateRoomStatus(roomId, roomStatus.WAITING)
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
    cards.push({ value, color: cardColor.BLACK })
    cards.push({ value, color: cardColor.WHITE })
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

  await model.updateRoomStatus(roomId, roomStatus.PLAYING)

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
  const userList = getUserList(game)

  const order = game['card_deck_pointer']
  if (order < 24) {
    await Promise.all([
      model.drawCard(gameId, order, currentUserId, true),
      model.deltaGameCardDeckPointer(gameId, 1)
    ])
  } else {
    // no more cards to draw
  }

  socket.gameBroadcast(currentUserId, 'You drawed a card')

  await model.updateGameTurnInitiated(gameId, true)

  const cardList = await model.listCardsByGameId(gameId)
  const boardState = getCurrentBoardState(game, cardList)
  userList.forEach(userId => {
    socket.gameBoardState(userId, maskBoardState(userId, boardState))
  })

  await model.commit()
}

async function endTurn (roomId, gameId) {
  // update turn
  queue.create('initiate_turn', { roomId, gameId }).save()
}

// user picks a card to attack
async function pickAction (roomId, gameId, userId, cardId) {
  // if the user did not draw a card at the beginning
  // can only pick self unrevealed cards
  // cannot be changed after the player has attacked
  const game = await model.findGameById(gameId)
  const currentUserId = getCurrentUserId(game)
  const order = game['card_deck_pointer']
  if (currentUserId !== userId) throw new Error('not the user\'s turn')
  if (order < 24) throw new Error('cannot pick another card')

  if (Math.random() < 0.5) throw new Error('no cards picked')
}

// user attacks
async function attackAction (roomId, gameId, userId, attackCardId, attackValue) {
  // if the user has picked a card
  // can only pick opponent's unrevealed cards
  // need to input a number 0-11 as well
  const game = await model.findGameById(gameId)
  const currentUserId = getCurrentUserId(game)
  if (currentUserId !== userId) throw new Error('not the user\'s turn')

  if (Math.random() < 0.5) throw new Error('no cards picked')

  if (Math.random() < 0.5) {
    // [success]
    // reveal opponent card
    // score transfer
  } else {
    // [fail]
    // reveal card
    await endTurn(roomId, gameId)
  }
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
