const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const auth = require("../middleware/auth");
const { Ride, validateRideDetails } = require('../models/ride');
const {createRide}=require('../services/ride')
// const {
    //     getUniqueId,
    //     addUserUpdated,
    //     isUserExists,
    //     validateLogin,
    //     getUser,
    //     loginPasswordAuthentication,
    // } = require("../services/user");



// const { isUserDataValidate } = require("../models/user");
// const {
//     uploadFile,
//     uploadFileWithParam,
// } = require("../middleware/upload_file");

// const fileUpload = require("express-fileupload");

router.use(express.json());
// router.use(bodyParser.urlencoded({ extended: true }));

// router.use(fileUpload({ useTempFiles: true, tempFileDir: "../image_files" }));



//ride creat route
router.post("/createRide", auth, async(req, res) => {

    delete req.body.userId;
    let {error} = validateRideDetails(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    try {
        let newRide = await createRide(req.body)
        if (!newRide)
            return res.status(400).send("Something went wrong try again latter.");
        return res.status(200).send("Ride added:" + newRide);// After that save the ipc of created ride vehicle
    } catch (ex) {
        return res.status(500).send("something failed!! try again latter:"+ex);
    }
    //res.send("Okay");
});
















// router.post("/login", async(req, res) => {
//     let { error } = await validateLogin(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     let user = await isUserExists(req.body.mobileNumber);
//     if (!user) return res.status(400).send("Invalid mobile number or password");

//     let validPassword = await loginPasswordAuthentication(
//         req.body.password,
//         user.password
//     );
//     if (!validPassword) return res.status(400).send("Invalid email or password");

//     const token = jwt.sign({ userId: user.userId }, config.get("jwtPrivateKey"));

//     return res.header("x-auth-token", token).status(200).send(true);
// });

// router.get("/getUser/:id", auth, async(req, res) => {
//     try {
//         let user = await getUser(req.params.id);
//         if (!user) return res.status(404).send("No users present!!");
//         return res.status(200).send(user);
//     } catch (ex) {
//         console.log("exception");

//     }
// });

module.exports = router;