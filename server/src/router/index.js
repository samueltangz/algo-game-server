const express = require('express')
const api = express.Router()

const rooms = require('./rooms')
const users = require('./users')
const games = require('./games')

api.use('/rooms', rooms)
api.use('/users', users)
api.use('/games', games)

module.exports = api
