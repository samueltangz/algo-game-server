const express = require('express')

const { getUserFromAuthnToken } = require('../utils/middlewares')
const { listTopTen } = require('./../model/users')

const api = express.Router()

api.get('/me', getUserFromAuthnToken,
  async (req, res) => {
    const me = res.locals.user
    return res.status(200).json({
      'user': me
    }).end()
  }
)

api.get('/top10',
  async (req, res) => {
    try {
      const users = await listTopTen()
      return res.status(200).json({
        'users': users.map(user => {
          return {
            id: user.id,
            name: user.name,
            rating: user.rating
          }
        })
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': 'unexpected error'
      }).end()
    }
  }
)

module.exports = api
