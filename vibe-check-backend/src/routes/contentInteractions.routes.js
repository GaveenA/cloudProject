module.exports = (express, app) => {
    const controller = require("../controllers/contentInteractions.controller.js");
    const router = express.Router();
  
    // Select all Content Interactions
    router.get("/", controller.all);
  
    // Create a Content Interactions.
    router.post("/", controller.create);
    
    // Update a Content Interactions.
    router.patch("/", controller.update);
  
    // Delete a Content Interactions.
    router.delete("/", controller.delete);
  
    // Add routes to server.
    app.use("/api/content-interactions", router);
  };