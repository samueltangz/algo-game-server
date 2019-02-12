/* global con */

async function findGameUserByUserId (userId) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM games_users WHERE user_id = ?', [ userId ], function (err, gamesUsers, _) {
      if (err) return reject(err)
      if (gamesUsers.length !== 1) return reject(new Error('user is not in a game'))
      resolve(gamesUsers[0])
    })
  })
}

async function findGamesUsersByGameId (gameId) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM games_users WHERE game_id = ?', [ gameId ], function (err, gamesUsers, _) {
      if (err) return reject(err)
      resolve(gamesUsers)
    })
  })
}

async function joinGame (userId, gameId) {
  await new Promise((resolve, reject) => {
    con.query('INSERT INTO games_users (id, game_id, user_id) VALUES (NULL, ?, ?)', [ gameId, userId ], function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot join game'))
      resolve()
    })
  })
}

async function leaveGame (userId) {
  await new Promise((resolve, reject) => {
    con.query('DELETE FROM games_users WHERE user_id = ? LIMIT 1', [ userId ], function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot leave game'))
      resolve()
    })
  })
}

module.exports = {
  findGameUserByUserId,
  findGamesUsersByGameId,

  joinGame,
  leaveGame
}
