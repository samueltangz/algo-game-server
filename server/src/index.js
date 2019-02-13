const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const http = require('http')
const socket = require('socket.io')
const RedisServer = require('redis-server')
const redis = require('redis')
const kue = require('kue')

const { config } = require('./config')
const router = require('./router')
const { socketAPIs } = require('./socket')
const { queueAPIs } = require('./queue')

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

io.on('connection', socketAPIs)
global.io = io

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

// Redis
const redisServer = new RedisServer({
  port: config.portRedis
})
redisServer.open(function (err) {
  if (err) throw err
  console.log(`Redis server listening on port ${config.portRedis}`)
})
const redisClient = redis.createClient()
global.redisClient = redisClient

// Job queue
const queue = kue.createQueue()
queue.on('job enqueue', function (id, type) {
  console.log(`New job #${id} (type: ${type})`)
}).on('job complete', function (id, result) {
  kue.Job.get(id, function (err, job) {
    if (err) throw err
    job.remove(function (err) {
      if (err) throw err
      console.log(`Completed job #${job.id}`)
    })
  })
})
queueAPIs(queue)

global.queue = queue
