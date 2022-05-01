const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getUniqueId,
  addUserUpdated,
  isUserExists,
  validateLogin,
  getUser,
  loginPasswordAuthentication,
  generateRandomPassword
} = require("../services/user");
const { isUserDataValidate } = require("../models/user");
const {
  uploadFile,
  uploadFileWithParam,
} = require("../middleware/upload_file");

const { createWallet }=require('../services/wallet')
const {getNotification}=require('../services/notification')
const fileUpload = require("express-fileupload");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileUpload({ useTempFiles: true, tempFileDir: "../image_files" }));

//register user route
router.post("/register", async (req, res) => {
  //console.log(req.body);
  try {
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
      let walletResult=await createWallet(user._id);
      //console.log(walletResult);
      return res.status(200).send("User added:" + user);
    } catch (ex) {
      if (ex.name === "ValidationError") {
        console.error(Object.values(ex.errors).map((val) => val.message));
      }
      return res.status(400).send("Please fill all the details:"+ex);
    }
  } catch(ex) {
    res.status(500).send("something failed!! try again latter");
  }
});

//endpoint for user login
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

  //console.log("User details:"+user._id);
  const token = jwt.sign({ userId: user.userId , User:user._id }, config.get("jwtPrivateKey"));
  //console.log(token);
  //  let notifications=await getNotification(user._id)
   // if(notifications)console.log("@@@"+notifications);
  return res.header("x-auth-token", token).status(200).send(true);
});

//endpoint for forgot password
router.put('/forgotPassword', async(req, res)=> {
  if(!req.body.mobileNumber) return res.status(404).send("mobileNumber is require");

   let user = await isUserExists(req.body.mobileNumber);
   if(!user) return res.status(400).send("Invalid detail's");
    
   let newPassword = await generateRandomPassword();
   console.log(newPassword);
   return res.status(200).send("new password:"+newPassword);
})

router.get("/getUser",auth, async (req, res) => {
  try {
    let user = await getUser(req.body.userId);
    if(!user) return res.status(404).send("No users present!!");
    return res.status(200).send(user);
  } catch(ex) {
    console.log("exception");

  }
});

module.exports = router;
