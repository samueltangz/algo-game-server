const socket = require('../utils/socket')
const { intToBoolean } = require('../utils/utils')
const model = require('../model')
const config = require('../config')

async function createAndJoinRoom (user) {
  try {
    await model.startTransaction()

    // Check if the user has joined another room
    const { 'id': userId, 'name': username } = user
    const roomsJoined = await model.findRoomsByUserId(userId)
    if (roomsJoined.length > 0) throw new Error('user has joined another room')

    // Create and join room
    const room = await model.createRoom()
    const { 'id': roomId } = room
    await model.joinRoom(userId, roomId)

    await socket.joinRoom(username, roomId)

    await model.commit()
    return marshalRoom(room)
  } catch (err) {
    await model.rollback()
    throw err
  }
}

async function joinRoom (user, roomId) {
  try {
    await model.startTransaction()

    // Check if the user has joined another room
    const { 'id': userId, 'name': username } = user
    const [ roomToJoin, roomsJoined ] = await Promise.all([
      model.findRoomById(roomId), model.findRoomsByUserId(userId)
    ])
    if (roomsJoined.length > 0) throw new Error('user has joined another room')
    if (roomToJoin['user_count'] >= config.roomSize) throw new Error('room is full')

    // Join room
    const [ , room ] = await Promise.all([
      model.joinRoom(userId, roomId), model.deltaUserCount(roomId, 1)
    ])

    await socket.joinRoom(username, roomId)
    socket.roomBroadcast(roomId, `${username} joined room #${roomId}`)

    await model.commit()
    return marshalRoom(room)
  } catch (err) {
    await model.rollback()
    throw err
  }
}

async function leaveRoom (user) {
  try {
    await model.startTransaction()

    // Check if the user has joined a room
    const { 'id': userId, 'name': username } = user
    const roomsJoined = await model.findRoomsByUserId(userId)
    if (roomsJoined.length === 0) throw new Error('user is not in a room')

    const roomId = roomsJoined[0]['id']
    const roomsUsers = await model.findRoomsUsersByUserIdAndRoomId(userId, roomId)
    if (roomsUsers.length === 0) throw new Error('room-user entry not exist')

    if (intToBoolean(roomsUsers[0]['is_ready'])) throw new Error('user is ready')

    // Leave room
    const [ , room ] = await Promise.all([
      model.leaveRoom(userId, roomId), model.deltaUserCount(roomId, -1)
    ])

    if (room['user_count'] === 0) {
      await model.deleteRoom(roomId)
    }

    socket.roomBroadcast(roomId, `${username} left room #${roomId}`)
    await socket.leaveRoom(username, roomId)

    await model.commit()
    return marshalRoom(room)
  } catch (err) {
    await model.rollback()
    throw err
  }
}

async function updateReady (user, isReady) {
  try {
    await model.startTransaction()

    // Check if the user has joined a room
    const { 'id': userId, 'name': username } = user
    const roomsJoined = await model.findRoomsByUserId(userId)
    if (roomsJoined.length === 0) throw new Error('user is not in a room')

    const roomId = roomsJoined[0]['id']
    const roomsUsers = await model.findRoomsUsersByUserIdAndRoomId(userId, roomId)
    if (roomsUsers.length === 0) throw new Error('room-user entry not exist')

    if (intToBoolean(roomsUsers[0]['is_ready']) === isReady) throw new Error('ready status will not be changed')

    // Update ready status
    const [ , room ] = await Promise.all([
      model.updateReady(userId, roomId, isReady),
      model.deltaReadyUserCount(roomId, isReady ? 1 : -1)
    ])

    if (isReady) {
      socket.roomBroadcast(roomId, `${username} is now ready`)
    } else {
      socket.roomBroadcast(roomId, `${username} is now not ready`)
    }

    await model.commit()
    return marshalRoom(room)
  } catch (err) {
    await model.rollback()
    throw err
  }
}

function marshalRoom (dbRoom) {
  return {
    id: dbRoom['id'],
    status: model.roomStatusToString(dbRoom['status']),
    userCount: dbRoom['user_count']
  }
}

module.exports = {
  createAndJoinRoom,
  joinRoom,
  leaveRoom,
  updateReady,

  marshalRoom
}
