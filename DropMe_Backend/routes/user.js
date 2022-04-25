const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const {
  getUniqueId,
  addUserUpdated,
  isUserExists,
  validateLogin,
  loginPasswordAuthentication,
} = require("../services/user");
const { isUserDataValidate } = require("../models/user");
const {
  uploadFile,
  uploadFileWithParam,
} = require("../middleware/upload_file");

const fileUpload = require("express-fileupload");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileUpload({ useTempFiles: true, tempFileDir: "../image_files" }));

//register user route
router.post("/register", async (req, res) => {
  //console.log(req.body);
  let userId = await getUniqueId();
  req.body.userId = userId;
  req.body.profile = " ";

  let { error } = await isUserDataValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await isUserExists(req.body.mobileNumber);
  if (user)
    return res
      .status(400)
      .send("You are already registered! try Login or forgot password.");

  try {
    user = await addUserUpdated(req);
    if (!user)
      return res.status(400).send("Something went wrong try again latter.");
    return res.status(200).send("User added:" + user);
  } catch (ex) {
    if (ex.name === "ValidationError") {
      console.error(Object.values(ex.errors).map((val) => val.message));
    }
    return res.status(400).send("Please fill all the details");
  }
});

router.post("/login", async (req, res) => {
  let { error } = await validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await isUserExists(req.body.mobileNumber);
  if (!user) return res.status(400).send("Invalid mobile number or password");

  let validPassword = await loginPasswordAuthentication(
    req.body.password,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = jwt.sign({ userId: user.userId }, config.get("jwtPrivateKey"));

  return res.header("x-auth-token", token).status(200).send(true);
});

router.get("/getUser", async (req, res) => {
  let user = await getUser();
  return res.status(200).send(user);
});

module.exports = router;
