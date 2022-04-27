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
    getUserRides,
    deleteRide ,
    savePicture
} = require('../services/ride');
const { func } = require("joi");
router.use(express.json());



//ride creat route
router.post("/createRide", auth, async(req, res) => {
    let userId=req.body.userId;
    delete req.body.userId;
    let { error } = validateRideDetails(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    try {
        let newRide = await createRide(req.body)
        if (!newRide)
            return res.status(400).send("Something went wrong try again latter.");
            // After that save the ipc of created ride vehicle
        savePicture(`${newRide.vehicleNumber}_${userId}`)
        return res.status(200).send(newRide); 
    } catch (ex) {
        return res.status(400).send("something failed!! try again latter:" + ex);
    }
});


// get Rides details by Source Destination Date and Time
router.get('/getRides', auth, async(req, res) => {
    let inpParams = req.body;

    if ( !("Source" in inpParams && "Destination" in inpParams &&
        "Date" in inpParams && "Time" in inpParams))
        return res.status(400).send("Please add Source, Destination , Date and Time")

    let Source = inpParams.Source;
    let Destination = inpParams.Destination;
    let Date = inpParams.Date;
    let Time = inpParams.Time;

    try {
        let rides = await getRides(Source, Destination, Date, Time);
        if (rides.length == 0)
            return res.status(400).send("No rides found");
        return res.status(200).send(rides);
    } catch (ex) {
        return res.status(500).send("something failed!! try again latter:" + ex);
    }
})


//   get Rides of the particular Rider
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

// get Ride details by its id

// router.put('updateRide/:id', auth, async(req, res) => {
//     let rideId = req.params.id;

// })


// Delete a ride by its id
router.delete('/deleteRide/:id', auth, async(req, res) => {
    let rideId = req.params.id;
    try {
        let result = await deleteRide(rideId)
        if (result) return res.status(200).send("Ride deleted");
        else return res.status(400).send("Ride not found");
    } catch (ex) {
        return res.status(500).send("something failed!! try again later:" + ex);
    }

})




module.exports = router;