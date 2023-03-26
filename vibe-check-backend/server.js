const express = require("express");
const cors = require("cors");
const db = require("./src/database");
require('dotenv').config();
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_DIALECT);

// Database will be sync'ed in the background.

try{
  db.sync();
}catch(e){
  console.log(e);
}

const app = express();

// Parse requests of content-type - application/json.
app.use(express.json());

// Add CORS suport.
app.use(cors());

// Simple Hello World route.
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Add user routes.
require("./src/routes/user.routes.js")(express, app);
require("./src/routes/content.routes.js")(express, app);
require("./src/routes/contentInteractions.routes.js")(express, app);
require("./src/routes/userFriendships.routes.js")(express, app);
require("./src/routes/userLoginTable.routes.js")(express, app);

// Set port, listen for requests.
const PORT = 3306;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
