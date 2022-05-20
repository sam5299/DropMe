const { Ride } = require("../models/ride");
const { Trip } = require("../models/trip");
const { TripRide } = require("../models/trip_ride");
const { User } = require("../models/user");
const { WalletHistory } = require("../models/wallet_history");
const { createNotification } = require("./notification");
const { getTimeDifference } = require("./ride");
const {
  updateWallet,
  updateUsedCredit,
  addPenalty,
  addSafetyPoints,
} = require("./wallet");
const { addNewHistory } = require("./walletHistory");

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
async function getRiderHistory(riderId) {
  return await TripRide.find({
    RaiderId: riderId,
    $or: [
      { status: "Completed" },
      { status: "Cancelled" },
      { status: "Rejected" },
    ],
    // status: { $ne: "Booked" },
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

  //setting simple sourcename and destination name for wallethistory purpose
  let sourceArrary = tripRideObj.rideId.source.split(",");
  let destinationArray = tripRideObj.rideId.destination.split(",");
  let sourceName = sourceArrary[0];
  let destinationName = destinationArray[0];
  console.log("SourceName:" + sourceName);
  //console.log("DestinationName:" + destinationName);

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

    //add code to add new entry in wallet_history collection for deducted credit point
    let body = {
      User: tripRideObj.PassengerId._id,
      type: "Debit",
      message: `Cancellation charges for booked trip from ${sourceName} to ${destinationName}.`,
      amount: depositAmount,
      date: new Date().toDateString(),
    };
    let newWalletHisotry = new WalletHistory(body);
    let walletHistoryResult = await newWalletHisotry.save();
    if (!walletHistoryResult) console.log(walletHistoryResult);
    console.log("WalletHistory in trip ride deleteRide function");
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
  let TripRideObj = await TripRide.findOne({
    _id: tripRideId,
    tripId: tripId,
  }).populate("rideId", "source destination pickupPoint date", Ride);
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

    // add 90% amount to riders wallet and 10% commission will be given to DropMe.

    // let sourceArrary = TripRideObj.rideId.source.split(",");
    // let destinationArray = TripRideObj.rideId.destination.split(",");
    // let sourceName = sourceArrary[0];
    // let destinationName = destinationArray[0];

    // if the ride is free then just update the status
    if (TripRideObj.amount) {
      let sourceName = TripRideObj.rideId.source;
      let destinationName = TripRideObj.rideId.destination;

      let tripAmount = TripRideObj.amount - parseInt(TripRideObj.amount / 10);
      let updateRiderWallet = await updateWallet(
        TripRideObj.RaiderId._id,
        tripAmount
      );

      //call to updateWallet history for raider
      let riderWalletHistoryDetails = {
        User: TripRideObj.RaiderId._id,
        amount: tripAmount,
        message: `Credit point added for ride from ${sourceName} to ${sourceName}`,
        date: TripRideObj.date,
        type: "Credit",
      };

      let riderWalletHistoryDetailsResult = await addNewHistory(
        riderWalletHistoryDetails
      );

      if (!riderWalletHistoryDetailsResult)
        console.log(
          "Error in rider set wallet history",
          riderWalletHistoryDetailsResult
        );

      // deduct trip amount from passenger's wallet
      let updatePassengerWallet = await updateWallet(
        TripRideObj.PassengerId._id,
        TripRideObj.amount * -1
      );

      //call to updateWallet history for passenger
      let passengerWalletHistoryDetails = {
        User: TripRideObj.PassengerId._id,
        amount: tripAmount,
        message: `Completed trip from ${sourceName} to ${sourceName}`,
        date: TripRideObj.date,
        type: "Debit",
      };

      let passengerWalletHistoryDetailsResult = await addNewHistory(
        passengerWalletHistoryDetails
      );

      if (!passengerWalletHistoryDetailsResult)
        console.log(
          "Error in passenger set wallet history",
          passengerWalletHistoryDetailsResult
        );

      // deduct amount from passenger's Used credit
      let updateUsedCreditResult = await updateUsedCredit(
        TripRideObj.PassengerId._id,
        TripRideObj.amount - TripRideObj.amount
      );
      //add default rating for completed ride once rider click on end trip
     
    }
    let ratingResult = setRating(TripRideObj._id, 3);
    if (!ratingResult)
      console.log(
        "error while setting default rating in trip_ride:",
        ratingResult
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
