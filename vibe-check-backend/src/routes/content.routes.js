module.exports = (express, app) => {
  const controller = require("../controllers/content.controller.js");
  const router = express.Router();

  // Select all content (posts and comments) via GET.
  router.get("/", controller.all);

  // Create new Content via POST .
  router.post("/", controller.create);
  
  // Update Content via PATCH
  router.patch("/", controller.update);

  // Delete Comtent via DELETE
  router.delete("/", controller.delete);

  // Get Content by ID
  router.get("/getByID",controller.getPostByID);

  // GET all Content with logged user's interaction, username passed as query param
  router.get("/getAllPostsWithLoggedUserInteractions", controller.getAllPostsWithLoggedUserInteractions);

  // Add routes to server.
  app.use("/api/content", router);
};