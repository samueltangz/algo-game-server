// const assert = require('assert')
// const sinon = require('sinon')

// const mysql = require('mysql')

// const { config } = require('../../src/config.example')
// const cards = require('../../src/model/cards')
// const { cardColor } = require('../../src/helpers/cards')

// describe('model/cards.js', () => {
//   const con = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
//   })
//   const mysqlMock = sinon.mock(con)
//   window.con = con

//   describe('createCard', () => {
//     const fn = cards.createCard
//     test('should create a new card', async () => {
//       // Mock
//       mysqlMock
//         .expects('query')
//         .withArgs(
//           'INSERT INTO cards (`id`, `game_id`, `user_id`, `color`, `value`, `order`, `is_picked`) VALUES (NULL, ?, NULL, ?, ?, ?, false)',
//           [ 1, cardColor.BLACK, 11, 0 ])
//         .callsArgWith(2, null, { affectedRows: 1 })

//       // Test
//       await assert.doesNotReject(async () => fn(1, cardColor.BLACK, 11, 0))
//     })
//     test('should throws error when error occurs', async () => {
//       // Mock
//       mysqlMock
//         .expects('query')
//         .withArgs(
//           'INSERT INTO cards (`id`, `game_id`, `user_id`, `color`, `value`, `order`, `is_picked`) VALUES (NULL, ?, NULL, ?, ?, ?, false)',
//           [ 1, cardColor.BLACK, 11, 0 ])
//         .callsArgWith(2, new Error('the database is daydreaming'), undefined)

//       // Test
//       await assert.rejects(
//         async () => fn(1, cardColor.BLACK, 11, 0),
//         /^Error: the database is daydreaming$/
//       )
//     })
//     test('should throws when a new card cannot be created', async () => {
//       // Mock
//       mysqlMock
//         .expects('query')
//         .withArgs(
//           'INSERT INTO cards (`id`, `game_id`, `user_id`, `color`, `value`, `order`, `is_picked`) VALUES (NULL, ?, NULL, ?, ?, ?, false)',
//           [ 1, cardColor.BLACK, -7, 0 ])
//         .callsArgWith(2, null, { affectedRows: 0 })

//       // Test
//       await assert.rejects(
//         async () => fn(1, cardColor.BLACK, -7, 0),
//         /^Error: cannot create card$/
//       )
//     })
//   })

//   describe('drawCard', () => {
//     const fn = cards.drawCard
//     test('should draw a card', async () => {
//       // Mock
//       mysqlMock
//         .expects('query')
//         .withArgs(
//           'UPDATE `cards` SET `user_id` = ?, `is_picked` = ? WHERE `game_id` = ? AND `order` = ? LIMIT 1',
//           [ 17, 0, 1, 0 ])
//         .callsArgWith(2, null, { changedRows: 1 })

//       // Test
//       await assert.doesNotReject(async () => fn(1, 0, 17))
//     })
//     test('should throws error when error occurs', async () => {
//       // Mock
//       mysqlMock
//         .expects('query')
//         .withArgs(
//           'UPDATE `cards` SET `user_id` = ?, `is_picked` = ? WHERE `game_id` = ? AND `order` = ? LIMIT 1',
//           [ 17, 0, 1, 0 ])
//         .callsArgWith(2, new Error('the database is daydreaming again'), undefined)

//       // Test
//       await assert.rejects(
//         async () => fn(1, 0, 17),
//         /^Error: the database is daydreaming again$/
//       )
//     })
//     test('should throws when a new card cannot be drawn', async () => {
//       // Mock
//       mysqlMock
//         .expects('query')
//         .withArgs(
//           'UPDATE `cards` SET `user_id` = ?, `is_picked` = ? WHERE `game_id` = ? AND `order` = ? LIMIT 1',
//           [ 17, 1, 1, 24 ])
//         .callsArgWith(2, null, { changedRows: 0 })

//       // Test
//       await assert.rejects(
//         async () => fn(1, 24, 17, true),
//         /^Error: cannot update card deck pointer$/
//       )
//     })
//   })
// })
describe('', () => {
  test('', () => {
  })
})
