async function findUserById (id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM users WHERE id = ? LIMIT 1', [ id ], function (err, users, _) {
      if (err) return reject(err)
      if (users.length !== 1) return reject('does not return one user')
      resolve(marshal(users[0]))
    })
  })
}

async function findUserByToken (token) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM users WHERE token = ? LIMIT 1', [ token ], function (err, users, _) {
      if (err) return reject(err)
      if (users.length !== 1) return reject('does not return one user')
      resolve(marshal(users[0]))
    })
  })
}

async function listTopTen () {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM users ORDER BY rating DESC LIMIT 10', function (err, users, _) {
      if (err) return reject(err)
      resolve(users.map(user => marshal(user)))
    })
  })
}

function marshal (dbUser) {
  return {
    id: dbUser['id'],
    name: dbUser['name'],
    rating: dbUser['rating']
  }
}

module.exports = {
  findUserById,
  findUserByToken,
  listTopTen
}