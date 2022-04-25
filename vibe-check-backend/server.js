const express = require("express");
const cors = require("cors");
const db = require("./src/database");

// Database will be sync'ed in the background.
db.sync();

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


/**
 * References: 
 * The VibeCheck Full stack application was not completly developed during Cloud Computing Assignment 1 time frame. 
 * The inception of this VibeCheck Application was during Further Web Programming COSC2758, a class that I Hewa Annakkage Gaveen Amarapala (s3766914) undertook in
  Semester 2 - 2021. During this (FWP) course I developed the VibeCheck fullstack application as part of course requirements, 
  and when  I undertook Cloud Computing in Semester 1 2022 i thoght it was the perfect oppertunity for me to deploy my VibeCheck Application to the cloud, 
  as I am very passionate about this Application, which I consider to be one of my biggest wins as a Software Enginner, and a project I'm very proud of. 
 */