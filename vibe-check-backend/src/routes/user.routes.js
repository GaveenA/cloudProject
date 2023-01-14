module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Get all users.
  router.get("/", controller.all);

  //Get all users a requestor can follow.
  router.post("/getToFollow", controller.getToFollow);


  //Get the following of a user.
  router.post("/following", controller.currentFollowing);

  //Get all followers of a user.
  router.post("/followers", controller.currentFollowers);


  // Get a single user with id.
  router.get("/select/:username", controller.one);

  // Get one user from the database if username and password are a match.
  router.get("/login", controller.login);


  // Create a new user.
  router.post("/", controller.create);

  // Update a user.
  router.patch("/", controller.update);

  // Delete a user.
  router.delete("/", controller.delete);


  // Add routes to server.
  app.use("/api/users", router);
};
