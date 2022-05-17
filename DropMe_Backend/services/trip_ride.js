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
    let depositAmount = tripRideObj.amount * 0.1;
    console.log("penalty");
    let result = await updateUsedCredit(
      tripRideObj.PassengerId._id,
      tripRideObj.amount * -1
    );
    let updatateWallet = await updateWallet(
      tripRideObj.PassengerId._id,
      tripRideObj.amount - depositAmount
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
  //console.log("@@@ Rejected", tripRideObj);

  return await tripRideObj.save();
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
