const express = require('express')

const { getUserFromAuthnToken } = require('../utils/middlewares')
const { pickAction, attackAction, keepAction } = require('../helpers/games')

const api = express.Router()

// return current game state
api.get('/', getUserFromAuthnToken,
  async (req, res) => {
    return res.status(200).json({
      'message': 'wip'
    })
  }
)

// attack
api.post('/action/attack', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const user = res.locals.user
      const cardId = req.body['card_id']
      const value = req.body['value']
      if (typeof cardId !== 'number') throw new Error('card_id should be a number')
      if (typeof value !== 'number') throw new Error('value should be a number')
      await attackAction(user['id'], cardId, value)
      return res.status(200).json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': err.message
      }).end()
    }
  }
)

// pick a card
api.post('/action/pick', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const user = res.locals.user
      const cardId = req.body['card_id']
      if (typeof cardId !== 'number') throw new Error('card_id should be a number')
      await pickAction(user['id'], cardId)
      return res.status(200).json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': err.message
      }).end()
    }
  }
)

// keep
api.post('/action/keep', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const user = res.locals.user
      await keepAction(user['id'])
      return res.status(200).json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': err.message
      }).end()
    }
  }
)

module.exports = api
