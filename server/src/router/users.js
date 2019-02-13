const express = require('express')

const { getUserFromAuthnToken } = require('../utils/middlewares')
const model = require('./../model')

const api = express.Router()

api.get('/me', getUserFromAuthnToken,
  async (req, res) => {
    const me = res.locals.user
    let roomUser = {}
    let gameUser = {}
    try {
      roomUser = await model.findRoomUserByUserId(me['id'])
      gameUser = await model.findGameUserByUserId(me['id'])
    } catch (err) {}
    return res.status(200).json({
      'user': {
        id: me.id,
        name: me.name,
        rating: me.rating,
        roomId: roomUser['room_id'],
        gameId: gameUser['game_id']
      }
    }).end()
  }
)

api.get('/top10',
  async (req, res) => {
    try {
      const users = await model.listTopTen()
      return res.status(200).json({
        'users': users.map(user => {
          return { id: user.id, name: user.name, rating: user.rating }
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
