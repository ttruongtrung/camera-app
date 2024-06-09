const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const dbConfig = require('./dbconfig.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.camera = require('./camera.model.js')(sequelize, Sequelize);
db.videoSegment = require('./videoSegment.model.js')(sequelize, Sequelize);
db.match = require('./match.model.js')(sequelize, Sequelize);
db.camera.hasMany(db.videoSegment, { as: 'video_segments' });
db.camera.hasMany(db.match, { as: 'video_matches' });
db.videoSegment.belongsTo(db.camera, {
  foreignKey: 'cameraId',
  as: 'camera',
});
db.match.belongsTo(db.camera, {
  foreignKey: 'cameraId',
  as: 'camera',
});

module.exports = db;
