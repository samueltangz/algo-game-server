# algo-game-server

[![CircleCI](https://circleci.com/gh/samueltangz/algo-game-server.svg?style=svg)](https://circleci.com/gh/samueltangz/algo-game-server) [![codecov](https://codecov.io/gh/samueltangz/algo-game-server/branch/master/graph/badge.svg)](https://codecov.io/gh/samueltangz/algo-game-server)

## Installing the project locally

### Starting the server

```bash
# Prerequisite:
# - You need to have MYSQL and Redis installed.

# Copy the config.example.js to config.js
cp src/config.example.js src/config.js

# Update config.js accordingly:
# - portAPI is the port exposed by the API server for API endpoints
# - portSocket is the port exposed by the API server for socket connection
# - portRedis is the port exposed by the Redis server
#   (you need not to start the Redis server by yourself, it will be handled by the API server)
# - mysql.* is the confidentals for the MYSQL database and database used.

# Install yarn dependencies
yarn install

# Prepare the environment: Perform DB migration
yarn prepare

# Start
yarn start
```

### Starting the client

```bash
# Install yarn dependencies
yarn install

# Start
yarn start
```
