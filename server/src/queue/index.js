const { initializeGame } = require('../helpers/games')

function queueAPIs (queue) {
  queue.process('initialize_game', async function (job, done) {
    const { roomId } = job.data
    await initializeGame(JSON.stringify(roomId))
    done()
  })
}

module.exports = {
  queueAPIs
}
