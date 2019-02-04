const assert = require('assert')

const game = require('./../../src/utils/game.js')

describe('utils/game.js', () => {
  describe('shuffleCards', () => {
    const fn = game.shuffleCards
    test('should shuffle properly', () => {
      let cards = []
      for (let i = 0; i < 12; i++) {
        cards.push({ value: i, color: 'black' })
        cards.push({ value: i, color: 'white' })
      }
      shuffledCards = fn(cards)

      console.log(shuffledCards)
    })

    test('should conserve cards', () => {
      let cards = []
      for (let i = 0; i < 12; i++) {
        cards.push({ value: i, color: 'black' })
        cards.push({ value: i, color: 'white' })
      }
      shuffledCards = fn(cards)

      // The new cards did not have the same card duplicated
      // TODO: make this a vigorous check
      let valueChecksum = 0
      let colorChecksum = 0
      cards.forEach(card => {
        valueChecksum += card.value
        colorChecksum += card.color == 'black' ? 1 : -1
      })
      assert.equal(valueChecksum, 132)
      assert.equal(colorChecksum, 0)
    })
    
    test('should not have side effects', () => {
      let cards = []
      for (let i = 0; i < 12; i++) {
        cards.push({ value: i, color: 'black' })
        cards.push({ value: i, color: 'white' })
      }
      shuffledCards = fn(cards)

      // The old cards are in their original order
      for (let i = 0; i < 12; i++) {
        assert.equal(cards[2 * i    ].value, i)
        assert.equal(cards[2 * i + 1].value, i)
        assert.equal(cards[2 * i    ].color, 'black')
        assert.equal(cards[2 * i + 1].color, 'white')
      }
    })
  })
})