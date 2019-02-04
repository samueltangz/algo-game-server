const express = require('express')
const api = express.Router()

const games = require('./games')
const users = require('./users')

api.use('/games', games)
api.use('/users', users)

module.exports = api