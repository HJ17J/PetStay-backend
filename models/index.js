"use strict";

const Sequelize = require("sequelize");
const db = {};

let config;
if (process.env.NODE_ENV) {
  config = require(__dirname + "/../config/config.js")[process.env.NODE_ENV];
} else {
  config = require(__dirname + "/../config/config.js")["development"];
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const Users = require("./Users")(sequelize, Sequelize);
const Chats = require("./Chats")(sequelize, Sequelize);
const Reservations = require("./Reservations")(sequelize, Sequelize);
const Reviews = require("./Reviews")(sequelize, Sequelize);
const Rooms = require("./Rooms")(sequelize, Sequelize);
const Sitters = require("./Sitters")(sequelize, Sequelize);

// 관계설정
Users.hasOne(Sitters, { foreignKey: "useridx" });
Sitters.belongsTo(Users, { foreignKey: "useridx" });

Reservations.belongsTo(Users, { foreignKey: "useridx" });
Users.hasMany(Reservations, { foreignKey: "useridx" });
Reservations.belongsTo(Users, { foreignKey: "sitteridx" });
Users.hasMany(Reservations, { foreignKey: "sitteridx" });

Reviews.belongsTo(Users, { foreignKey: "useridx" });
Users.hasMany(Reviews, { foreignKey: "useridx" });
Reviews.belongsTo(Users, { foreignKey: "sitteridx" });
Users.hasMany(Reviews, { foreignKey: "sitteridx" });

Rooms.belongsTo(Users, { foreignKey: "useridx" });
Users.hasMany(Rooms, { foreignKey: "useridx" });
Rooms.belongsTo(Users, { foreignKey: "sitteridx" });
Users.hasMany(Rooms, { foreignKey: "sitteridx" });

Users.hasMany(Chats, { foreignKey: "authoridx" });
Chats.belongsTo(Users, { foreignKey: "authoridx" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Users = Users;
db.Chats = Chats;
db.Reservations = Reservations;
db.Reviews = Reviews;
db.Rooms = Rooms;
db.Sitters = Sitters;

module.exports = db;
