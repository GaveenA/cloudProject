module.exports = (sequelize, DataTypes) =>
  sequelize.define("userFriendships", {
    requester:{
      type: DataTypes.STRING(300),
      primaryKey: true,
      allowNull: false,
    },
    recipient:{
      type: DataTypes.STRING(300),
      primaryKey: true,
      allowNull: false,
    },

  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });