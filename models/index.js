'use strict';

const Sequelize = require('sequelize');
const db = {};

let config;
if (process.env.NODE_ENV) {
  config = require(__dirname + '/../config/config.js')[process.env.NODE_ENV];
} else {
  config = require(__dirname + '/../config/config.js')['development'];
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
