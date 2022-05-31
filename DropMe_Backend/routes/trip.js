const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { validateTrip } = require("../models/trip");
const { getRides, addTripRequest, convertToDate } = require("../services/ride");
const { requestRide } = require("../services/trip");
const { getWallet, updateUsedCredit } = require("../services/wallet");
const { getUser } = require("../services/user");
router.use(express.json());
const { Ride } = require("../models/ride");
const { createNotification, sendPushNotification } = require("../services/notification");
const {
  getAllBookedTrips,
  getPassengerHistory,
  deleteBookedTrip,
  getTripRideByTripId,
  addRating,
  setRating,
  updateTripStatus,
} = require("../services/trip_ride");

//endpoint to search riders who are travelling on route passenger searching for
router.get("/searchForRide", auth, async (req, res) => {
  delete req.body.userId;
  let { error } = validateTrip(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // let userObj= await User.findOne({_id:req.body.userId});
  let userObj = await getUser(req.body.User);
  console.log("User:" + userObj);
  let gender = userObj.gender;
  let rides = await getRides(
    req.body.source,
    req.body.destination,
    req.body.date,
    req.body.time,
    req.body.seatRequest,
    gender
  );
  return res.status(200).send("searchForRide called and result:" + rides);
});

//route to request a rider for his ride by passenger
router.post("/requestRide", auth, async (req, res) => {
  delete req.body.userId;
  let rideId = req.body.rideId;
  let notificationToken = req.body.notificationToken;
  delete req.body.rideId;
  delete req.body.notificationToken;
  // console.log("body for request ride:", req.body);
  console.log("Sending trip request..");
  let { error } = validateTrip(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //console.log("USER:" + req.body.User);

  //check if passenger has sufficient balance for booking ride.
  let balance = await getWallet(req.body.User);
  // console.log("balance:" + balance);
  // console.log("ride amount:" + req.body.amount);
  //return res.status(400).send("testing error");
  if (balance.creditPoint < req.body.amount + balance.usedCreditPoint)
    return res
      .status(400)
      .send(
        "You  have insufficient credit points to request for this trip. Please add credit point and try again."
      );

  let requestedRide = await requestRide(req.body, rideId);
  if (!requestRide)
    return res.status(400).send("something failed cannot request ride");

  //send notification to rider for trip request
  //step1. get userId of rider from rid
  let rideDetails = await Ride.findOne({ _id: rideId });
  // console.log("ride detail's:", rideDetails);

  //step2: get user detail's
  let user = await getUser(req.body.User);
  // console.log("user detail's:" + user);

  //step3. crate object
  let notificationObj = {
    fromUser: req.body.User,
    toUser: rideDetails.User,
    notificationType: "Ride",
    message: `You got trip request from passenger ${user.name} for your ride from ${req.body.source} to ${req.body.destination} on date ${req.body.date}`,
  };

  let notificationResult = await createNotification(notificationObj);
  console.log("Sending notification to rider for the request...");

  //sending push notification 
  let message = {
    to: notificationToken,
    sound: "default",
    title: "New trip request",
    body: `You got trip request from passenger ${user.name} for your ride from ${req.body.source} to ${req.body.destination} on date ${req.body.date}`,
    data: {notificationType:"Ride"}
  }
  sendPushNotification(notificationToken, message);

  return res.status(200).send(requestedRide);
});

//endpoint to cancel trip request
// router.put("/cancelTrip/:tid", auth, async (req, res) => {});

//route to get all accepted trip request
router.get("/getBookedTrips", auth, async (req, res) => {
  let passengerId = req.body.User;
  let bookedTrips = await getAllBookedTrips(passengerId);
  if (!bookedTrips) return res.status(400).send("No rides found");
  // let finalResult = [];
  // bookedTrips.map((tripObj) => {
  //   let tripDate = convertToDate(tripObj.date);
  //   let currentDate = Date.now;
  //   if (tripDate >= currentDate) {
  //     finalResult.push(tripObj);
  //   }
  // });

  //return res.status(200).send("searchForRide called and result:" + rides);

  return res.status(200).send(bookedTrips);
});

//route to get all history of passenger
router.get("/getPassengerHistory", auth, async (req, res) => {
  let passengerId = req.body.User;
  let passengerHistory = await getPassengerHistory(passengerId);
  if (!passengerHistory) return res.status(400).send("No history found");

  return res.status(200).send(passengerHistory);
});

// route to reject booked trip
router.delete("/deleteBookedTrip/:tripRideId/:notificationToken", auth, async (req, res) => {
  let tripRideId = req.params.tripRideId;
  let notificationToken = req.params.notificationToken;
  let deleteResult = await deleteBookedTrip(tripRideId, notificationToken);
  if (!deleteResult) return res.status(400).send("Error in deleting");

  return res.status(200).send("Trip deleted");
});

//endpoint to update the status of particular trip initiated/completed/ Rejected/canceled
router.put("/updateTripStatus", auth, async (req, res) => {
  console.log(req.body)
  let tripRideId = req.body.tripRideId;
  let tripId = req.body.tripId;
  let status = req.body.status;
  let notificationToken = req.body.notificationToken;
  console.log("update trip status notificationToken:",notificationToken);
  

  console.log("Update trip status is called");
  let TripRideObj = await updateTripStatus(tripRideId, tripId, status,notificationToken);

  // let saveResult = await TripRideObj.save();

  if (!TripRideObj)
    return res.status(400).send("Something failed try after some time");

  return res.status(200).send(`Trip ${status}`);
});

// set rating to raider
router.put("/setRating", auth, async (req, res) => {
  console.log("setRating is called..");
  // console.log("trip ride id:",req.body.tripRideId);
  // console.log("rating:",req.body.rating);
  let tripRideId = req.body.tripRideId;
  let rating = req.body.rating;
  let addRatingResult = await setRating(tripRideId, rating);
  if (!addRatingResult) return res.status(400).send("Error in set rating");
  return res.status(200).send(addRatingResult);
});

module.exports = router;
