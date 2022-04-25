//function to add new user
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const fileUpload = require("express-fileupload");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileUpload({ useTempFiles: true, tempFileDir: "../image_files/" }));

function uploadFileNew(req, docType, id, docName) {
  if (!req.files || Object.keys(req.files).length === 0) {
    let filepath = "./image_files/userProfile.webp";
    return filepath;
  } else {
    let filename = `${docType}_${id}_${docName}.jpg`;
    let filepath = "./image_files/" + filename;
    let profile = req.files.profile;
    profile.mv(filepath, function (err) {
      if (err) return "./image_files/userProfile.webp"; //default filepath
    });
    console.log("final path:" + filepath);
    return filepath;
  }
}

module.exports = { uploadFileNew };
