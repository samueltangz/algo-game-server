/* global con */
const { booleanToInt } = require('../utils/utils')

async function createGame (userCount, userIds) {
  const id = await new Promise((resolve, reject) => {
    let initialScores
    switch (userCount) {
      case 2:
        initialScores = [ 400, 400, 0, 0 ]
        break
      case 3:
        initialScores = [ 230, 230, 230, 0 ]
        break
      case 4:
        initialScores = [ 200, 200, 200, 200 ]
        break
    }
    con.query(
      `INSERT INTO games
        (
          id, user_count, user_1_id, user_2_id, user_3_id, user_4_id, user_1_score, user_2_score, user_3_score, user_4_score,
          current_turn, attack_count, card_deck_pointer, is_turn_initiated
        )
        VALUES
        (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 0)`,
      [ userCount, userIds[0], userIds[1], userIds[2], userIds[3], initialScores[0], initialScores[1], initialScores[2], initialScores[3] ],
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

async function deltaGameAttackCount (id, delta) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE games SET attack_count = attack_count + ? WHERE id = ? LIMIT 1', [ delta, id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update attack count'))
      resolve()
    })
  })
  return findGameById(id)
}

async function deltaGameScoreById (id, userOrder, delta) {
  const userScoreKeyMap = ['user_1_score', 'user_2_score', 'user_3_score', 'user_4_score']
  const userScoreKey = userScoreKeyMap[userOrder - 1]
  await new Promise((resolve, reject) => {
    con.query(`UPDATE games SET ${userScoreKey} = ${userScoreKey} + ? WHERE id = ? LIMIT 1`, [ delta, id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update score'))
      resolve()
    })
  })
  return findGameById(id)
}

async function updateGameCurrentTurn (id) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE games SET current_turn = MOD(current_turn, user_count) + 1 WHERE id = ? LIMIT 1', [ id ], function (err, result) {
      if (err) return reject(err)
      if (result.changedRows !== 1) return reject(new Error('cannot update current turn'))
      resolve()
    })
  })
}

module.exports = {
  createGame,
  findGameById,
  deltaGameCardDeckPointer,
  updateGameTurnInitiated,
  deltaGameAttackCount,
  deltaGameScoreById,
  updateGameCurrentTurn
}
