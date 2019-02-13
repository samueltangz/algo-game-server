<template>
  <div>
    <input
      v-model="token"
      placeholder="Token"
      size=50>
    <hr>
    <xmp>{{ JSON.stringify(boardState, 0, 2) }}</xmp>
    <hr>
    <div
      v-for="message in messages"
      :key="message.id">
      [{{ message.type }}] {{ message.content }}
    </div>
  </div>
</template>

<script>
const io = require('socket.io-client')
const socket = io(`http://${window.location.hostname}:14937`)

export default {
  name: 'HelloWorld',
  data () {
    return {
      name: '',
      token: '',
      boardState: {},
      messages: []
    }
  },
  mounted () {
    const { syncBoardState, appendMessage } = this
    socket.on('connect', () => {
      socket.on('game_broadcast', function (message) {
        appendMessage({ content: message, type: 'game_broadcast' })
      })
      socket.on('room_broadcast', function (message) {
        appendMessage({ content: message, type: 'room_broadcast' })
      })
      socket.on('game_message', function (message) {
        appendMessage({ content: message, type: 'game_message' })
      })
      socket.on('room_message', function (message) {
        appendMessage({ content: message, type: 'room_message' })
      })
      socket.on('disconnect', function () {
        alert('Socket disconnected.  Please reload.')
      })
      socket.on('game_board_state', syncBoardState)
    })

    socket.on('disconnect', function () {
      socket.removeAllListeners('game_broadcast')
      socket.removeAllListeners('room_broadcast')
      socket.removeAllListeners('game_message')
      socket.removeAllListeners('room_message')
      socket.removeAllListeners('game_board_state')
    })
  },

  methods: {
    syncBoardState: function (boardState) {
      this.boardState = boardState
    },
    appendMessage: function (message) {
      message.id = this.messages.length + 1
      this.messages.push(message)
    }
  },

  watch: {
    token (val) {
      if (val.length === 43) {
        socket.emit('token', val)
      }
    }
  }
}
</script>
