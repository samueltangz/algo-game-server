/* global queue */

const socket = require('../utils/socket')
const { intToBoolean } = require('../utils/utils')
const model = require('../model')
const config = require('../config')

const roomStatus = {
  WAITING: 0,
  PREPARE: 1,
  PLAYING: 2
}

function roomStatusToString (status) {
  switch (status) {
    case roomStatus.WAITING: return 'waiting'
    case roomStatus.PREPARE: return 'prepare'
    case roomStatus.PLAYING: return 'playing'
    default: throw new Error('undefined status')
  }
}

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
    socket.roomBroadcast(roomId, `${username} joined room #${roomId}`)

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
    if (roomToJoin['status'] !== roomStatus.WAITING) throw new Error('room is not available for joining')

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
    if (roomsJoined[0]['status'] !== roomStatus.WAITING) throw new Error('room is not available for leaving')

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
    if (roomsJoined[0]['status'] !== roomStatus.WAITING) throw new Error('ready status cannot be changed')

    const roomId = roomsJoined[0]['id']
    const roomsUsers = await model.findRoomsUsersByUserIdAndRoomId(userId, roomId)
    if (roomsUsers.length === 0) throw new Error('room-user entry not exist')

    if (intToBoolean(roomsUsers[0]['is_ready']) === isReady) throw new Error('ready status will not be changed')

    // Update ready status
    let [ , room ] = await Promise.all([
      model.updateReady(userId, roomId, isReady),
      model.deltaReadyUserCount(roomId, isReady ? 1 : -1)
    ])

    if (isReady) {
      socket.roomBroadcast(roomId, `${username} is now ready`)
    } else {
      socket.roomBroadcast(roomId, `${username} is now not ready`)
    }

    if (room['user_count'] === room['ready_user_count'] && room['user_count'] >= 2) {
      room = await model.updateRoomStatus(roomId, roomStatus.PREPARE)
      socket.roomBroadcast(roomId, `All players are ready.  Preparing game.`)
      queue.create('initialize_game', { roomId }).save()
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
    status: roomStatusToString(dbRoom['status']),
    userCount: dbRoom['user_count']
  }
}

module.exports = {
  roomStatus,
  roomStatusToString,

  createAndJoinRoom,
  joinRoom,
  leaveRoom,
  updateReady,

  marshalRoom
}
