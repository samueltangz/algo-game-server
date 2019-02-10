/* global con */
const { booleanToInt } = require('../utils/utils')

async function createCard (gameId, color, value, order) {
  await new Promise((resolve, reject) => {
    con.query('INSERT INTO cards (`id`, `game_id`, `user_id`, `color`, `value`, `order`, `is_picked`) VALUES (NULL, ?, NULL, ?, ?, ?, false)',
      [ gameId, color, value, order ],
      function (err, result) {
        if (err) return reject(err)
        if (result.affectedRows !== 1) return reject(new Error('cannot create card'))
        resolve()
      }
    )
  })
}

async function drawCard (gameId, order, userId, isPicked = false) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE `cards` SET `user_id` = ?, `is_picked` = ? WHERE `game_id` = ? AND `order` = ? LIMIT 1',
      [ userId, booleanToInt(isPicked), gameId, order ],
      function (err, result) {
        if (err) return reject(err)
        if (result.changedRows !== 1) return reject(new Error('cannot update card deck pointer'))
        resolve()
      }
    )
  })
}

async function listCardsByGameId (gameId) {
  const cards = await new Promise((resolve, reject) => {
    con.query('SELECT * FROM `cards` WHERE `game_id` = ?',
      [ gameId ],
      function (err, cards, _) {
        if (err) return reject(err)
        resolve(cards)
      }
    )
  })
  return cards
}

async function unpickAllCardsByGameId (gameId) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE `cards` SET `is_picked` = 0 WHERE `game_id` = ?', [ gameId ], function (err, _) {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function pickCardById (id) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE `cards` SET `is_picked` = 1 WHERE `id` = ?', [ id ], function (err, _) {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function revealCardById (id) {
  await new Promise((resolve, reject) => {
    con.query('UPDATE `cards` SET `is_revealed` = 1 WHERE `id` = ?', [ id ], function (err, _) {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = {
  createCard,
  drawCard,
  listCardsByGameId,
  unpickAllCardsByGameId,
  pickCardById,
  revealCardById
}
