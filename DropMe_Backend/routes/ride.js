const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Ride, validateRideDetails } = require('../models/ride');
const {
    createRide,
    getRides,
    getUserRides,
    deleteRide ,
    savePicture,
    getTripRequestList,
    removeTripId,
    reduceAvailableSeats,
} = require('../services/ride');

const {getTripDetails, generateTripToken, calculateTripAmount} = require("../services/trip");
const {validateTripRide} = require("../models/trip_ride");

const { func } = require("joi");
const { addAcceptedTrip } = require("../services/trip_ride");
const { Trip } = require("../models/trip");
const { updateUsedCredit } = require("../services/wallet");
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
    let body = req.body;

    if ( !("source" in body && "destination" in body &&
        "date" in body && "time" in body))
        return res.status(400).send("Please add Source, Destination , Date and Time")

    let Source = inpParams.source;
    let Destination = inpParams.destination;
    let Date = inpParams.date;
    let Time = inpParams.time;
    let seats=inpParams.seats;
    let gender=inpParams.gender;
    try {
        let rides = await getRides(Source, Destination, Date, Time,seats,gender);
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
});

// route to get list of trip who has requsted for ride
router.get('/getTripRequestList/:rid', auth,  async(req, res)=> {
    let tripList = await getTripRequestList(req.params.rid)
    if(!tripList) return res.status(404).send("No requested trip for given ride.");
    let requestedTripList = {};
    console.log(tripList);
    for(element of tripList.requestedTripList) {
        let result = await getTripDetails(element);
        requestedTripList = {...requestedTripList, result }
    }

    return res.status(200).send(requestedTripList);
});

//route to accept/reject trip request
router.post("/acceptRejectTripRequest", auth, async(req, res)=> {
    req.body.status = "Booked";
    req.body.token = generateTripToken();
    delete req.body.userId;
    delete req.body.User;
    console.log(req.body.token);

    let vehicle = await Ride.findOne({_id:req.body.rideId}, {_id:0, Vehicle:1});

    let trip = await Trip.findOne({_id:req.body.tripId},{_id:0,distance:1,User:1, seatRequest:1});

    console.log("trip:"+trip.User);

    amount = await calculateTripAmount(vehicle.Vehicle, trip.distance);
    
    req.body.amount = amount;
    console.log("amount:"+typeof(req.body.amount));
    
    let {error} = validateTripRide(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //return res.status(200).send(req.body);
 
    //accept trip and add tripid and rideid into trip_ride collection
    let result = addAcceptedTrip(req.body);
    if(!result) return res.status(400).send("something went wrong cannot accept trip");
    
    //add trip amount into usedCredit as  trip is booked 
    let updatedWallet = await updateUsedCredit(trip.User,req.body.amount);
    if(!updatedWallet) return res.status("failed to updated balance");

    //update the availableSeats and reduce number of seats for accepted trip
    let updatedAvailableSeat = await reduceAvailableSeats(req.body.rideId, trip.seatRequest ); //write function to reduce availableSeat
    console.log("Updated availableSeat:"+updatedAvailableSeat);

    //remove trip id from requestedTripList in Ride collection
    let rideObj = await removeTripId(req.body.rideId, req.body.tripId);
    return res.status(200).send("Ride accepted:"+rideObj);
} )


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