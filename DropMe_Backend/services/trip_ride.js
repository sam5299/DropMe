const { Ride } = require("../models/ride");
const { Trip } = require("../models/trip");
const { TripRide } = require("../models/trip_ride");
const { User } = require("../models/user");
const { createNotification } = require("./notification");
const { getTimeDifference } = require("./ride");
const {
  updateWallet,
  updateUsedCredit,
  addPenalty,
  addSafetyPoints,
} = require("./wallet");

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
  return await TripRide.find({
    PassengerId: passengerId,
    $or: [
      { status: "Completed" },
      { status: "Cancelled" },
      { status: "Rejected" },
    ],
  })
    .populate("RaiderId", "_id profile name mobileNumber", User)
    .populate("tripId", "source destination pickupPoint date", Trip)
    .sort({ _id: -1 });
}

// return all history of the passenger
async function getRiderHistory(raiderId) {
  return await TripRide.find({
    RiderId: raiderId,
    $or: [
      { status: "Completed" },
      { status: "Cancelled" },
      { status: "Rejected" },
    ],
  })
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
  console.log("tripRideObj:", tripRideObj);

  let today = new Date();
  let currentTime =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //get the time difference
  let timeDifference = getTimeDifference(tripRideObj.date + ";" + currentTime);
  console.log("time difference:" + timeDifference);
  //check if cancellation time is above 10 hrs then trip deposit will be refunded
  if (timeDifference >= 10) {
    let depositAmount = parseInt(tripRideObj.amount * 0.1);
    console.log("penalty", depositAmount);

    // update passengers used credits
    let result = await updateUsedCredit(
      tripRideObj.PassengerId._id,
      tripRideObj.amount * -1
    );

    // update passenger wallet by applying panelty
    let updateWalletResult = await updateWallet(
      tripRideObj.PassengerId._id,
      depositAmount * -1
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
    return newNotification;
  }

  tripRideObj.status = "Rejected";
  return await tripRideObj.save();
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
  else if (status == "Completed") {
    TripRideObj.endTime = currentTime;

    // add 90% amount to riders wallet and 10% commision will be given to DropMe.
    let updateRiderWallet = await updateWallet(
      TripRideObj.RaiderId._id,
      TripRideObj.amount - parseInt(TripRideObj.amount / 10)
    );

    // deduct trip amount from passenger's wallet
    let updatePassengerWallet = await updateWallet(
      TripRideObj.PassengerId._id,
      TripRideObj.amount * -1
    );

    //call to updateWallet history

    // deduct amount from passenger's Used credit
    let updateUsedCreditResult = await updateUsedCredit(
      TripRideObj.PassengerId._id,
      TripRideObj.amount - TripRideObj.amount
    );
  } else {
    //console.log(status);
    // apply safety points penalty to rider
    let penalty = TripRideObj.amount * 0.1;
    let result = await addPenalty(TripRideObj.RaiderId, penalty);
    if (!result) console.log("error while applying penalty");
  }

  return await TripRideObj.save();
}

// Set rating to a trip ride and rider
async function setRating(tripRideId, rating) {
  let tripRideObj = await TripRide.findOne({ _id: tripRideId });
  // increase the total number of rides
  let raiderObj = await User.findOne({ _id: tripRideObj.RaiderId });
  raiderObj.totalNumberOfRides = raiderObj.totalNumberOfRides + 1;

  // update rider rating , rated ride and set rating to tripRide object
  if (rating) {
    raiderObj.sumOfRating = raiderObj.sumOfRating + rating;
    raiderObj.totalNumberOfRatedRides = raiderObj.totalNumberOfRatedRides + 1;
    tripRideObj.tripRating = rating;
  }
  let saveResult = await raiderObj.save();

  // add safety points in raider wallet
  let updateSafetyPointResult = await addSafetyPoints(
    tripRideObj.RaiderId,
    rating
  );

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
  getTripRideByTripId,
  setRating,
};
