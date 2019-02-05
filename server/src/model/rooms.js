/* global con */

const roomStatus = {
  WAITING: 0,
  PLAYING: 1,
  FINISHED: 2
}

function roomStatusToString (status) {
  switch (status) {
    case roomStatus.WAITING: return 'waiting'
    case roomStatus.PLAYING: return 'playing'
    case roomStatus.FINISHED: return 'finished'
    default: throw new Error('undefined status')
  }
}

async function createRoom () {
  const id = await new Promise((resolve, reject) => {
    con.query('INSERT INTO rooms (id, status) VALUES (NULL, 0)', function (err, result) {
      if (err) return reject(err)
      if (result.affectedRows !== 1) return reject(new Error('cannot create room'))
      resolve(result.affectedRows)
    })
  })
  return findRoomById(id)
}

async function findRoomById (id) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms WHERE id = ? LIMIT 1', [ id ], function (err, rooms, _) {
      if (err) return reject(err)
      if (rooms.length !== 1) return reject(new Error('room not found'))
      resolve(rooms[0])
    })
  })
}

async function findRoomsByStatus (status) {
  return new Promise((resolve, reject) => {
    con.query('SELECT * FROM rooms WHERE status = ?', [ status ], function (err, rooms, _) {
      if (err) return reject(err)
      resolve(rooms)
    })
  })
}

module.exports = {
  roomStatus,
  roomStatusToString,

  createRoom,
  findRoomById,
  findRoomsByStatus
}
