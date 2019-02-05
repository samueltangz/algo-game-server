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
  db.createTable('rooms_users', {
    'id': { type: 'int', primaryKey: true, autoIncrement: true },
    'room_id': { type: 'int', notNull: true, foreignKey: { name: 'rooms_users_room_id_fk', table: 'rooms', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    'user_id': { type: 'int', notNull: true, foreignKey: { name: 'rooms_users_user_id_fk', table: 'users', mapping: 'id', rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' } } },
    'is_ready': { type: 'boolean', defaultValue: false }
  }, callback)
}

exports.down = function (db, callback) {
  db.dropTable('rooms_users', callback)
}

exports._meta = {
  'version': 1
}
