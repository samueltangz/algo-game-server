const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const http = require('http')
const socket = require('socket.io')

const { config } = require('./config')
const router = require('./router')

// Application endpoints
const app = express()
app.use(bodyParser.json())
app.use('/', router)

app.listen(config.portAPI, function () {
  console.log(`App listening on port ${config.portAPI}`)
})

// Socket
const server = http.createServer(app)
const io = socket(server, {
  origins: '*:*'
})

server.listen(config.portSocket, function () {
  console.log(`Socket server listening on port ${config.portSocket}`)
})

io.on('connection', function (socket) {
  console.log('user connected')
  socket.emit('chat message', ':o)')
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
  socket.on('chat message', function (message) {
    if (message.length > 100) return
    io.emit('chat message', message + '?')
  })
})

// Database
const con = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
})

con.connect(function (err) {
  if (err) throw err
  console.log('Connected to database')
})
global.con = con
global.io = io
