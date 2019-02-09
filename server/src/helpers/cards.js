const { intToBoolean } = require('../utils/utils')

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

function marshalCard (dbCard) {
  return {
    id: dbCard['id'],
    userId: dbCard['user_id'],
    color: cardColorToString(dbCard['color']),
    value: dbCard['value'],
    isPicked: intToBoolean(dbCard['is_picked']),
    isRevealed: intToBoolean(dbCard['is_revealed'])
  }
}

module.exports = {
  cardColor,
  cardColorToString,
  marshalCard
}
