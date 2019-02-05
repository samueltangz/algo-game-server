/* global con */

async function findUserById (id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM users WHERE id = ? LIMIT 1', [ id ], function (err, users, _) {
      if (err) return reject(err)
      if (users.length !== 1) return reject(new Error('user not found'))
      resolve(users[0])
    })
  })
}

async function findUserByToken (token) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM users WHERE token = ? LIMIT 1', [ token ], function (err, users, _) {
      if (err) return reject(err)
      if (users.length !== 1) return reject(new Error('user not found'))
      resolve(users[0])
    })
  })
}

async function listTopTen () {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM users ORDER BY rating DESC LIMIT 10', function (err, users, _) {
      if (err) return reject(err)
      resolve(users)
    })
  })
}

module.exports = {
  findUserById,
  findUserByToken,
  listTopTen
}
