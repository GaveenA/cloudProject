module.exports = (sequelize, DataTypes) =>
  sequelize.define("content", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, 
      primaryKey: true,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER, 
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false, 
    },
    image_url: {
      type: DataTypes.STRING(2200),
      allowNull: true, 
    },
    content_body: {
      type: DataTypes.STRING(600),
      allowNull: true,
    },
    deleted_by_admin:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: true
  });
