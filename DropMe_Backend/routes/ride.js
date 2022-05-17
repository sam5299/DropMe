const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Ride, validateRideDetails } = require("../models/ride");
const {
  createRide,
  getCreatedRides,
  getUserRides,
  deleteRide,
  savePicture,
  getTripRequestList,
  removeTripId,
  reduceAvailableSeats,
  getRideDetails,
  getTimeDifference,
} = require("../services/ride");

const {
  getTripDetails,
  generateTripToken,
  calculateTripAmount,
  getAllRequest,
} = require("../services/trip");
const { validateTripRide } = require("../models/trip_ride");

const { func } = require("joi");
const {
  addAcceptedTrip,
  getTripDetailsByRideIdAndStatus,
  getAllBookedRides,
  getRiderHistory,
} = require("../services/trip_ride");
const { Trip } = require("../models/trip");
const { updateUsedCredit, addPenalty } = require("../services/wallet");
const { createNotification } = require("../services/notification");
router.use(express.json());

//ride creat route
router.post("/createRide", auth, async (req, res) => {
  console.log("create ride request body:", req.body);
  let userId = req.body.userId;
  delete req.body.userId;
  let amount = 0;
  if (req.body.rideType == "Paid") {
    amount = await calculateTripAmount(req.body.Vehicle, req.body.distance);
  }
  req.body.amount = parseInt(amount);
  let distance = parseFloat(req.body.distance).toPrecision(3);
  req.body.distance = distance;
  // console.log("body:", req.body);
  let { error } = validateRideDetails(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let newRide = await createRide(req.body);
    if (!newRide)
      return res.status(400).send("Something went wrong try again latter.");
    // After that save the ipc of created ride vehicle
    // savePicture(`${newRide.vehicleNumber}_${userId}`);
    return res.status(200).send(newRide);
  } catch (ex) {
    return res.status(400).send("something failed!! try again latter:" + ex);
  }
});

// get Rides details by Source Destination Date and Time
router.get(
  "/getRides/:source/:destination/:date/:time/:seats/:gender",
  auth,
  async (req, res) => {
    let body = req.params;
    console.log(body);
    if (
      !(
        "source" in body &&
        "destination" in body &&
        "date" in body &&
        "time" in body
      )
    )
      return res
        .status(400)
        .send("Please add Source, Destination , Date and Time");

    let Source = body.source;
    let Destination = body.destination;
    let Date = body.date;
    let Time = body.time;
    let seats = body.seats;
    let gender = body.gender;
    try {
      let rides = await getCreatedRides(
        req.body.User,
        Source,
        Destination,
        Date,
        Time,
        seats,
        gender
      );
      if (rides.length == 0) return res.status(400).send("No rides found");
      return res.status(200).send(rides);
    } catch (ex) {
      return res.status(500).send("something failed!! try again latter:" + ex);
    }
  }
);

//   get Rides of the particular Rider
router.get("/getUserRides", auth, async (req, res) => {
  let id = req.body.User;
  try {
    let rideData = await getUserRides(id);
    console.log(rideData);
    if (rideData.length == 0) return res.status(400).send("No rides found");
    return res.status(200).send(rideData);
  } catch (ex) {
    return res.status(500).send("something failed!! try again latter:" + ex);
  }
});

// route to get list of trip who has requested for ride
router.get("/getTripRequestList/:rid", auth, async (req, res) => {
  let tripList = await getTripRequestList(req.params.rid);
  //console.log("trip requested list:", tripList);
  if (!tripList)
    return res.status(404).send("No requested trip for given ride.");
  let requestedTripList = [];
  //console.log(tripList);
  for (element of tripList.requestedTripList) {
    let result = await getTripDetails(element);
    // requestedTripList = { ...requestedTripList, result };
    requestedTripList.push(result);
  }

  return res.status(200).send(requestedTripList);
});

// get all trip request for the user
router.get("/getAllRequest", auth, async (req, res) => {
  let userId = req.body.User;
  let allRideList = await getUserRides(userId);
  // console.log("All Rides", allRideList);
  //let requestList = await getAllRequest(allRideList);

  //console.log("### final OP", requestList);
  // for (ride in allRideList) {
  //   console.log(ride);
  // }
  return res.status(200).send(await getAllRequest(allRideList));
});

