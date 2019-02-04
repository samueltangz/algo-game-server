const express = require('express')

const { findUserById } = require('./../model/users')

const api = express.Router()

api.get('/me', async (req, res) => {
  const me = res.locals.user
  return res.status(200).json({
    'user': me
  }).end()
})

module.exports = api
