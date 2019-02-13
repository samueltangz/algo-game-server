const cors = require('cors')

const { findUserByToken } = require('../model/users')

const getUserFromAuthnToken = async function (req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(403).json({
      'error': 'missing authorization header'
    }).end()
  }
  const token = req.headers.authorization
  if (!token.startsWith('Bearer ')) {
    return res.status(403).json({
      'error': 'authorization header should be in the format \'Bearer <token>\''
    })
  }
  const authnToken = token.substr(7)
  try {
    const user = await findUserByToken(authnToken)
    res.locals.user = user
    next()
  } catch (err) {
    return res.status(403).json({
      'error': 'user not found'
    })
  }
}

const enableCors = cors()

module.exports = {
  getUserFromAuthnToken,
  enableCors
}
