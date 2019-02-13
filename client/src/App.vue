<template>
  <div id="app">
    {{ user }} / {{ authnToken }}
    {{ isLoggedIn }}
    <router-view/>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import config from '@/config'
import store from '@/store'

const io = require('socket.io-client')
const socket = io(config.SOCKET_HOSTNAME)

export default {
  name: 'App',

  mounted () {
    store.dispatch('users/update', 'BB5cxBvtvfmprVgPn5yvxYoEHQu6eHnqeJgl0fTx0B4')
    this.initSocket()
  },

  computed: {
    ...mapState('users', [
      'user', 'authnToken'
    ]),
    ...mapGetters('users', [
      'isLoggedIn'
    ])
  },

  watch: {
    authnToken () {
      const { authnToken } = this
      socket.emit('token', authnToken)
    }
  },
  methods: {
    initSocket () {
      socket.on('connect', () => {
        socket.on('game_broadcast', function (message) {
          store.commit('messages/append', { content: message, type: 'game_broadcast' })
        })
        socket.on('room_broadcast', function (message) {
          store.commit('messages/append', { content: message, type: 'room_broadcast' })
        })
        socket.on('game_message', function (message) {
          store.commit('messages/append', { content: message, type: 'game_message' })
        })
        socket.on('room_message', function (message) {
          store.commit('messages/append', { content: message, type: 'room_message' })
        })
        socket.on('room_state', function (roomId) {
          store.commit('users/setRoomId', roomId)
        })
        socket.on('game_state', function (gameId) {
          store.commit('users/setGameId', gameId)
        })
        socket.on('game_board_state', console.log)
      })

      socket.on('disconnect', function () {
        socket.removeAllListeners('game_broadcast')
        socket.removeAllListeners('room_broadcast')
        socket.removeAllListeners('game_message')
        socket.removeAllListeners('room_message')
        socket.removeAllListeners('room_state')
        socket.removeAllListeners('game_state')
        socket.removeAllListeners('game_board_state')
      })
    }
  }
}
</script>
