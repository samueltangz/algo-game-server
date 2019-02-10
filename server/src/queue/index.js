const { initializeGame, initiateTurn } = require('../helpers/games')

function queueAPIs (queue) {
  queue.process('initialize_game', async function (job, done) {
    const { roomId } = job.data
    await initializeGame(roomId)
    done()
  })
  queue.process('initiate_turn', async function (job, done) {
    const { roomId, gameId } = job.data
    await initiateTurn(roomId, gameId)
    done()
  })
}

module.exports = {
  queueAPIs
}