//route to accept trip request
router.post("/acceptTripRequest", auth, async (req, res) => {
  //console.log("@@@", req.body);

  req.body.status = "Booked";
  req.body.token = generateTripToken();
  delete req.body.userId;
  let raiderName = req.body.raiderName;
  delete req.body.raiderName;
  //get vehicle details of ride
  let vehicle = await Ride.findOne(
    { _id: req.body.rideId },
    { _id: 0, Vehicle: 1 }
  );

  //get trip details of trip which gonna be accept
  let trip = await Trip.findOne({ _id: req.body.tripId });

  //calculate trip cost
  amount = await calculateTripAmount(vehicle.Vehicle, trip.distance);
  req.body.amount = amount;
  req.body.date=trip.date;
  //adding RaiderId and PassengerId to req.body
  req.body.RaiderId = req.body.User;
  req.body.PassengerId = trip.User._id.toString();

  delete req.body.User;
  let { error } = validateTripRide(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //accept trip and add tripId,rideId,RaiderId,PassengerId into trip_ride collection
  let result = await addAcceptedTrip(req.body);
  if (!result)
    return res.status(400).send("something went wrong cannot accept trip");

  //add trip amount into usedCredit as  trip is booked
  let updatedWallet = await updateUsedCredit(trip.User, req.body.amount);
  if (!updatedWallet) {
    console.log("failed to update balance.");
    return res.status(400).send("something failed!");
  }

  // create notification to passenger
  let notificationDetails = {
    fromUser: req.body.RaiderId,
    toUser: req.body.PassengerId,
    message: `Your trip request from ${trip.source} to ${trip.destination} is accepted by ${raiderName} `,
  };

  let newNotification = await createNotification(notificationDetails);
  if (!newNotification) {
    console.log("failed to send notification.");
    return res.status(400).send("something failed.");
  }

  //update the availableSeats and reduce number of seats for accepted trip
  let updatedAvailableSeat = await reduceAvailableSeats(
    req.body.rideId,
    trip.seatRequest
  );
  if (!updatedAvailableSeat) {
    console.log("failed to reduce available seats of ride.");
    return res.status(400).send("failed to updated balance");
  }
  //console.log("Updated availableSeat:" + updatedAvailableSeat);

  //remove trip id from requestedTripList in Ride collection
  let rideObj = await removeTripId(req.body.rideId, req.body.tripId);

  return res.status(200).send("Ride accepted");
});

//route to accept/reject trip request
router.put("/rejectTripRequest", auth, async (req, res) => {
  let rideObj = await removeTripId(req.body.rideId, req.body.tripId);
  let notificationDetails = {
    fromUser: req.body.User,
    toUser: req.body.passengerId,
    message: `Your trip request from ${req.body.source} to ${req.body.destination} is rejected by ${req.body.raiderName}`,
  };

  let newNotification = await createNotification(notificationDetails);
  if (!newNotification) {
    console.log("failed to send notification.");
    return res.status(400).send("something failed.");
  }
  return res.status(200).send(rideObj);
});

//route to get all accepted ride request
router.get("/getBookedRides", auth, async (req, res) => {
  let raiderId = req.body.User;
  let bookedRide = await getAllBookedRides(raiderId);
  if (!bookedRide) return res.status(400).send("No rides found");

  return res.status(200).send(bookedRide);
});

// endpoint to cancel ride
router.put("/cancelRide/:rid", auth, async (req, res) => {
  try {
    let ride = await getRideDetails(req.params.rid, req.body.User);
    if (!ride) return res.status(400).send("Invalid ride to delete");

    //get the time difference
    let timeDifference = getTimeDifference(ride.date + ";" + ride.time);
    console.log("time difference:" + timeDifference);

    //first get the list of requests for trip and auto reject it also send notification to user
    ride.requestedTripList.forEach(async (trip) => {
      let userId = await Trip.findOne({ _id: trip });
      let notificationResult = await createNotification({
        fromUser: req.body.User.toString(),
        toUser: userId.User.toString(),
        message: "Trip request rejected!",
      });
      if (!notificationResult) console.log("error while sending notification");
    });

    //second check if is there any trip pending for same ride and if yes get the tid's
    let bookedTrip = await getTripDetailsByRideIdAndStatus(
      req.params.rid,
      "Booked"
    );

    //loop over the bookTrip find tripId.User and update the usedCreditPoint by amount and change status of trip
    bookedTrip.forEach(async (trip) => {
      let notificationResult = await createNotification({
        fromUser: req.body.User.toString(),
        toUser: trip.tripId.User.toString(),
        message: "Your booked trip has been cancelled by rider!",
      });
      if (!notificationResult) console.log("error while sending notification");

      let usedCreditUpdate = await updateUsedCredit(
        trip.tripId.User,
        -trip.amount
      );
      if (!usedCreditUpdate)
        console.log("error while updating the credit balance of User.");

      trip.status = "Cancelled";
      let result = await trip.save();
      if (!result) return console.log("error while changing status of trip");

      //check if cancellation time is below 10hrs if yes apply safety point penalty
      if (timeDifference <= 10) {
        let penalty = trip.amount * 0.1;
        //console.log("penalty");
        let result = await addPenalty(req.body.User, penalty);
        if (!result) console.log("error while applying penalty");
      }
    });
    ride.status = "Cancelled";
    // ride.requestedTripList=[];
    // ride.requestedUserList=[];
    let result = await ride.save();
    if (!result)
      return res
        .status(400)
        .send("error while cancelling ride, cannot cancel ride.");
    return res.status(200).send("Ride cancelled successfully");
  } catch (ex) {
    console.log("Exception in ride route" + ex);
    return res.status(500).send("Something failed");
  }
});

//route to get all history of raider
router.get("/getRaiderHistory", auth, async (req, res) => {
  let raiderId = req.body.User;
  let riderHistory = await getRiderHistory(raiderId);
  if (!riderHistory) return res.status(400).send("No history found");

  return res.status(200).send(riderHistory);
});

//

// get Ride details by its id

// router.put('updateRide/:id', auth, async(req, res) => {
//     let rideId = req.params.id;

// })

// Delete a ride by its id
router.delete("/deleteRide/:id", auth, async (req, res) => {
  let rideId = req.params.id;
  try {
    let result = await deleteRide(rideId);
    if (result) return res.status(200).send("Ride deleted");
    else return res.status(400).send("Ride not found");
  } catch (ex) {
    return res.status(500).send("something failed!! try again later:" + ex);
  }
});

module.exports = router;
