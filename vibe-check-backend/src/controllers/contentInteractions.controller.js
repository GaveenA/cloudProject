const db = require("../database");
const {errorHandler, responseHandler} = require("../utils");

/**
 * Get all content interactions
 * @param {*} req 
 * @param {*} res - JSON Response
 */
exports.all = async (req, res) => {
  try{
    const contentInteractions = await db.contentInteractions.findAll();
    if(contentInteractions !== null){
      responseHandler(res, 200, contentInteractions)
    }
    else{
      errorHandler(res, 404, "Content interactions could not be found")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
    // res.json("major break");
  }
};


/**
 * Create new Content Interaction
 * @param {content_id: Int, username: String, interaction: Boolean } req - JSON Request Body
 * @param {*} res - JSON Response
 */
exports.create = async (req, res) => {
  try{
    const contentInteraction = await db.contentInteractions.create({
      content_id: req.body.content_id,
      username: req.body.username,
      interaction: req.body.interaction
    });
    if(contentInteraction !== null){
      responseHandler(res, 200, contentInteraction)
    }
    else{
      errorHandler(res, 404, "Content interaction could not be created")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};


/**
 * Update exisitng Content Interaction 
 * @param {content_id: Int, username: String } req - JSON Request Body
 * @param {*} res - JSON Response
 */
exports.update = async (req, res) => {
  try {
    const contentInteraction = await db.contentInteractions.findOne({
        where: {
            content_id:req?.body?.content_id, 
            username: req?.body?.username
        }
    });
    if(contentInteraction !== null){
      if(req?.body?.interaction != null) contentInteraction.interaction = req.body.interaction;
      await contentInteraction.save();
      responseHandler(res, 200, contentInteraction)
    }
    else{
      errorHandler(res, 404, "Content to update not found in database")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};



/**
 * Delete exisitng Content Interaction 
 * @param {content_id: Int, username: String } req - JSON Request Body
 * @param {*} res - JSON Response
 */
exports.delete = async (req, res) => {
  try {
    const contentInteraction = await db.contentInteractions.findOne({
        where: {
            content_id:req?.body?.content_id, 
            username: req?.body?.username
        }
    });
    if(contentInteraction !== null){
      await contentInteraction.destroy();
      responseHandler(res, 200, "Content interaction successfully deleted")
    }
    else{
      errorHandler(res, 404, "Content not found in database")
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};