module.exports = (express, app) => {
  const controller = require("../controllers/userLogintable.controller.js");
  const router = express.Router();

  // Select all login entries.
  router.get("/", controller.all);

  // Create a new login entry.
  router.post("/", controller.create);

  // Update a login entry..
  router.patch("/", controller.update);

  // Add routes to server.
  app.use("/api/userLoginTable", router);
};
