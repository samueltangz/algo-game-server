const { findUserByToken } = require('./../model/users')

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
  const user = await findUserByToken(authnToken)
  console.log(user
    )
  if (!user) {
    return res.status(403).json({
      'error': 'user not found'
    })
  }
  res.locals.user = user
  next()
}

module.exports = {
  getUserFromAuthnToken
}