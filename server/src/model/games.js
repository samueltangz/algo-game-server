/**
 * LOBBY APIs
 * [V] create a new game
 * [V] list games
 * [V] join game
 * [V] leave game
 * [V] ready game
 * [V] unready game
 *
 * GAME APIs
 * [ ] deal a card
 * [ ] pick an action
 */

const gameStatus = {
  WAITING: 0,
  PLAYING: 1,
  FINISHED: 2
}

/**
 * .-.    .----. .----. .----..-.  .-.
 * | |   /  {}  \| {}  }| {}  }\ \/ / 
 * | `--.\      /| {}  }| {}  } }  {  
 * `----' `----' `----' `----'  `--' 
 */

 async function findOpenGamesByUserId (user_id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM games WHERE (player_1 = ? OR player_2 = ? OR player_3 = ? OR player_4 = ?) AND status != ?',
      [user_id, user_id, user_id, user_id, gameStatus.FINISHED],
      function (err, games, _) {
        if (err) return reject(err)
        resolve(games)
      }
    )
  })
}

async function findGameById (id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM games WHERE id = ? LIMIT 1', [ id ], function (err, games, _) {
      if (err) return reject(err)
      if (games.length !== 1) return reject(new Error('game not found'))
      resolve(games[0])
    })
  })
}

async function findGamesByStatus (status) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM games WHERE status = ?', [ status ], function (err, games, _) {
      if (err) return reject(err)
      resolve(games)
    })
  })
}

async function createGame (user_id) {
  const [ gamesPlayersIn, gamesWaiting ] = await Promise.all([
    findOpenGamesByUserId(user_id), findGamesByStatus(gameStatus.WAITING)
  ])
  if (gamesPlayersIn.length > 0) throw new Error(`user is already in game room #${gamesPlayersIn[0].id}`)
  if (gamesWaiting.length >= 10) throw new Error('too much waiting game rooms')
  return new Promise((resolve, reject) => {
    con.query(`INSERT INTO games (id, card_pile, status, player_1, player_2, player_3, player_4, player_ready_status)
      VALUES (NULL, '', ?, ?, NULL, NULL, NULL, 0)`, [ gameStatus.WAITING, user_id ], function (err, _) {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function joinGame (id, user_id) {
  const [ gamesPlayersIn, game ] = await Promise.all([
    findOpenGamesByUserId(user_id), findGameById(id)
  ])
  if (gamesPlayersIn.length > 0) throw new Error(`user is already in game room #${gamesPlayersIn[0].id}`)
  
  const slots = ['player_1', 'player_2', 'player_3', 'player_4']
  for (let i = 0; i < 4; i++) {
    if (game[slots[i]] === null) {
      return new Promise((resolve, reject) => {
        con.query(`UPDATE games SET ${slots[i]} = ?, player_ready_status = 0 WHERE id = ?`, [user_id, id], function (err, fields) {
          if (err) return reject(err)
          if (fields.affectedRows !== 1) return reject(new Error('unable to update'))
          resolve()
        })
      })
    }
  }
  throw new Error('the room is full')
}

async function leaveGame (user_id) {
  const gamesPlayersIn = await findOpenGamesByUserId(user_id)
  if (gamesPlayersIn.length === 0) throw new Error('user is not in a game room')
  const game = gamesPlayersIn[0]
  const id = game['id']

  const slots = ['player_1', 'player_2', 'player_3', 'player_4']
  for (let i = 0; i < 4; i++) {
    if (game[slots[i]] === user_id) {
      return new Promise((resolve, reject) => {
        con.query(`UPDATE games SET ${slots[i]} = null, player_ready_status = 0 WHERE id = ?`, [id], function (err, fields) {
          if (err) return reject(err)
          if (fields.affectedRows !== 1) return reject(new Error('unable to update'))
          resolve()
        })
      })
    }
  }
}

async function readyGame (user_id) {
  const gamesPlayersIn = await findOpenGamesByUserId(user_id)
  if (gamesPlayersIn.length === 0) throw new Error('user is not in a game room')
  const game = gamesPlayersIn[0]
  const id = game['id']

  const slots = ['player_1', 'player_2', 'player_3', 'player_4']
  for (let i = 0; i < 4; i++) {
    if (game[slots[i]] === user_id) {
      return new Promise((resolve, reject) => {
        con.query(`UPDATE games SET player_ready_status = player_ready_status | ${1<<i} WHERE id = ?`, [id], function (err, fields) {
          if (err) return reject(err)
          if (fields.affectedRows !== 1) return reject(new Error('unable to update'))
          resolve()
        })
      })
    }
  }
}

async function unreadyGame (user_id) {
  const gamesPlayersIn = await findOpenGamesByUserId(user_id)
  if (gamesPlayersIn.length === 0) throw new Error('user is not in a game room')
  const game = gamesPlayersIn[0]
  const id = game['id']

  const slots = ['player_1', 'player_2', 'player_3', 'player_4']
  for (let i = 0; i < 4; i++) {
    if (game[slots[i]] === user_id) {
      return new Promise((resolve, reject) => {
        con.query(`UPDATE games SET player_ready_status = player_ready_status & ${0xf ^ (1<<i)} WHERE id = ?`, [id], function (err, fields) {
          if (err) return reject(err)
          if (fields.affectedRows !== 1) return reject(new Error('unable to update'))
          resolve()
        })
      })
    }
  }
}

/**
 *  .---.   .--.  .-.   .-..----.     
 * /   __} / {} \ |  `.'  || {_       
 * \  {_ }/  /\  \| |\ /| || {__      
 *  `---' `-'  `-'`-' ` `-'`----'
 */


module.exports = {
  gameStatus,

  findOpenGamesByUserId,
  findGameById,
  findGamesByStatus,
  createGame,
  joinGame,
  leaveGame,
  readyGame,
  unreadyGame
}