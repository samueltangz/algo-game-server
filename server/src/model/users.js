async function findUserById (id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM users WHERE id = ? LIMIT 1', [ id ], function (err, results, _) {
      if (err) return reject(err)
      if (results.length !== 1) return reject('does not return one user')
      resolve(marshal(results[0]))
    })
  })
}

async function findUserByToken (token) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM users WHERE token = ? LIMIT 1', [ token ], function (err, results, fields) {
      if (err) return reject(err)
      if (results.length !== 1) return reject('does not return one user')
      resolve(marshal(results[0]))
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
  findUserByToken
}