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
  try {
    let lastId = await User.find({}).estimatedDocumentCount();
    return lastId + 1;
  } catch(ex) {
    return ex;
  }
}

//check if user already present with same input fields
async function isUserExists(mobileNo) {
  try {
    return await User.findOne({ mobileNumber: mobileNo });
  } catch(ex) {
    return ex;
  }
}

//function to get all Users
async function getUser(id) {
  console.log("called getUser");
  try {
    let user = await User.findOne({userId:id}, { _id: 0, userId:0, password:0,__v:0 });
    if (user.length === 0) return "Users not found";
    else return user;
  } catch(ex) {
    return ex;
  }
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

//function to check whather license detail's already present or not
async function isLicenseDetailsPresent(userId) {
  let licenseDetails = await User.find({userId:userId},{licenseNumber:1,licensePhoto:1,_id:0});
  console.log(licenseDetails);
  if(licenseDetails.licenseNumber==null && licenseDetails.licensePhoto==null){
    return false;
  }
  return true;
}

//Joi validation for license Number 
async function validateLicenseNumber(licenseNumber) {
  let joiDrivingLicenseSchema = Joi.object({
    licenseNumber: Joi.string().pattern(/^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/)
  });
  return await joiDrivingLicenseSchema.validate(licenseNumber);
}

//function to update user's licenseNumber and licenseDocument image path
async function updateUserLicenseDetails(userId, licenseNumber, licensePhotoPath) {
  let user = await User.findOne({userId: userId});
  user.licenseNumber = licenseNumber;
  user.licensePhoto = licensePhotoPath;
  return user.save();
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
  validateLicenseNumber,
  updateUserLicenseDetails,
  isLicenseDetailsPresent
};
