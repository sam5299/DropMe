const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { validateTrip } = require("../models/trip");
const { getRides, addTripRequest } = require("../services/ride");
const { requestRide } = require("../services/trip");
const { getWallet, updateUsedCredit } = require("../services/wallet");
const { getUser } = require("../services/user");
router.use(express.json());
const { Ride } = require("../models/ride");
const { createNotification } = require("../services/notification");
const { getAllBookedTrips, getPassengerHistory } = require("../services/trip_ride");

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
  return res.status(200).send("/searchForRide called and result:" + rides);
});

router.post("/requestRide", auth, async (req, res) => {
  delete req.body.userId;
  let rideId = req.body.rideId;
  delete req.body.rideId;
  let { error } = validateTrip(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log("USER:" + req.body.User);

  //check if passenger has sufficent balance for booking ride.
  let balance = await getWallet(req.body.User);
  console.log("balance:" + balance);
  if (balance.creditPoint < req.body.amount + balance.usedCreditPoint)
    return res
      .status(400)
      .send(
        "You don't have sufficent credit points to request for this trip. Please add credit point and try again."
      );

  let requestedRide = await requestRide(req.body, rideId);
  if (!requestRide)
    return res.status(400).send("something failed cannot request ride");

  //send notification to rider for trip request
  //step1. get userId of rider from rid
  let rideDetails = await Ride.findOne({ _id: rideId });
  console.log("ride detail's:", rideDetails);

  //step2: get user detail's
  let user = await getUser(req.body.User);
  console.log("user detail's:" + user);

  //step3. crate object
  let notificationObj = {
    fromUser: req.body.User,
    toUser: rideDetails.User,
    message: `You got trip request from passenger ${user.name}`,
  };

  let notificationResult = createNotification(notificationObj);
  console.log("notificationresult:", notificationResult);

  return res.status(200).send("request sent:" + requestedRide);
});

//endpoint to cancel trip request
router.put("/cancelTrip/:tid", auth, async (req, res) => {});

//route to get all accepted trip request
router.get("/getBookedTrips", auth, async (req, res) => {
  let raiderId= req.body.User;
  let bookedRide = await getAllBookedTrips(raiderId);
  if(!bookedRide)
  return res.status(400).send("No rides found");
   
  return res.status(200).send("Booked rides" + bookedRide);
});

//route to get all history of passenger
router.get("/getPassengerHistory", auth, async (req, res) => {
  let passengerId= req.body.User;
  let passengerHistory = await getPassengerHistory(passengerId);
  if(!passengerHistory)
  return res.status(400).send("No history found");
   
  return res.status(200).send("passenger History" + passengerHistory);
});


module.exports = router;
