const Chats = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "Chats",
    {
      chatidx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      img: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  return model;
};

module.exports = Chats;
