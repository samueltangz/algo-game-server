<template>
  <div>
    {{ name }}<br>
    {{ token }}
  </div>
</template>

<script>
const io = require('socket.io-client')
const socket = io('http://0.0.0.0:14937')

export default {
  name: 'HelloWorld',
  data () {
    return {
      name: '',
      token: ''
    }
  },
  mounted () {
    if (Math.random() < 0.5) {
      this.name = 'Samuel'
      this.token = 'xCYZnHjSfm62W5Mg9XfPt2KCucwlfexXIwyqZNkDZ-8'
    } else {
      this.name = 'Wing'
      this.token = 'iAUAKT30rIJvp4lVcbfEhHaZOsIX5oITKHVSXXSsaYM'
    }

    const token = this.token
    socket.on('connect', function () {
      socket.emit('token', token)
      socket.on('game_broadcast', function (message) {
        console.log(`%c${message}`, 'background: #888; color: #0505AD')
      })
      socket.on('room_broadcast', function (message) {
        console.log(`%c${message}`, 'background: #888; color: #0505AD')
      })
      socket.on('game_message', function (message) {
        console.log(`%c${message}`, 'color: red')
      })
      socket.on('room_message', function (message) {
        console.log(message)
      })
    })

    socket.on('disconnect', function () {
      socket.removeAllListeners('game_broadcast')
      socket.removeAllListeners('room_broadcast')
      socket.removeAllListeners('game_message')
      socket.removeAllListeners('room_message')
    })
  }
}
</script>
