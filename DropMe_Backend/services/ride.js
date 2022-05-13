const express = require("express");
const { Ride } = require("../models/ride");
const { User } = require("../models/user");
const fs = require("fs");
const req = require("express/lib/request");
const { Vehicle } = require("../models/vehicle");

// create ride function
async function createRide(rideDetails) {
  //console.log("Saving");
  const newRide = new Ride(rideDetails);
  return await newRide.save();
}

// function to get ride details by its rid
async function getRideDetails(rid, user) {
  return await Ride.findOne({ _id: rid, User: user, status: "Created" });
}

// get ride by source destination date and  time
async function getRides(
  userId,
  Source,
  Destination,
  Date,
  Time,
  seats,
  gender
) {
  //   TripRide.find({rideId:rid, status:status}).populate("tripId","-_id User",Trip);
  // }
  return await Ride.find({
    source: Source,
    destination: Destination,
    date: Date,
    // time: Time,
    availableSeats: { $gte: seats },
    User: { $ne: userId },
    requestedUserList: { $nin: userId },
    //  rideFor:{$or:{gender,"Both"}}
    status: "Created",
  })
    .populate(
      "User",
      "_id profile name sumOfRating totalNumberOfRatedRides",
      User
    )
    .populate("Vehicle", "_id vehicleNumber vehicleName vehicleImage", Vehicle)
    .find({ $or: [{ rideFor: gender }, { rideFor: "Both" }] });
  // .find({ $not: [{ User: userId }] });
}

// Add trip request
async function addTripRequest(passengerId, rideId, tripId) {
  let [rideObj] = await Ride.find({ _id: rideId });
  if (!rideObj) return null;
  rideObj.requestedTripList.push(tripId);
  rideObj.requestedUserList.push(passengerId);
  return await rideObj.save();
}

// get ride by user id
async function getUserRides(userId) {
  return await Ride.find({
    User: userId,
  }).populate("Vehicle", "_id vehicleNumber vehicleImage ", Vehicle);
}

// delete a ride by its id
async function deleteRide(rideId) {
  return await Ride.findOneAndDelete({
    _id: rideId,
  });
}

// to get list of all trip who has reuqested for perticular ride
async function getTripRequestList(rid) {
  return await Ride.findOne({ _id: rid }, { _id: 0, requestedTripList: 1 });
}

// reduce availableSeat of ride after successfully accepting ride
async function reduceAvailableSeats(rid, seatCount) {
  let ride = await Ride.findOne({ _id: rid });
  ride.availableSeats = ride.availableSeats - seatCount;
  return ride.save();
}

//remove trip id from requestList array of Ride
async function removeTripId(rideId, tripId) {
  let rideObj = await Ride.findOne({ _id: rideId });
  console.log(rideObj.requestedTripList);
  let index = rideObj.requestedTripList.indexOf(tripId);
  rideObj.requestedTripList.splice(index, 1);
  return rideObj.save();
}

//function to return timedifference between ride time and current time
function getTimeDifference(rideDate) {
  let d1 = new Date(Date.parse(rideDate));
  let d2 = new Date(Date.parse(Date())); //"Mon May 02 2022;06:30");
  let hrs = Math.round((d1 - d2) / (1000 * 60 * 60));
  console.log(hrs);
  console.log(d1.toString());
  console.log(d2.toString());
  return hrs;
}

// To save image of vehicle after creating ride
function savePicture(fileName) {}

module.exports = {
  createRide,
  getRides,
  getRideDetails,
  getUserRides,
  deleteRide,
  savePicture,
  addTripRequest,
  getTripRequestList,
  reduceAvailableSeats,
  removeTripId,
  getTimeDifference,
};
