const axios = require('axios')
const { API_HOSTNAME } = require('../config.js')

async function attack (authnToken, cardId, value) {
  const res = await axios.post(`${API_HOSTNAME}/action/attack`, {
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
  const res = await axios.post(`${API_HOSTNAME}/action/pick`, {
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
  const res = await axios.post(`${API_HOSTNAME}/action/keep`, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data
}

export default {
  attack,
  pick,
  keep
}
