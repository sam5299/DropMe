const { Ride } = require("../models/ride");
const { Trip } = require("../models/trip");
const { TripRide } = require("../models/trip_ride");
const { User } = require("../models/user");
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
  return await TripRide.find({ RaiderId: raiderId, status: "Booked" })
    .populate("PassengerId", "_id profile name mobileNumber", User)
    .populate("tripId", "_id source destination pickupPoint date", Trip);
}

// return all booked rides of the passenger
async function getAllBookedTrips(passengerId) {
  return await TripRide.find({ PassengerId: passengerId, status: "Booked" })
    .populate("RaiderId", "_id profile name mobileNumber", User)
    .populate("tripId", "_id source destination pickupPoint date time", Trip);
}

// return all history of the passenger
async function getPassengerHistory(passengerId) {
  return await TripRide.find({ PassengerId: passengerId })
    .populate("RaiderId", "_id profile name mobileNumber", User)
    .populate("tripId", "source destination pickupPoint date", Trip);
}

// return all history of the passenger
async function getRiderHistory(raiderId) {
  return await TripRide.find({ RiderId: raiderId })
    .populate("PassengerId", "_id profile name mobileNumber", User)
    .populate("tripId", "source destination pickupPoint date", Trip);
}

// if the trip is canceled by passenger
async function deleteBookedTrip(tripRideId) {
  let tripRideObj = await TripRide.findOne({ _id: tripRideId }).populate(
    "rideId",
    "source destination pickupPoint date",
    Ride
  );

  //get the time difference
  let timeDifference = getTimeDifference(
    tripRideObj.Ride.date + ";" + tripRideObj.Ride.time
  );
  //console.log("time difference:" + timeDifference);
  //check if cancellation time is above 10 hrs then trip deposit will be refunded
  if (timeDifference >= 10) {
    let depositAmount = tripRideObj.Ride.amount * 0.1;
    //console.log("penalty");
    let result = await updateUsedCredit(req.body.User, tripRideObj.Ride.amount*-1);
    let updatateWallet= await updateWallet(req.body.User,tripRideObj.Ride.amount-depositAmount)
    if (!result) console.log("error while adding deposit amount");
  }
  tripRideObj.status = "Rejected";
  let result= await tripRideId.save();
  result.status(200).send("Trip is cancelled");
}

module.exports = {
  addAcceptedTrip,
  getTripDetailsByRideIdAndStatus,
  getAllBookedRides,
  getAllBookedTrips,
  getRiderHistory,
  getPassengerHistory,
  deleteBookedTrip,
};
