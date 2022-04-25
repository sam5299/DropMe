const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//multer with whole configuration for saving images into image_files folder.
const { User } = require("../models/user");
const { uploadFileNew } = require("../middleware/upload_file");
const fileUpload = require("express-fileupload");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileUpload({ useTempFiles: true, tempFileDir: "../image_files" }));

//password hashing function
async function encryptPassword(password) {
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

//get unique id for newly registering user.
async function getUniqueId() {
  let lastId = await User.find({}).estimatedDocumentCount();
  return lastId + 1;
}

//check if user already present with same input fields
async function isUserExists(mobileNo) {
  return await User.findOne({ mobileNumber: mobileNo });
}

//function to get all Users
async function getUser() {
  console.log("called getUser");
  let user = await User.find({}, { _id: 0, profile: 0 });
  if (user.length === 0) return "Users not found";
  else return user;
}

//addUser updated function
async function addUserUpdated(req) {
  let path = uploadFileNew(req, "User", req.body.name, "Profile");
  req.body.profile = path;
  req.body.password = await encryptPassword(req.body.password);
  const newUser = new User(req.body);
  return await newUser.save();
}

//method for validating input while login
async function validateLogin(loginData) {
  let schema = Joi.object({
    mobileNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: Joi.string().required(),
  });
  return await schema.validate(loginData);
}

//authenticate user for login
async function loginPasswordAuthentication(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  getUniqueId,
  isUserExists,
  getUser,
  addUserUpdated,
  validateLogin,
  loginPasswordAuthentication,
};
