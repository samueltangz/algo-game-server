<template>
  <div>
  </div>
</template>

<script>
const io = require('socket.io-client')

const socket = io('http://0.0.0.0:14937')

socket.on('connect', function () {
  if (Math.random() < 0.5) {
    socket.emit('token', 'xCYZnHjSfm62W5Mg9XfPt2KCucwlfexXIwyqZNkDZ-8')
  } else {
    socket.emit('token', 'iAUAKT30rIJvp4lVcbfEhHaZOsIX5oITKHVSXXSsaYM')
  }
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

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
