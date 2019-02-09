/* global con */

const {
  cardColor, cardColorToString, createCard, drawCard
} = require('./cards')
const {
  createGame, findGameById, deltaGameCardDeckPointer, updateGameTurnInitiated
} = require('./games')
const {
  findRoomsByUserId, findRoomsUsersByRoomId, findRoomsUsersByUserIdAndRoomId, joinRoom, leaveRoom, updateReady
} = require('./rooms_users')
const {
  roomStatus, roomStatusToString, createRoom, findRoomById, findRoomsByStatus, deltaUserCount, deltaReadyUserCount, updateRoomStatus, deleteRoom
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
  cardColor,
  cardColorToString,
  createCard,
  drawCard,

  // games
  createGame,
  findGameById,
  deltaGameCardDeckPointer,
  updateGameTurnInitiated,

  // rooms_users
  findRoomsByUserId,
  findRoomsUsersByRoomId,
  findRoomsUsersByUserIdAndRoomId,
  joinRoom,
  leaveRoom,
  updateReady,

  // rooms
  roomStatus,
  roomStatusToString,
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
