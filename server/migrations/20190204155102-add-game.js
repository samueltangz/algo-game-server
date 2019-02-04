'use strict'

var dbm
var type
var seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function(db, callback) {
  db.createTable('games', {
    'id': { type: 'int', primaryKey: true, autoIncrement: true },
    'card_pile': { type: 'string', length: 1024, notNull: true },
    'status': { type: 'int', defaultValue: 0 },
    'player_1': { type: 'int' },
    'player_2': { type: 'int' },
    'player_3': { type: 'int' },
    'player_4': { type: 'int' },
    'player_ready_status': { type: 'int', defaultValue: 0 }
  }, callback)
}

exports.down = function(db, callback) {
  db.dropTable('games', callback)
}

exports._meta = {
  'version': 1
}
