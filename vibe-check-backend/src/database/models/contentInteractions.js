module.exports = (sequelize, DataTypes) =>
  sequelize.define("contentInteractions", {
    content_id:{
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false, 
    },
    username:{
        type: DataTypes.STRING(300),
        primaryKey: true,
        allowNull: false, 
    },
    interaction:{
        type: DataTypes.BOOLEAN,
        allowNull: false, 
    },
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });