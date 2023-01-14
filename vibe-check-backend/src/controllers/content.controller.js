const db = require("../database");
const { errorHandler, responseHandler } = require("../utils");

/**
 * Returns all posts from database 
 * @param {*} req 
 * @param {*} res - JSON response
 */
exports.all = async (req, res) => {
  try {
    const content = await db.content.findAll();
    if (content !== null) {
      responseHandler(res, 200, content);
    } else {
      errorHandler(res, 404, "Content could not be found");
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};

/**
 * Returns the Post (by ID) and Relavant Comments with Content interactions for user specified in req param
 * Used in Create Post and Update Post functions (export)
 * @param {id: Int, username: String } req  - post ID & username (for content interactions)
 * @returns 
 */
const getPostByID = async (req) => {
  const contents = await db.content.findAll({
    where: {
      id: { [db.Op.eq]: req?.id },
    },
    attributes: {
      include: [
        [
          db.sequelize.literal(`(
        SELECT COUNT(*)
        FROM contentInteractions as inter
        WHERE
            content.id = inter.content_id AND inter.interaction = 1
    )`),
          "likes_count",
        ],
        [
          db.sequelize.literal(`(
        SELECT COUNT(*)
        FROM contentInteractions as inter
        WHERE
            content.id = inter.content_id AND inter.interaction = 0
      )`),
          "dislikes_count",
        ],
        [
          db.sequelize.literal(`(
          SELECT inter.interaction
          FROM contentInteractions as inter
          WHERE
              content.id = inter.content_id AND 
              inter.username = '${req?.username}'
        )`),
          "currUserInteraction",
        ],
      ],
    },
    include: [
      {
        model: db.contentInteractions,
        as: "likes",
        required: false,
        where: {
          interaction: { [db.Op.eq]: true },
        },
      },
      {
        model: db.contentInteractions,
        as: "dislikes",
        required: false,
        where: {
          interaction: { [db.Op.eq]: false },
        },
      },
      {
        model: db.user,
        as: "author",
        required: true,
      },
      {
        model: db.content,
        as: "comments",
        required: false,
        attributes: {
          include: [
            [
              db.sequelize.literal(`(
            SELECT COUNT(*)
            FROM contentInteractions as inter
            WHERE
                comments.id = inter.content_id AND inter.interaction = 1
        )`),
              "likes_count",
            ],
            [
              db.sequelize.literal(`(
            SELECT COUNT(*)
            FROM contentInteractions as inter
            WHERE
                comments.id = inter.content_id AND inter.interaction = 0
          )`),
              "dislikes_count",
            ],
            [
              db.sequelize.literal(`(
              SELECT inter.interaction
              FROM contentInteractions as inter
              WHERE
                  comments.id = inter.content_id AND 
                  inter.username = '${req?.username}'
            )`),
              "currUserInteraction",
            ],
          ],
        },
        include: [
          {
            model: db.contentInteractions,
            as: "likes",
            required: false,
            where: {
              interaction: { [db.Op.eq]: true },
            },
          },
          {
            model: db.contentInteractions,
            as: "dislikes",
            required: false,
            where: {
              interaction: { [db.Op.eq]: false },
            },
          },
          {
            model: db.user,
            as: "author",
            required: true,
          },
        ],
      },
    ],
  });

  if (contents !== null) {
    return contents;
  } else {
    return null;
  }
};



/**
 * Create a post in the database.
 * @param {*} req - JSON request body - must contain essential post fields to create post (refer content model)
 * @param {*} res - JSON response
 */
exports.create = async (req, res) => {
  try {
    const content = await db.content.create({
      parent_id: req?.body?.parent_id,
      username: req?.body?.username,
      date: req?.body?.date,
      image_url: req?.body?.image_url,
      content_body: req?.body?.content_body,
      deleted_by_admin: req?.body?.deleted_by_admin,
    });
    if (content !== null) {
      newReq = {
        id: content.id,
        username: content.username,
      };
      const postInDb = await getPostByID(newReq);
      if (postInDb !== null) {
        console.log(postInDb);
        responseHandler(res, 200, postInDb);
      } else {
        responseHandler(res, 200, content);
      }
    } else {
      errorHandler(res, 404, "Content could not be created");
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};


/**
 * Gets all Posts in Database
 * @param {*} req - JSON request body
 * @param {*} res - JSON response
 */
exports.all = async (req, res) => {
  try {
    const contents = await db.content.findAll({
      where: {
        parent_id: { [db.Op.eq]: null },
      },
      attributes: {
        include: [
          [
            db.sequelize.literal(`(
          SELECT COUNT(*)
          FROM contentInteractions as inter
          WHERE
              content.id = inter.content_id AND inter.interaction = 1
      )`),
            "likes_count",
          ],
          [
            db.sequelize.literal(`(
          SELECT COUNT(*)
          FROM contentInteractions as inter
          WHERE
              content.id = inter.content_id AND inter.interaction = 0
        )`),
            "dislikes_count",
          ],
        ],
      },
      include: [
        {
          model: db.contentInteractions,
          as: "likes",
          required: false,
          where: {
            interaction: { [db.Op.eq]: true },
          },
          // attributes: {
          //   include: [
          //     [db.sequelize.fn('COUNT', db.sequelize.col('likes.interaction')), 'total_likes']
          //   ]
          // },

          // separate:true
        },
        {
          model: db.contentInteractions,
          as: "dislikes",
          required: false,
          where: {
            interaction: { [db.Op.eq]: false },
          },
          // attributes: {
          //   include: [
          //     [db.sequelize.fn('COUNT', db.sequelize.col('dislikes.interaction')), 'total_dislikes']
          //   ]
          // }
        },
        {
          model: db.user,
          as: "author",
          required: true,
        },
        {
          model: db.content,
          as: "comments",
          required: false,
          attributes: {
            include: [
              [
                db.sequelize.literal(`(
              SELECT COUNT(*)
              FROM contentInteractions as inter
              WHERE
                  comments.id = inter.content_id AND inter.interaction = 1
          )`),
                "likes_count",
              ],
              [
                db.sequelize.literal(`(
              SELECT COUNT(*)
              FROM contentInteractions as inter
              WHERE
                  comments.id = inter.content_id AND inter.interaction = 0
            )`),
                "dislikes_count",
              ],
            ],
          },
          include: [
            {
              model: db.contentInteractions,
              as: "likes",
              required: false,
              where: {
                interaction: { [db.Op.eq]: true },
              },
              // attributes: {
              //   include: [
              //     [db.sequelize.fn('COUNT', db.sequelize.col('likes.interaction')), 'total_likes']
              //   ]
              // }
            },
            {
              model: db.contentInteractions,
              as: "dislikes",
              required: false,
              where: {
                interaction: { [db.Op.eq]: false },
              },
              // attributes: {
              //   include: [
              //     [db.sequelize.fn('COUNT', db.sequelize.col('dislikes.interaction')), 'total_dislikes']
              //   ]
              // }
            },
            {
              model: db.user,
              as: "author",
              required: true,
            },
          ],
        },
      ],
    });

    if (contents !== null) {
      responseHandler(res, 200, contents);
    } else {
      errorHandler(res, 404, "Content not found in database");
    }
    // res.json(contents);
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};


/**
 * Update a post in the database.
 * @param {id: Int, body: String etc (refer content model) } req - JSON request body 
 *                                 - must contain essential post fields to update post (refer content model)
 *                                 - id is mandatory in post request body as its the primary key
 * @param {*} res - JSON response
 */
exports.update = async (req, res) => {
  try {
    const content = await db.content.findByPk(req?.body?.id);
    if (content !== null) {
      if (req?.body?.image_url != null) content.image_url = req.body.image_url;
      if (req?.body?.content_body != null)
        content.content_body = req.body.content_body;
      if (req?.body?.deleted_by_admin != null)
        content.deleted_by_admin = req.body.deleted_by_admin;
      await content.save();
      // responseHandler(res, 200, content)
      newReq = {
        id: content.id,
        username: content.username,
      };
      const postInDb = await getPostByID(newReq);
      if (postInDb !== null) {
        console.log(postInDb);
        responseHandler(res, 200, postInDb);
      } else {
        responseHandler(res, 200, content);
      }
    } else {
      errorHandler(res, 404, "Content not found in database");
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};


/**
 * Delete a post in the database.
 * @param {*} req - JSON request body - must contain 'id' in post request body as its the primary key
 * @param {*} res - JSON response
 */
exports.delete = async (req, res) => {
  try {
    const content = await db.content.findByPk(req?.body?.content_id);
    if (content !== null) {
      await content.destroy();
      responseHandler(res, 200, "Content Successfully Deleted");
    } else {
      errorHandler(res, 404, "Content not found in database");
    }
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};



/**
 * Returns the Post (by ID) and Relavant Comments 
 * @param {id: Int - as query param} req  - post ID as query param
 * @param {*} res - response JSON
 * @returns 
 */
exports.getPostByID = async (req, res) => {
  const contents = await db.content.findAll({
    where: {
      id: { [db.Op.eq]: req?.query?.id },
    },
    attributes: {
      include: [
        [
          db.sequelize.literal(`(
        SELECT COUNT(*)
        FROM contentInteractions as inter
        WHERE
            content.id = inter.content_id AND inter.interaction = 1
    )`),
          "likes_count",
        ],
        [
          db.sequelize.literal(`(
        SELECT COUNT(*)
        FROM contentInteractions as inter
        WHERE
            content.id = inter.content_id AND inter.interaction = 0
      )`),
          "dislikes_count",
        ],
        [
          db.sequelize.literal(`(
          SELECT inter.interaction
          FROM contentInteractions as inter
          WHERE
              content.id = inter.content_id AND 
              inter.username = '${req?.query?.username}'
        )`),
          "currUserInteraction",
        ],
      ],
    },
    include: [
      {
        model: db.contentInteractions,
        as: "likes",
        required: false,
        where: {
          interaction: { [db.Op.eq]: true },
        },
      },
      {
        model: db.contentInteractions,
        as: "dislikes",
        required: false,
        where: {
          interaction: { [db.Op.eq]: false },
        },
      },
      {
        model: db.user,
        as: "author",
        required: true,
      },
      {
        model: db.content,
        as: "comments",
        required: false,
        attributes: {
          include: [
            [
              db.sequelize.literal(`(
            SELECT COUNT(*)
            FROM contentInteractions as inter
            WHERE
                comments.id = inter.content_id AND inter.interaction = 1
        )`),
              "likes_count",
            ],
            [
              db.sequelize.literal(`(
            SELECT COUNT(*)
            FROM contentInteractions as inter
            WHERE
                comments.id = inter.content_id AND inter.interaction = 0
          )`),
              "dislikes_count",
            ],
            [
              db.sequelize.literal(`(
              SELECT inter.interaction
              FROM contentInteractions as inter
              WHERE
                  comments.id = inter.content_id AND 
                  inter.username = '${req?.query?.username}'
            )`),
              "currUserInteraction",
            ],
          ],
        },
        include: [
          {
            model: db.contentInteractions,
            as: "likes",
            required: false,
            where: {
              interaction: { [db.Op.eq]: true },
            },
          },
          {
            model: db.contentInteractions,
            as: "dislikes",
            required: false,
            where: {
              interaction: { [db.Op.eq]: false },
            },
          },
          {
            model: db.user,
            as: "author",
            required: true,
          },
        ],
      },
    ],
  });

  if (contents !== null) {
    responseHandler(res, 200, contents);
  } else {
    errorHandler(res, 404, "Content not found in database");
  }
};


/**
 * Getting all posts from DB with the specified User's content interactions for each post and comment
 * User for which content interactions must be retrieved should be specified in query params
 * @param {username: String - as query param} req - Query Params with username (for user who's content interactions must be added - 
 *                  logged user from frontend)
 * @param {*} res - JSON response
 */
exports.getAllPostsWithLoggedUserInteractions = async (req, res) => {
  try {
    const contents = await db.content.findAll({
      where: {
        parent_id: { [db.Op.eq]: null },
      },
      order: db.sequelize.literal('content.id ASC'),

      attributes: {
        include: [
          [
            db.sequelize.literal(`(
            SELECT COUNT(*)
            FROM contentInteractions as inter
            WHERE
                content.id = inter.content_id AND inter.interaction = 1
            )`),
            "likes_count",
          ],
          [
            db.sequelize.literal(`(
          SELECT COUNT(*)
          FROM contentInteractions as inter
          WHERE
              content.id = inter.content_id AND inter.interaction = 0
            )`),
            "dislikes_count",
          ],
          [
            db.sequelize.literal(`(
          SELECT inter.interaction
          FROM contentInteractions as inter
          WHERE
              content.id = inter.content_id AND 
              inter.username = '${req?.query?.username}'
            )`),
            "currUserInteraction",
          ],
        ],
      },
      include: [
        {
          model: db.contentInteractions,
          as: "likes",
          required: false,
          where: {
            interaction: { [db.Op.eq]: true },
          },
        },
        {
          model: db.contentInteractions,
          as: "dislikes",
          required: false,
          where: {
            interaction: { [db.Op.eq]: false },
          },
        },
        {
          model: db.user,
          as: "author",
          required: true,
        },
        {
          model: db.content,
          as: "comments",
          required: false,
          attributes: {
            include: [
              [
                db.sequelize.literal(`(
              SELECT COUNT(*)
              FROM contentInteractions as inter
              WHERE
                  comments.id = inter.content_id AND inter.interaction = 1
              )`),
                "likes_count",
              ],
              [
                db.sequelize.literal(`(
              SELECT COUNT(*)
              FROM contentInteractions as inter
              WHERE
                  comments.id = inter.content_id AND inter.interaction = 0
                  )`),
                "dislikes_count",
              ],
              [
                db.sequelize.literal(`(
                SELECT inter.interaction
                FROM contentInteractions as inter
                WHERE
                    comments.id = inter.content_id AND 
                    inter.username = '${req?.query?.username}'
                  )`),
                "currUserInteraction",
              ],
            ],
          },
          include: [
            {
              model: db.contentInteractions,
              as: "likes",
              required: false,
              where: {
                interaction: { [db.Op.eq]: true },
              },
            },
            {
              model: db.contentInteractions,
              as: "dislikes",
              required: false,
              where: {
                interaction: { [db.Op.eq]: false },
              },
            },
            {
              model: db.user,
              as: "author",
              required: true,
            },
          ],
        },
      ],
    });

    if (contents !== null) {
      responseHandler(res, 200, contents);
    } else {
      errorHandler(res, 404, "Content not found in database");
    }
    // res.json(contents);
  } catch (e) {
    errorHandler(res, 500, "Database error", e);
  }
};
