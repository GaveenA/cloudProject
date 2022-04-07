module.exports = (sequelize, DataTypes) =>
  sequelize.define("userLoginTable", {
    username:{
        type: DataTypes.STRING(300),
        primaryKey: true,
        allowNull: false, 
    },
    date:{
        type: DataTypes.DATEONLY,
        primaryKey: true, 
        allowNull: false, 
    },
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });