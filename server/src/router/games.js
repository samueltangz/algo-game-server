const express = require('express')

const { getUserFromAuthnToken } = require('../utils/middlewares')
// const {} = require('../helpers/games')

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
    return res.status(200).json({
      'message': 'wip'
    })
  }
)

// pick a card
api.post('/action/pick', getUserFromAuthnToken,
  async (req, res) => {
    return res.status(200).json({
      'message': 'wip'
    })
  }
)

// keep
api.post('/action/keep', getUserFromAuthnToken,
  async (req, res) => {
    return res.status(200).json({
      'message': 'wip'
    })
  }
)

module.exports = api
