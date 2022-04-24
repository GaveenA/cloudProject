const db = require("../database");
const argon2 = require("argon2");
const { QueryTypes } = require('sequelize');
const {errorHandler, responseHandler} = require("../utils");

/**
 * GET all users from the database.
 * @param {*} req 
 * @param {*} res - JSON Response
 */
exports.all = async (req, res) => {
  const users = await db.user.findAll({
    // attributes: {
    //   include: [
    //       [db.sequelize.literal(`(
    //         SELECT username
    //         FROM users
    //         WHERE
    //             username NOT IN (
    //               SELECT F.recipient FROM userFriendships F WHERE F.requester=user.username
    //             )
    //     )`),
    //     'to_follow']
    //   ] 
    // },
    
    // attributes: {include: [
    //   [db.sequelize.fn('COUNT', db.sequelize.col('following.recipient')), "followingCount"]
    //  ]},
    include: [
      // { 
      //   model: db.content,
      //   // where: {
          
      //   //   interaction: { [db.Op.eq]: 1 }
      //   // },
      //   // attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('interaction')), 'likes']],
      //   required: false
      // },
      {
        model: db.userFriendships,
        as: 'following',
        required: false,
        attributes: [
          ['recipient','username']
        ]
      },
      {
        model: db.userFriendships,
        as: 'followers',
        required: false,
        attributes: [
          ['requester','username']
        ]
      },
      // { 
      //   model: db.user,
      //   as: 'to_follow',
      //   attributes: ['username'],
      //   where: db.sequelize.literal("(to_follow.username NOT IN (SELECT F.recipient FROM userFriendships F WHERE F.requester=user.username))"),
      //   // attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('interaction')), 'likes']],
      //   required: false
      // },
      // {
      //   model:[db.sequelize.literal(`(
      //       SELECT username
      //       FROM users
      //       WHERE
      //           username NOT IN (
      //             SELECT F.recipient FROM userFriendships F WHERE F.requester=user.username
      //           )
      //   )`),
      //   'to_follow']
      // }
    ],
  });

  res.json(users);
};


/**
 * Returns a list of users that a specified user (username in req body) can follow.
 * @param {username: String } req - JSON Request body 
 * @param {*} res - Response JSON
 */
exports.getToFollow = async (req, res) => {
  try{
    // const user = await db.user.findByPk(req.params.username);
    const users = await db.sequelize.query("SELECT * FROM users WHERE username NOT IN (SELECT F.recipient FROM userFriendships AS F where F.requester = '"+req?.body?.username+"') AND username !='"+req?.body?.username+"'", { type: QueryTypes.SELECT });
    if (users === null) {
      // Login failed.
      errorHandler(res, 404, "Users not found in database")
    }
    else {
      responseHandler(res, 200, users)
    }
  }
  catch (error){
    errorHandler(res, 500, "Database error", error);
  }
  
};


/**
 * Returns a list of users that a specified user (username in req body) is Following
 * @param {username: String } req - JSON Request body 
 * @param {*} res - Response JSON
 */
exports.currentFollowing = async (req, res) => {
  try{
    console.log(req.body);
    // const user = await db.user.findByPk(req.params.username);
    const users = await db.sequelize.query("SELECT * FROM users WHERE username IN (SELECT F.recipient FROM userFriendships AS F where F.requester = '"+req?.body?.username+"') AND username !='"+req?.body?.username+"'", { type: QueryTypes.SELECT });
    if (users === null) {
      // Login failed.
      errorHandler(res, 404, "Users not found in database")
    }
    else {
      responseHandler(res, 200, users)
      // res.json(users);
    }
  }
  catch (error){
    errorHandler(res, 500, "Database error", error);
  }
  
};




/**
 * Returns a list of users thats following a specified user (username in req body) - Followers
 * @param {username: String } req - JSON Request body 
 * @param {*} res - Response JSON
 */
