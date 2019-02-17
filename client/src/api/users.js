const axios = require('axios')
const { API_HOSTNAME } = require('../config.js')

async function me (authnToken) {
  const res = await axios.get(`${API_HOSTNAME}/users/me`, {
    headers: {
      'Authorization': `Bearer ${authnToken}`
    }
  })
  return res.data['user']
}

async function top10 () {
  const res = await axios.get(`${API_HOSTNAME}/users/top10`)
  return res.data
}

export default {
  me,
  top10
}
