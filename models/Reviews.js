const Reviews = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "Reviews",
    {
      reviewidx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      rate: {
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

module.exports = Reviews;
