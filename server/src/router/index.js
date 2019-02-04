const express = require('express')
const api = express.Router()

const users = require('./users')

api.use('/users', users)

module.exports = api