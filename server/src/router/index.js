const express = require('express')
const api = express.Router()

const { enableCors } = require('../utils/middlewares')
const rooms = require('./rooms')
const users = require('./users')
const games = require('./games')

api.use('/', enableCors)
api.use('/rooms', rooms)
api.use('/users', users)
api.use('/games', games)

module.exports = api
