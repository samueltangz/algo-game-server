const axios = require('axios')
const { API_HOSTNAME } = require('../config.js')

async function getBoardState (authnToken) {
  const res = await axios.get(`${API_HOSTNAME}/games`, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data['boardState']
}

async function attack (authnToken, cardId, value) {
  const res = await axios.post(`${API_HOSTNAME}/games/action/attack`, {}, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    },
    data: {
      'card_id': cardId,
      'value': value
    }
  })
  return res.data
}

async function pick (authnToken, cardId) {
  const res = await axios.post(`${API_HOSTNAME}/games/action/pick`, {}, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    },
    data: {
      'card_id': cardId
    }
  })
  return res.data
}

async function keep (authnToken) {
  const res = await axios.post(`${API_HOSTNAME}/games/action/keep`, {}, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data
}

export default {
  getBoardState,
  attack,
  pick,
  keep
}
