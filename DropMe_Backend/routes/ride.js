const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const auth = require("../middleware/auth");
const { Ride, validateRideDetails } = require('../models/ride');
const {
    createRide,
    getRides,
    getUserRides
} = require('../services/ride');
const { route } = require("./user");
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



//ride creat route
router.post("/createRide", auth, async(req, res) => {

    delete req.body.userId;
    let { error } = validateRideDetails(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    try {
        let newRide = await createRide(req.body)
        if (!newRide)
            return res.status(400).send("Something went wrong try again latter.");
        return res.status(200).send("Ride added:" + newRide); // After that save the ipc of created ride vehicle
    } catch (ex) {
        return res.status(500).send("something failed!! try again latter:" + ex);
    }
    //res.send("Okay");
});

router.get('/getRides', auth, async(req, res) => {
    let Source = req.body.Source;
    let Destination = req.body.Destination;
    let Date = req.body.Date;
    let Time = req.body.Time;
    // console.log("@@", req.body);
    if (Source == "" || Destination == "" || Date == "" || Time == "")
        return res.status(400).send("Please add Source, Destination , Date and Time")
    try {
        let rides = await getRides(Source, Destination, Date, Time);
        if (rides.length == 0)
            return res.status(400).send("No rides found");
        return res.status(200).send(rides);
    } catch (ex) {
        return res.status(500).send("something failed!! try again latter:" + ex);
    }
})

router.get('/getUserRides/:id', auth, async(req, res) => {
    let id = req.params.id
    try {
        let rideData = await getUserRides(id)
        if (rideData.length == 0)
            return res.status(400).send("No rides found");
        return res.status(200).send(rideData);
    } catch (ex) {
        return res.status(500).send("something failed!! try again latter:" + ex);
    }

})


router.put('updateRide/:id', auth, async(req, res) => {
    let rideId = req.params.id;

})

module.exports = router;