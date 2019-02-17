const express = require('express')

const { getUserFromAuthnToken } = require('../utils/middlewares')
const { listRooms, createAndJoinRoom, joinRoom, leaveRoom, updateReady } = require('../helpers/rooms')

const api = express.Router()

api.get('/',
  async (req, res) => {
    try {
      const rooms = await listRooms()
      return res.status(200).json({
        'rooms': rooms
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': err.message
      }).end()
    }
  }
)

api.post('/', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const user = res.locals.user
      const room = await createAndJoinRoom(user)
      return res.status(200).json({
        'room': room
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': err.message
      }).end()
    }
  }
)

api.post('/join/:id(\\d+)', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const user = res.locals.user
      const roomId = parseInt(req.params.id, 10)
      const room = await joinRoom(user, roomId)
      return res.status(200).json({
        'room': room
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': err.message
      }).end()
    }
  }
)

api.delete('/join', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const user = res.locals.user
      const room = await leaveRoom(user)
      return res.status(200).json({
        'room': room
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': err.message
      }).end()
    }
  }
)

api.put('/ready', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const user = res.locals.user
      await updateReady(user, true)
      return res.status(200).json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        'error': err.message
      }).end()
    }
  }
)

api.delete('/ready', getUserFromAuthnToken,
  async (req, res) => {
    try {
      const user = res.locals.user
      await updateReady(user, false)
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
