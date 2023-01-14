const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op,
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.content = require("./models/content.js")(db.sequelize, DataTypes);
db.contentInteractions = require("./models/contentInteractions.js")(db.sequelize, DataTypes);
db.userFriendships = require("./models/userFriendships.js")(db.sequelize, DataTypes);
db.userLoginTable = require("./models/userLoginTable")(db.sequelize, DataTypes);


// Relate content (Post or Comments) and user.
db.user.hasMany(db.content,{
  foreignKey: { name: "username", allowNull: false },
})
db.content.belongsTo(db.user, {
  foreignKey: { name: "username", allowNull: false },
  as: 'author',
  onDelete: "cascade",
  onUpdate: "cascade",
});


// Relate child content (comments) to parent content (post)
db.content.belongsTo(db.content, {
  foreignKey: { name: "parent_id", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
});
// Relate content (Parent Post) and content (Comments).
db.content.hasMany(db.content, {
  as: 'comments',
  foreignKey: { name: "parent_id", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
})





//Relate userFriendships and the Requesting User
db.user.hasMany(db.userFriendships, {
  as: "following", 
  foreignKey: { name: "requester", allowNull: false },
});
db.userFriendships.belongsTo(db.user, {
  foreignKey: { name: "requester", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
})

//Relate userFriendships and the Recieving User
db.user.hasMany(db.userFriendships, {
  as: "followers", 
  foreignKey: { name: "recipient", allowNull: false },
});
db.userFriendships.belongsTo(db.user, {
  foreignKey: { name: "recipient", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
})

//Relate contentInteractions to User (that initiated the interaction on content)
db.user.hasMany(db.contentInteractions,{
  foreignKey: { name: "username", allowNull: false },
})
db.contentInteractions.belongsTo(db.user, {
  foreignKey: { name: "username", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
})

/*Relate contentInteractions to Content (that user interacted with - post or comment)
Creating seperate association for likes and dislikes Interaction and orign Content
Content Interaction belongs to originating Content (owner)
*/
db.content.hasMany(db.contentInteractions,{
  as: 'likes',
  foreignKey: { name: "content_id", allowNull: false },
})
db.content.hasMany(db.contentInteractions,{
  as: 'dislikes',
  foreignKey: { name: "content_id", allowNull: false },
})

db.contentInteractions.belongsTo(db.content, {
  foreignKey: { name: "content_id", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
})


// Relate user and userLoginTable
db.user.hasMany(db.userLoginTable,{ 
  foreignKey: { name: "username", allowNull: false },
})
db.userLoginTable.belongsTo(db.user, {
  foreignKey: { name: "username", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
});


// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });

  await seedData();
};

async function seedData() {
  const count = await db.user.count();

  // Only seed data if necessary.
  if (count > 0) return;

  const argon2 = require("argon2");

  /*Creating Default users and posts to populate tables*/ 
  
  // let hash = await argon2.hash("abc123", { type: argon2.argon2id });
  // await db.user.create({
  //   username: "gav",
  //   email:"gav@gmail.com",
  //   password_hash: hash,
  //   first_name: "Gav",
  //   last_name: "A",
  //   date_joined:new Date().toLocaleDateString().toString(),
  //   blocked: false,
  // });
}

module.exports = db;
