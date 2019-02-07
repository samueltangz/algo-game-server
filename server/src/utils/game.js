const { randBetween } = require('./random')

function shuffleCards (cards) {
  let cardIndices = [...Array(cards.length).keys()]
  for (let i = 0; i < cards.length; i++) {
    const j = randBetween(0, cards.length)
    let tmp = cardIndices[i]
    cardIndices[i] = cardIndices[j]
    cardIndices[j] = tmp
  }
  return cards.map((_, index) => cards[cardIndices[index]])
}

module.exports = {
  shuffleCards
}
