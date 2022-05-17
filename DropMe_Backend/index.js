const config = require("config");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const user = require("./routes/user");
const vehicle = require("./routes/vehicle");
const ride = require("./routes/ride");
const trip = require("./routes/trip");
const wallet = require("./routes/wallet");
const walletHistory = require("./routes/walletHistory");
const notification = require("./routes/notification");
const map = require("./routes/map");

app.use(bodyParser.json({ limit: "50mb" })); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(helmet());

app.use("/user", user);
app.use("/vehicle", vehicle);
app.use("/ride", ride);
app.use("/wallet", wallet);
app.use("/walletHistory", walletHistory);
app.use("/trip", trip);
app.use("/notification", notification);
app.use("/map", map);

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
  .catch((err) => console.log("error connecting to database:", err));

app.listen(3100, () => console.log("connected to server"));
