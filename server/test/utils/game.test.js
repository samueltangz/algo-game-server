const assert = require('assert')

const game = require('../../src/utils/game.js')
const { cardColor } = require('../../src/helpers/cards')

describe('utils/game.js', () => {
  describe('shuffleArray', () => {
    const fn = game.shuffleArray
    test('should shuffle properly', () => {
      let cards = []
      for (let i = 0; i < 12; i++) {
        cards.push({ value: i, color: cardColor.BLACK })
        cards.push({ value: i, color: cardColor.WHITE })
      }
      const shuffledCards = fn(cards)

      console.log(shuffledCards)
    })

    test('should conserve cards', () => {
      let cards = []
      for (let i = 0; i < 12; i++) {
        cards.push({ value: i, color: cardColor.BLACK })
        cards.push({ value: i, color: cardColor.WHITE })
      }
      const shuffledCards = fn(cards)

      // The new cards did not have the same card duplicated
      // TODO: make this a vigorous check
      let valueChecksum = 0
      let colorChecksum = 0
      shuffledCards.forEach(card => {
        valueChecksum += card.value
        colorChecksum += card.color === cardColor.BLACK ? 1 : -1
      })
      assert.strictEqual(valueChecksum, 132)
      assert.strictEqual(colorChecksum, 0)
    })

    test('should not have side effects', () => {
      let cards = []
      for (let i = 0; i < 12; i++) {
        cards.push({ value: i, color: cardColor.BLACK })
        cards.push({ value: i, color: cardColor.WHITE })
      }
      fn(cards)

      // The old cards are in their original order
      for (let i = 0; i < 12; i++) {
        assert.strictEqual(cards[2 * i    ].value, i)
        assert.strictEqual(cards[2 * i + 1].value, i)
        assert.strictEqual(cards[2 * i    ].color, cardColor.BLACK)
        assert.strictEqual(cards[2 * i + 1].color, cardColor.WHITE)
      }
    })
  })
  describe('sortCards', () => {
    const fn = game.sortCards
    test('should sort properly', () => {
      const tests = [{
        cards: [
          { value: 3, color: cardColor.BLACK },
          { value: 7, color: cardColor.BLACK },
          { value: 5, color: cardColor.BLACK },
          { value: 1, color: cardColor.BLACK }
        ],
        expected: [
          { value: 1, color: cardColor.BLACK },
          { value: 3, color: cardColor.BLACK },
          { value: 5, color: cardColor.BLACK },
          { value: 7, color: cardColor.BLACK }
        ]
      }, {
        cards: [
          { value: 1, color: cardColor.BLACK },
          { value: 0, color: cardColor.WHITE },
          { value: 1, color: cardColor.WHITE },
          { value: 0, color: cardColor.BLACK }
        ],
        expected: [
          { value: 0, color: cardColor.BLACK },
          { value: 0, color: cardColor.WHITE },
          { value: 1, color: cardColor.BLACK },
          { value: 1, color: cardColor.WHITE }
        ]
      }]
      tests.forEach(test => {
        const output = fn(test.cards)
        output.forEach((card, index) => {
          assert.strictEqual(card.color, test.expected[index].color)
          assert.strictEqual(card.value, test.expected[index].value)
        })
      })
    })
  })
})
