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
  db.createTable('games', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_count: { type: 'int' },
    user_1_id: { type: 'int', foreignKey: { name: 'games_user_1_id_fk', table: 'users', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    user_2_id: { type: 'int', foreignKey: { name: 'games_user_2_id_fk', table: 'users', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    user_3_id: { type: 'int', foreignKey: { name: 'games_user_3_id_fk', table: 'users', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    user_4_id: { type: 'int', foreignKey: { name: 'games_user_4_id_fk', table: 'users', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    user_1_score: { type: 'int', notNull: true },
    user_2_score: { type: 'int', notNull: true },
    user_3_score: { type: 'int', notNull: true },
    user_4_score: { type: 'int', notNull: true },
    current_turn: { type: 'int', defaultValue: 1 },
    attack_count: { type: 'int', defaultValue: 0 },
    card_deck_pointer: { type: 'int', defaultValue: 0 },
    is_turn_initiated: { type: 'boolean', notNull: true, defaultValue: false }
  }, callback)
}

exports.down = function (db, callback) {
  db.dropTable('games', callback)
}

exports._meta = {
  'version': 1
}
