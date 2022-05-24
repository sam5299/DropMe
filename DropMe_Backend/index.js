const config = require("config");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
//const http = require("http");
//const { Server } = require("socket.io");
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

//const server = http.createServer(app);

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
  .connect("mongodb+srv://DropMe:Project4@cluster0.psfti.mongodb.net/test3")
  .then(() => console.log("Connected to dropme_sample"))
  .catch((err) => console.log("error connecting to database:", err));

//creating Server for socket.io
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", //replace origin with frontend server url
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`user connected ${socket.id}`);

//   socket.on("join_trip", (data) => {
//     console.log("joining trip");
//     socket.join(data);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.tripRideObj).emit("receive_message", data);
//   });
// });

app.listen(3100, () => console.log("connected to server"));
