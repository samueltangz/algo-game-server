/* global con */

const {
  createCard, drawCard, listCardsByGameId, unpickAllCardsByGameId, pickCardById, revealCardById
} = require('./cards')
const {
  createGame, findGameById, deltaGameCardDeckPointer, updateGameTurnInitiated, deltaGameAttackCount, deltaGameScoreById, updateGameCurrentTurn
} = require('./games')
const {
  findGameUserByUserId, findGamesUsersByGameId, joinGame, leaveGame
} = require('./games_users')
const {
  createRoom, listRooms, findRoomById, findRoomsByStatus, deltaUserCount, deltaReadyUserCount, updateRoomStatus, deleteRoom
} = require('./rooms')
const {
  findRoomUserByUserId, findRoomsUsersByRoomId, joinRoom, leaveRoom, updateReady
} = require('./rooms_users')
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

  // games_users
  findGameUserByUserId,
  findGamesUsersByGameId,
  joinGame,
  leaveGame,

  // rooms
  createRoom,
  listRooms,
  findRoomById,
  findRoomsByStatus,
  deltaUserCount,
  deltaReadyUserCount,
  updateRoomStatus,
  deleteRoom,

  // rooms_users
  findRoomUserByUserId,
  findRoomsUsersByRoomId,
  joinRoom,
  leaveRoom,
  updateReady,

  // users
  findUserById,
  findUserByToken,
  listTopTen
}
