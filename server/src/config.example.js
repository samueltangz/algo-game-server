const config = {
  portAPI: 3000,
  portSocket: 3001,
  portRedis: 6379,

  mysql: {
    host: 'localhost',
    user: 'algo-dev',
    password: 'development',
    database: 'algo_development'
  },

  roomSize: 4
}

exports.config = config
