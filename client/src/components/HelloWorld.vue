<template>
  <div>
  </div>
</template>

<script>
const io = require('socket.io-client')

const socket = io('http://0.0.0.0:14937')

socket.on('connect', function () {
  console.log(socket.connected)
  socket.on('chat message', function (message) {
    console.log(message)
    socket.emit('chat message', message + '!')
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
