const Users = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "Users",
    {
      useridx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userid: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      userpw: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      img: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      usertype: {
        type: DataTypes.ENUM("user", "sitter", "admin"),
        allowNull: false,
      },
      // googleId: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return model;
};

module.exports = Users;
