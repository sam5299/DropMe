const { Ride } = require("../models/ride");
const { Trip } = require("../models/trip");
const { TripRide } = require("../models/trip_ride");
const { User } = require("../models/user");
const { createNotification } = require("./notification");
const { getTimeDifference } = require("./ride");
const { updateWallet, updateUsedCredit } = require("./wallet");

async function addAcceptedTrip(body) {
  let tripRide = new TripRide(body);
  return tripRide.save();
}

async function getTripDetailsByRideIdAndStatus(rid, status) {
  return await TripRide.findOne({ rideId: rid, status: status }).populate(
    "tripId",
    "-_id User",
    Trip
  );
}

// return all booked rides of the raider
async function getAllBookedRides(raiderId) {
  return await TripRide.find({
    RaiderId: raiderId,
    $or: [{ status: "Booked" }, { status: "Initiated" }],
  })
    .populate("PassengerId", "_id profile name mobileNumber", User)
    .populate("tripId", "_id source destination pickupPoint date", Trip)
    .sort({ _id: -1 });
}

// return all booked rides of the passenger
async function getAllBookedTrips(passengerId) {
  return await TripRide.find({ PassengerId: passengerId, status: "Booked" })
    .populate("RaiderId", "_id profile name mobileNumber", User)
    .populate("tripId", "_id source destination pickupPoint date time", Trip)
    .sort({ _id: -1 });
}

// return all history of the passenger
async function getPassengerHistory(passengerId) {
  return await TripRide.find({ PassengerId: passengerId })
    .populate("RaiderId", "_id profile name mobileNumber", User)
    .populate("tripId", "source destination pickupPoint date", Trip)
    .sort({ _id: -1 });
}

// return all history of the passenger
async function getRiderHistory(raiderId) {
  return await TripRide.find({ RiderId: raiderId })
    .populate("PassengerId", "_id profile name mobileNumber", User)
    .populate("tripId", "source destination pickupPoint date", Trip)
    .sort({ _id: -1 });
}

// if the trip is canceled by passenger
async function deleteBookedTrip(tripRideId) {
  let tripRideObj = await TripRide.findOne({ _id: tripRideId })
    .populate("rideId", "source destination pickupPoint date", Ride)
    .populate("PassengerId", "name", User);

  tripRideObj.date = tripRideObj.rideId.date;
  let today = new Date();
  let currentTime =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //get the time difference
  let timeDifference = getTimeDifference(tripRideObj.date + ";" + currentTime);
  console.log("time difference:" + timeDifference);
  //check if cancellation time is above 10 hrs then trip deposit will be refunded
  if (timeDifference >= 10) {
    let depositAmount = tripRideObj.Ride.amount * 0.1;
    //console.log("penalty");
    let result = await updateUsedCredit(
      req.body.User,
      tripRideObj.Ride.amount * -1
    );
    let updatateWallet = await updateWallet(
      req.body.User,
      tripRideObj.Ride.amount - depositAmount
    );
    if (!result) console.log("error while adding deposit amount");
  }

  let notificationDetails = {
    fromUser: tripRideObj.PassengerId._id,
    toUser: tripRideObj.RaiderId,
    message: `Your booked trip from ${tripRideObj.rideId.source} to ${tripRideObj.rideId.destination} is canceled by ${tripRideObj.PassengerId.name}. `,
  };

  let newNotification = await createNotification(notificationDetails);
  if (!newNotification) {
    console.log("failed to send notification.");
    return res.status(400).send("something failed.");
  }

  tripRideObj.status = "Rejected";
  let result = await tripRideId.save();
  result.status(200).send("Trip is cancelled");
}

// get trip ride details by TripRideId and tripId
async function getTripRideByTripId(tripRideId, tripId, status) {
  let TripRideObj = await TripRide.findOne({ _id: tripRideId, tripId: tripId });
  TripRideObj.status = status;
  let currentDate = new Date();
  let currentTime =
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();
  //console.log(time);
  if (status == "Initiated") TripRideObj.startTime = currentTime;
  else {
    TripRideObj.endTime = currentTime;

    // add 90% amount to riders wallet and 10% commision will be given to DropMe.
    let updateRiderWallet = await updateWallet(
      TripRideObj.RiderId,
      TripRideObj.amount - parseInt(TripRideObj.amount / 10)
    );

    // deduct trip amount from passenger's wallet
    let updatePassengerWallet = await updateWallet(
      TripRideObj.PassengerId,
      TripRideObj.amount - TripRideObj.amount
    );

    // deduct amount from passenger's Used credit
    let updateUsedCredit = await updateUsedCredit(
      TripRideObj.PassengerId,
      TripRideObj.amount - TripRideObj.amount
    );
  }

  return await TripRideObj.save();
}

module.exports = {
  addAcceptedTrip,
  getTripDetailsByRideIdAndStatus,
  getAllBookedRides,
  getAllBookedTrips,
  getRiderHistory,
  getPassengerHistory,
  deleteBookedTrip,
  getTripRideByTripId,
};
