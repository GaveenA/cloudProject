const db = require("../database");
const {errorHandler, responseHandler} = require("../utils");


/**
 * Select all user friendships from the database.
 * @param {*} req 
 * @param {*} res - JSON Response 
 */
exports.all = async (req, res) => {
  try{
    const userFriendships = await db.userFriendships.findAll();
    if(userFriendships !== null){
      responseHandler(res, 200, userFriendships)
    }
    else{
      errorHandler(res, 404, "User Friendships cannot be found")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
    // res.json("major break");
  }
};

/**
 * Create a new user Friendship between requester and recipient 
 * @param {requester: String (username) , recipient: String (username)} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {
  try{
    const userFriendships = await db.userFriendships.create({
      requester: req?.body?.requester,
      recipient: req?.body?.recipient,
    });
    if(userFriendships !== null){
      responseHandler(res, 200, userFriendships)
    }
    else{
      errorHandler(res, 404, "User Friendships could not be created")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};


exports.delete = async (req, res) => {
  try {
    const userFriendships = await db.userFriendships.findOne({
        where: {
          requester: req?.body?.requester,
          recipient: req?.body?.recipient,
        }
    });
    if(userFriendships !== null){
      await userFriendships.destroy();
      responseHandler(res, 200, "User Friendship successfully deleted")
    }
    else{
      errorHandler(res, 404, "User Friendship not found in database")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};