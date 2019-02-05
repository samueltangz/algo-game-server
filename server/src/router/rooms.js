const express = require('express')

const { getUserFromAuthnToken } = require('../utils/middlewares')
const { createRoom } = require('./../model/rooms')
const { joinRoom, leaveRoom, updateReady } = require('./../model/rooms_users')

const api = express.Router()

api.post('/', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const room = await createRoom()
      return res.status(200).json({
        'room': room
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': 'unexpected error'
      }).end()
    }
  }
)

api.post('/join/:id(\\d+)', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const userId = res.locals.user.id
      const roomId = parseInt(req.params.id, 10)
      await joinRoom(userId, roomId)
      return res.status(200).json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': 'unexpected error'
      }).end()
    }
  }
)

api.delete('/join', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const userId = res.locals.user.id
      await leaveRoom(userId)
      return res.status(200).json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': 'unexpected error'
      }).end()
    }
  }
)

api.delete('/ready', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const userId = res.locals.user.id
      await updateReady(userId, false)
      return res.status(200).json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': 'unexpected error'
      }).end()
    }
  }
)

api.put('/ready', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const userId = res.locals.user.id
      await updateReady(userId, true)
      return res.status(200).json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': 'unexpected error'
      }).end()
    }
  }
)

module.exports = api
