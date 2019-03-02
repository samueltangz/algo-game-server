/* global queue */

const socket = require('../utils/socket')
const { intToBoolean } = require('../utils/utils')
const model = require('../model')
const config = require('../config')

async function isUserJoinedRoom (userId) {
  try {
    await model.findRoomUserByUserId(userId)
    return true
  } catch (err) {
    if (err.message === 'user is not in a room') {
      return false
    }
    throw err
  }
}

async function listRooms () {
  const rooms = await model.listRooms()
  return rooms.map(marshalRoom)
}

async function createAndJoinRoom (user) {
  try {
    await model.startTransaction()

    // Check if the user has joined another room
    const { 'id': userId, 'name': username } = user
    if (await isUserJoinedRoom(userId)) throw new Error('user has joined another room')

    // Create and join room
    const room = await model.createRoom()
    const { 'id': roomId } = room
    await model.joinRoom(userId, roomId)

    socket.roomState(userId, roomId)
    await socket.joinRoom(userId, roomId)
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
    const [ roomToJoin, isJoinedRoom ] = await Promise.all([
      model.findRoomById(roomId), isUserJoinedRoom(userId)
    ])
    if (isJoinedRoom) throw new Error('user has joined another room')
    if (roomToJoin['user_count'] >= config.roomSize) throw new Error('room is full')
    if (roomToJoin['status'] !== roomStatus.WAITING) throw new Error('room is not available for joining')

    // Join room
    await Promise.all([
      model.joinRoom(userId, roomId),
      model.deltaUserCount(roomId, 1)
    ])

    socket.roomState(userId, roomId)
    await socket.joinRoom(userId, roomId)
    socket.roomBroadcast(roomId, `${username} joined room #${roomId}`)

    const room = await model.findRoomById(roomId)

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
    const roomUser = await model.findRoomUserByUserId(userId)

    const roomId = roomUser['room_id']
    const room = await model.findRoomById(roomId)
    if (room['status'] !== roomStatus.WAITING) throw new Error('room is not available for leaving')

    if (intToBoolean(roomUser['is_ready'])) throw new Error('user is ready')

    // Leave room
    await Promise.all([
      model.leaveRoom(userId),
      model.deltaUserCount(roomId, -1)
    ])

    const updatedRoom = await model.findRoomById(roomId)

    if (updatedRoom['user_count'] === 0) {
      await model.deleteRoom(roomId)
    }

    socket.roomState(userId, undefined)
    socket.roomBroadcast(roomId, `${username} left room #${roomId}`)
    await socket.leaveRoom(userId, roomId)

    await model.commit()
    return marshalRoom(updatedRoom)
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
    const roomUser = await model.findRoomUserByUserId(userId)

    const roomId = roomUser['room_id']
    const room = await model.findRoomById(roomId)
    if (room['status'] !== roomStatus.WAITING) throw new Error('ready status cannot be changed')

    if (intToBoolean(roomUser['is_ready']) === isReady) throw new Error('ready status will not be changed')

    // Update ready status
    let [ , updatedRoom ] = await Promise.all([
      model.updateReady(userId, isReady),
      model.deltaReadyUserCount(roomId, isReady ? 1 : -1)
    ])

    if (isReady) {
      socket.roomBroadcast(roomId, `${username} is now ready`)
    } else {
      socket.roomBroadcast(roomId, `${username} is now not ready`)
    }

    if (updatedRoom['user_count'] === updatedRoom['ready_user_count'] && room['user_count'] >= 2) {
      updatedRoom = await model.updateRoomStatus(roomId, roomStatus.PREPARE)
      socket.roomBroadcast(roomId, `All players are ready.  Preparing game.`)
      queue.create('initialize_game', { roomId }).save()
    }

    await model.commit()

    return marshalRoom(updatedRoom)
  } catch (err) {
    await model.rollback()
    throw err
  }
}

module.exports = {
  listRooms,
  createAndJoinRoom,
  joinRoom,
  leaveRoom,
  updateReady
}
