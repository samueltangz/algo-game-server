const axios = require('axios')
const { API_HOSTNAME } = require('../config.js')

async function listRooms () {
  const res = await axios.get(`${API_HOSTNAME}/rooms`)
  return res.data
}

async function createRoom (authnToken) {
  const res = await axios.post(`${API_HOSTNAME}/rooms`, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data
}

async function joinRoom (authnToken, roomId) {
  const res = await axios.post(`${API_HOSTNAME}/rooms/join/${roomId}`, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data
}

async function leaveRoom (authnToken) {
  const res = await axios.delete(`${API_HOSTNAME}/rooms/join`, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data
}

async function readyRoom (authnToken) {
  const res = await axios.put(`${API_HOSTNAME}/rooms/ready`, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data
}

async function unreadyRoom (authnToken) {
  const res = await axios.delete(`${API_HOSTNAME}/rooms/ready`, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data
}

export default {
  listRooms,
  createRoom,
  joinRoom,
  leaveRoom,
  readyRoom,
  unreadyRoom
}