exports.currentFollowers = async (req, res) => {
  try{
    // const user = await db.user.findByPk(req.params.username);
    const users = await db.sequelize.query("SELECT * FROM users WHERE username IN (SELECT F.requester FROM userFriendships AS F where F.recipient = '"+req?.body?.username+"') AND username !='"+req?.body?.username+"'", { type: QueryTypes.SELECT });
    if (users === null) {
      // Login failed.
      errorHandler(res, 404, "Users not found in database")
    }
    else {
      responseHandler(res, 200, users)
    }
  }
  catch (error){
    errorHandler(res, 500, "Database error", error);
  }
  
};







/**
 * Select one user from the database.
 * @param {username: String } req - Request Params
 * @param {*} res - Response JSON
 */
exports.one = async (req, res) => {
  try{
    const user = await db.user.findByPk(req.params.username);
    if (user === null) {
      // Login failed.
      errorHandler(res, 404, "User not found in database")
    }
    else {
      responseHandler(res, 200, user)
    }
  }
  catch (error){
    errorHandler(res, 500, "Database error", error);
  }
  
};


/**
 * Select one user from the database - from email.
 * @param {email: String } req - Request Params
 * @param {*} res - Response JSON
 */
exports.doesUserExistByEmail = async (req, res) => {
  const user = await db.user.findOne({ where: { email: req.params.email } });
  res.json(user);
};





/**
 * Select one user from the database if username and password are a match.
 * @param {email: String - query param } req - Query Param with email
 * @param {*} res - JSON Response
 */
exports.login = async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.query.email } });
    if (user === null) {
      // Login failed.
      errorHandler(res, 404, "User not found in database")
    } else if ((await argon2.verify(user.password_hash, req.query.password)) === false){
      errorHandler(res, 403, "Incorrect password")
    } else {
      responseHandler(res, 200, user)
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};


/**
 * Create a user in the database.
 * @param {username: : String, email: String, etc (refer user model) } req - JSON Request with fields essential 
 *                                                                           to create user in DB (refer user model)
 * @param {*} res - JSON Response
 */
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

  try {
    const user = await db.user.create({
      username: req.body.username,
      email: req.body.email,
      password_hash: hash,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_joined: req.body.date_joined,
      profile_pic_url: req.body.profile_pic_url,
      blocked: req.body.blocked,
    });
    if(user !== null){
      responseHandler(res, 200 ,user)
    }
  } catch (e) {
    console.log("\n\nCreate user error\n");
    console.log(e);
    if(e.fields.email == req.body.email){
      errorHandler(res, 201,"Invalid Email", e )
    }
    else if(e.fields.PRIMARY == req.body.username){
      errorHandler(res, 202,"Invalid Username", e )
    }
    else{
      errorHandler(res, 500, "Database error", e);
    }
  }
};




/**
 * Find and Update user
 * @param {username: String, etc (refer user model) } req - JSON Request containing fields to update user 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  try {
    const user = await db.user.findByPk(req?.body?.username);
    if(user !== null){
      if(req?.body?.first_name != null) user.first_name = req.body.first_name;
      if(req?.body?.last_name != null) user.last_name = req.body.last_name;
      if(req?.body?.email != null) user.email = req.body.email;
      if(req?.body?.password != null){
        const hash = await argon2.hash(req?.body?.password, { type: argon2.argon2id });
        user.password_hash = hash
      }
      if(req?.body?.profile_pic_url != null) user.profile_pic_url = req.body.profile_pic_url;
      if(req?.body?.blocked != null) user.blocked = req.body.blocked;
      const updatedUser = await user.save();
      console.log("req.body", req.body)
      console.log(updatedUser)
      responseHandler(res, 200, updatedUser)
    }
    else{
      errorHandler(res, 404, "User not found in database")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
    // res.json(e);
  }
};




/**
 * Find and Delete User
 * @param {username: String} req - JSON request object 
 * @param {*} res - JSON response
 */
exports.delete = async (req, res) => {
  try {
    const user = await db.user.findByPk(req?.body?.username);
    if(user !== null){
      await user.destroy();
      responseHandler(res, 200, user, "User Successfully Deleted")
    }
    else{
      errorHandler(res, 404, "User not found in database")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};