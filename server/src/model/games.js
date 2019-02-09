/* global con */
const { booleanToInt } = require('../utils/utils')

async function createGame (userCount, userIds) {
  const id = await new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO games
        (id, user_count, user_1_id, user_2_id, user_3_id, user_4_id, current_turn, attack_count, card_deck_pointer, is_turn_initiated)
        VALUES
        (NULL, ?, ?, ?, ?, ?, 1, 0, 0, 0)`,
      [ userCount, userIds[0], userIds[1], userIds[2], userIds[3] ],
      function (err, result) {
        if (err) return reject(err)
        if (result.affectedRows !== 1) return reject(new Error('cannot create game'))
        resolve(result.insertId)
      }
    )
  })
  return findGameById(id)
}

async function findGameById (id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM games WHERE id = ? LIMIT 1', [ id ], function (err, games, _) {
      if (err) return reject(err)
      if (games.length !== 1) return reject(new Error('room not found'))
      resolve(games[0])
    })
  })
}

async function deltaGameCardDeckPointer (id, delta) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE games SET card_deck_pointer = card_deck_pointer + ? WHERE id = ? LIMIT 1', [ delta, id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update card deck pointer'))
      resolve()
    })
  })
  return findGameById(id)
}

async function updateGameTurnInitiated (id, isTurnInitiated) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE games SET is_turn_initiated = ? WHERE id = ? LIMIT 1', [ booleanToInt(isTurnInitiated), id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update card deck pointer'))
      resolve()
    })
  })
  return findGameById(id)
}

module.exports = {
  createGame,
  findGameById,
  deltaGameCardDeckPointer,
  updateGameTurnInitiated
}
