const express = require('express')

const { getUserFromAuthnToken } = require('./../utils/express_middlewares')
const { listTopTen } = require('./../model/users')

const api = express.Router()

api.get('/me', getUserFromAuthnToken,
  async (req, res) => {
    const me = res.locals.user
    return res.status(200).json({
      'user': me
    }).end()
  }
)

api.get('/top10',
  async (req, res) => {
    const users = await listTopTen()
    return res.status(200).json({
      'users': users
    })
  }
)
module.exports = api
