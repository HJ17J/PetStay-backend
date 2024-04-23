const Rooms = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "Rooms",
    {
      roomidx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  return model;
};

module.exports = Rooms;
