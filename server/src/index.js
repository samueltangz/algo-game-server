const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const { config } = require('./config')
const router = require('./router')
const { getUserFromAuthnToken } = require('./utils/express_middlewares')

const app = express()

// Application endpoints
app.use(bodyParser.json())
app.use(getUserFromAuthnToken)
app.use('/', router)

app.listen(config.port, function () {
  console.log(`App listening on port ${config.port}`)
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
