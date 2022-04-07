const db = require("../database");
const argon2 = require("argon2");
const { QueryTypes } = require('sequelize');
const {errorHandler, responseHandler} = require("../utils");

/**
 * Get all user Logins
 * @param {*} req 
 * @param {*} res - JSON response
 */
exports.all = async (req, res) => {
    try{
      const userLogins = await db.userLoginTable.findAll({
          include: [
            {
              model: db.user,
              required: true,
            },
          ],
          group: ['date','username']
        });
      if(userLogins !== null){
        responseHandler(res, 200, userLogins);
      }
      else {
        errorHandler(res, 404, "Users not found in database");
      }
    }
    catch(e){
      errorHandler(res, 500, "Database Error", e);
    }
  };


/**
 * Create a new user login entry in DB 
 * @param {username: String, date: Date} req - JSON request body 
 * @param {*} res - JSON Response
 */
exports.create = async (req, res) => {
  try {
    const userLogin = await db.userLoginTable.create({
      username: req.body.username,
      date: req.body.date,
    });
    // res.json(user);
    if(userLogin !== null){
      responseHandler(res, 200 ,userLogin);
    }
    else{
      errorHandler(res, 404, "Failed");
    }
  } catch (e) {
      errorHandler(res, 500, "Database error", e);
  }
};


exports.update = async (req, res) => {
  try {
    const userLogin = await db.userLoginTable.findOne({ 
      where: {
       username: req?.body?.username, 
       date: req?.body?.date 
      }
    });
    // Make updates and save and return updated obj
    // res.json(user);
    if(userLogin !== null){
      responseHandler(res, 200 ,userLogin);
    }
    else{
      errorHandler(res, 404, "Failed");
    }
  } catch (e) {
      errorHandler(res, 500, "Database error", e);
  }
};
