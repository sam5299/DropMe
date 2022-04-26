const config = require("config");
const express = require("express");
const app = express();
const user = require("./routes/user");
const vehicle = require("./routes/vehicle");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: false,
  })
);
app.use("/user", user);
app.use("/vehicle", vehicle);

if (!config.get("jwtPrivateKey")) {
  console.error(
    "jwtPrivateKey is not set in environment variable's. Cannot start application"
  );
  process.exit(1);
}

//connecting to database
mongoose
  .connect("mongodb+srv://DropMe:Project4@cluster0.psfti.mongodb.net/test")
  .then(() => console.log("Connected to dropme_sample"))
  .catch((err) => console.log("error connecting to database"));

app.listen(3100, () => console.log("connected to server"));
