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

function getUserScores (game) {
  const userScores = []
  const userScoreKeyMap = ['user_1_score', 'user_2_score', 'user_3_score', 'user_4_score']
  for (let userIndex = 0; userIndex < game['user_count']; userIndex++) {
    userScores.push(game[userScoreKeyMap[userIndex]])
  }
  return userScores
}

function getCurrentUserId (game) {
  return getUserList(game)[game['current_turn'] - 1]
}

function getCurrentBoardState (game, cardList) {
  const userList = getUserList(game)
  const userScores = getUserScores(game)
  const hands = userList.map(userId =>
    sortCards(
      cardList.filter(card => card['user_id'] === userId)
    ).map(marshalCard)
  )

  return {
    id: game['id'],
    players: userList,
    scores: userScores,
    hands: hands,
    metadata: {
      currentTurn: game['current_turn'],
      attackCount: game['attack_count'],
      deckSize: Math.max(0, 24 - game['card_deck_pointer'])
    }
  }
}

function maskBoardState (userId, boardState) {
  const maskedBoardState = _.cloneDeep(boardState)
  maskedBoardState.players.forEach((boardUserId, index) => {
    if (boardUserId === userId) {
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

async function sendBoardState (gameId) {
  const game = await model.findGameById(gameId)
  const userList = getUserList(game)
  const cardList = await model.listCardsByGameId(gameId)
  const boardState = getCurrentBoardState(game, cardList)
  userList.forEach(userId => {
    socket.gameBoardState(userId, maskBoardState(userId, boardState))
  })
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
  if (order < 24) await model.drawCard(gameId, order, currentUserId, true)
  await model.deltaGameCardDeckPointer(gameId, 1)

  socket.gameBroadcast(currentUserId, 'You drawed a card')

  await model.updateGameTurnInitiated(gameId, true)

  console.log(game['attack_count'])
  console.log(-game['attack_count'])
  if (game['attack_count'] > 0) await model.deltaGameAttackCount(gameId, -game['attack_count'])

  await sendBoardState(gameId)
  await model.commit()
}

async function endTurn (roomId, gameId) {
  // update turn
  await Promise.all([
    model.updateGameCurrentTurn(gameId),
    model.updateGameTurnInitiated(gameId, false)
  ])
  queue.create('initiate_turn', { roomId, gameId }).save()
}

// user picks a card to attack
async function pickAction (roomId, gameId, userId, cardId) {
  // if the user did not draw a card at the beginning
  // can only pick self unrevealed cards
  // cannot be changed after the player has attacked
  await model.startTransaction()

  const game = await model.findGameById(gameId)
  const currentUserId = getCurrentUserId(game)
  const order = game['card_deck_pointer']
  if (currentUserId !== userId) throw new Error('not the user\'s turn')
  if (order <= 24) throw new Error('cannot pick another card')

  const cards = await model.listCardsByGameId(gameId)
  const selectedCard = cards.find(card => card['id'] === cardId)
  console.log(selectedCard)
  if (selectedCard === undefined || selectedCard['user_id'] !== userId || selectedCard['is_revealed']) {
    throw new Error('invalid card pick')
  }
  await model.unpickAllCardsByGameId(gameId)
  await model.pickCardById(cardId)

  await sendBoardState(gameId)
  await model.commit()
}

// user attacks
async function attackAction (roomId, gameId, userId, defendCardId, guessValue) {
  await model.startTransaction()

  if (guessValue < 0 || guessValue > 11) throw new Error('invalid guess value')
  const game = await model.findGameById(gameId)
  const userList = getUserList(game)
  const currentUserId = getCurrentUserId(game)
  if (currentUserId !== userId) throw new Error('not the user\'s turn')

  const cards = await model.listCardsByGameId(gameId)
  const attackCard = cards.find(card => card['is_picked'] && card['user_id'] === userId)
  if (attackCard === undefined) throw new Error('no attack cards picked')

  const defendCard = cards.find(card => card['id'] === defendCardId)
  if (defendCard === undefined) throw new Error('no defend cards picked')
  if (defendCard['value'] === guessValue) {
    const attackerUserOrder = userList.findIndex(iteratedUserId => iteratedUserId === userId)
    const defenderUserOrder = userList.findIndex(iteratedUserId => iteratedUserId === defendCard['user_id'])
    await model.revealCardById(defendCard['id'])
    await model.deltaGameAttackCount(gameId, 1)
    await Promise.all([
      model.deltaGameScoreById(gameId, attackerUserOrder + 1, guessValue === 6 ? +20 : +10),
      model.deltaGameScoreById(gameId, defenderUserOrder + 1, guessValue === 6 ? -20 : -10)
    ])
    socket.roomBroadcast(roomId, 'Correct guess!')
  } else {
    await model.revealCardById(attackCard['id'])
    await endTurn(roomId, gameId)
    socket.roomBroadcast(roomId, 'Wrong guess!')
  }

  await sendBoardState(gameId)
  await model.commit()
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
