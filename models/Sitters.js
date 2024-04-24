const Sitters = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "Sitters",
    {
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      license: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      career: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      selfIntroduction: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      pay: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      confirm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return model;
};

module.exports = Sitters;
