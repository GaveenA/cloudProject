module.exports = (express, app) => {
    const controller = require("../controllers/userFriendships.controller.js");
    const router = express.Router();
  
    // Select all friendships.
    router.get("/", controller.all);
  
    // Create a new friendships.
    router.post("/", controller.create);

    // Delete a friendship
    router.delete("/", controller.delete);
  
    // Add routes to server.
    app.use("/api/user-friendships", router);
  };