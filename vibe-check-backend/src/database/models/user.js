module.exports = (sequelize, DataTypes) =>
  sequelize.define("user", {
    username: {
      type: DataTypes.STRING(300),
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(400),
      allowNullL:false,
      unique: true, 
      validate:{
        isEmail:{
          msg:"Must be valid email"
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(96),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    date_joined: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    profile_pic_url: {
      type: DataTypes.STRING(2200),
      allowNull: true
    },
    blocked:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
