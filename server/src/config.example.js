const config = {
  portAPI: 3000,
  portSocket: 3001,
  portRedis: 6379,

  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  },

  roomSize: 4
}

exports.config = config
