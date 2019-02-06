const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const http = require('http')
const socket = require('socket.io')

const { config } = require('./config')
const router = require('./router')
const socketAPI = require('./socket')

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
  origins: '0.0.0.0:*'
})

server.listen(config.portSocket, function () {
  console.log(`Socket server listening on port ${config.portSocket}`)
})

io.on('connection', function (socket) {
  socket.on('token', function (token) {
    console.log(`checking token ${token}`)
    socketAPI.token(socket, token)
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
