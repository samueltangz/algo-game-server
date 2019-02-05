const express = require('express')

const { getUserFromAuthnToken } = require('./../utils/middlewares')
const { gameStatus, findGamesByStatus, createGame, joinGame, leaveGame, readyGame, unreadyGame } = require('./../model/games')

const api = express.Router()

api.post('/', getUserFromAuthnToken,
  async (req, res) => {
    const me = res.locals.user
    try {
      const game = await createGame(me.id)
      return res.status(200).json(game).end()
    } catch (err) {
      const errMessage = err.message  
      if (errMessage.startsWith('user is already in game room')) {
        return res.status(403).json({
          'error': errMessage
        }).end()
      } else {
        return res.status(500).json({
          'error': errMessage
        }).end()
      }
    }
  }
)

api.put('/', getUserFromAuthnToken,
  async (req, res) => {
    const me = res.locals.user
    const action = req.body.action

    switch (action) {
      case 'leave':
        try {
          await leaveGame(me.id)
          return res.status(200).json({}).end()
        } catch (err) {
          const errMessage = err.message
          if (errMessage === 'user is not in a game room') {
            return res.status(404).json({
              'error': 'user is not in a game room'
            }).end()
          } else {
            return res.status(500).json({
              'error': errMessage
            }).end()
          }
        }
      case 'ready':
        try {
          await readyGame(me.id)
          return res.status(200).json({}).end()
        } catch (err) {
          const errMessage = err.message
          if (errMessage === 'user is not in a game room') {
            return res.status(404).json({
              'error': 'user is not in a game room'
            }).end()
          } else {
            return res.status(500).json({
              'error': errMessage
            }).end()
          }
        }
      case 'unready':
        try {
          await unreadyGame(me.id)
          return res.status(200).json({}).end()
        } catch (err) {
          const errMessage = err.message
          if (errMessage === 'user is not in a game room') {
            return res.status(404).json({
              'error': 'user is not in a game room'
            }).end()
          } else {
            return res.status(500).json({
              'error': errMessage
            }).end()
          }
        }
      default:
        return res.status(500).json({
          'error': 'undefined action'
        }).end()
    }
  }
)

api.put('/:id(\\d+)', getUserFromAuthnToken,
  async (req, res) => {
    const me = res.locals.user
    const action = req.body.action
    const game_id = parseInt(req.params.id, 10)

    switch (action) {
      case 'join':
        try {
          await joinGame(game_id, me.id)
          return res.status(200).json({}).end()
        } catch (err) {
          const errMessage = err.message
          if (errMessage === 'game not found') {
            return res.status(404).json({
              'error': 'game not found'
            }).end()
          } else if (errMessage.startsWith('user is already in game room')) {
            return res.status(403).json({
              'error': errMessage
            }).end()
          } else if (errMessage === 'the room is full') {
            return res.status(403).json({
              'error': errMessage
            }).end()
          } else {
            return res.status(500).json({
              'error': errMessage
            }).end()
          }
        }
      default:
        return res.status(500).json({
          'error': 'undefined action'
        }).end()
    }
  }
)

api.get('/',
  async (req, res) => {
    try {
      const games = await findGamesByStatus(gameStatus.WAITING)
      return res.status(200).json({
        'games': games
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
