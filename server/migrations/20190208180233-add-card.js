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
  db.createTable('cards', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    game_id: { type: 'int', foreignKey: { name: 'cards_game_id_fk', table: 'games', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    user_id: { type: 'int', foreignKey: { name: 'cards_user_id_fk', table: 'users', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    color: { type: 'int', notNull: true },
    value: { type: 'int', notNull: true },
    order: { type: 'int', notNull: true },
    is_picked: { type: 'boolean', notNull: true, defaultValue: false }
  }, callback)
}

exports.down = function (db, callback) {
  db.dropTable('cards', callback)
}

exports._meta = {
  'version': 1
}
