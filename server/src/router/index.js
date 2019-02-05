const express = require('express')
const api = express.Router()

const rooms = require('./rooms')
const users = require('./users')

api.use('/rooms', rooms)
api.use('/users', users)

module.exports = api
