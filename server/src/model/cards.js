/* global con */
const { booleanToInt } = require('../utils/utils')

const cardColor = {
  BLACK: 0,
  WHITE: 1
}

function cardColorToString (color) {
  switch (color) {
    case cardColor.BLACK: return 'black'
    case cardColor.WHITE: return 'white'
    default: throw new Error('undefined color')
  }
}

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

module.exports = {
  cardColor,
  cardColorToString,

  createCard,
  drawCard
}
