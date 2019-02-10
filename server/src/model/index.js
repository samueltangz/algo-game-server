/* global con */

const {
  createCard, drawCard, listCardsByGameId, unpickAllCardsByGameId, pickCardById, revealCardById
} = require('./cards')
const {
  createGame, findGameById, deltaGameCardDeckPointer, updateGameTurnInitiated, deltaGameAttackCount, deltaGameScoreById, updateGameCurrentTurn
} = require('./games')
const {
  findRoomsByUserId, findRoomsUsersByRoomId, findRoomsUsersByUserIdAndRoomId, joinRoom, leaveRoom, updateReady
} = require('./rooms_users')
const {
  createRoom, findRoomById, findRoomsByStatus, deltaUserCount, deltaReadyUserCount, updateRoomStatus, deleteRoom
} = require('./rooms')
const {
  findUserById, findUserByToken, listTopTen
} = require('./users')

async function startTransaction () {
  return new Promise((resolve, reject) => {
    con.query('START TRANSACTION', function (err, _) {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function commit () {
  return new Promise((resolve, reject) => {
    con.query('COMMIT', function (err, _) {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function rollback () {
  return new Promise((resolve, reject) => {
    con.query('ROLLBACK', function (err, _) {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = {
  startTransaction,
  commit,
  rollback,

  // cards
  createCard,
  drawCard,
  listCardsByGameId,
  unpickAllCardsByGameId,
  pickCardById,
  revealCardById,

  // games
  createGame,
  findGameById,
  deltaGameCardDeckPointer,
  updateGameTurnInitiated,
  deltaGameAttackCount,
  deltaGameScoreById,
  updateGameCurrentTurn,

  // rooms_users
  findRoomsByUserId,
  findRoomsUsersByRoomId,
  findRoomsUsersByUserIdAndRoomId,
  joinRoom,
  leaveRoom,
  updateReady,

  // rooms
  createRoom,
  findRoomById,
  findRoomsByStatus,
  deltaUserCount,
  deltaReadyUserCount,
  updateRoomStatus,
  deleteRoom,

  // users
  findUserById,
  findUserByToken,
  listTopTen
}
