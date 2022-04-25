const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/getVehicle", auth, (req, res) => {
  console.log("getVehile called");
  return res.status(200).send("getVehicle called");
});

module.exports = router;
