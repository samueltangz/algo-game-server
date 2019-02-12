'use strict'

var dbm
var type
var seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db, callback) {
  db.createTable('games_users', {
    'id': { type: 'int', primaryKey: true, autoIncrement: true },
    'game_id': { type: 'int', notNull: true, foreignKey: { name: 'games_users_game_id_fk', table: 'games', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    'user_id': { type: 'int', notNull: true, foreignKey: { name: 'games_users_user_id_fk', table: 'users', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } }
  }, callback)
}

exports.down = function (db, callback) {
  db.dropTable('games_users', callback)
}

exports._meta = {
  'version': 1
}
