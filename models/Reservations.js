const Reservations = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "Reservations",
    {
      resvidx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      confirm: {
        type: DataTypes.ENUM("request", "approved", "refused", "done"),
        allowNull: false,
        defaultValue: "request",
      },
      startTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      animalNumber: {
        type: DataTypes.INTEGER,
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

module.exports = Reservations;
