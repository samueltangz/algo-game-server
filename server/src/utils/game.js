const _ = require('lodash')

const { randBetween } = require('./random')

function shuffleArray (arr) {
  let arrayIndices = [...Array(arr.length).keys()]
  for (let i = 0; i < arr.length; i++) {
    const j = randBetween(0, arr.length)
    let tmp = arrayIndices[i]
    arrayIndices[i] = arrayIndices[j]
    arrayIndices[j] = tmp
  }
  return arr.map((_, index) => arr[arrayIndices[index]])
}

function sortCards (cards) {
  const sortedCards = _.cloneDeep(cards)
  return sortedCards.sort(function (cardOne, cardTwo) {
    const cardPoint = card => card.value * 2 + card.color
    return cardPoint(cardOne) - cardPoint(cardTwo)
  })
}

module.exports = {
  shuffleArray,
  sortCards
}
