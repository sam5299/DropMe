const { Trip } = require("../models/trip");
const Ride = require("../models/ride");
const req = require("express/lib/request");
const { addTripRequest } = require("./ride");
const { Vehicle } = require("../models/vehicle");
//function to get available trip with id
async function getTrip(tripBody) {
  return await Trip.findOne({
    User: tripBody.User,
    source: tripBody.source,
    destination: tripBody.destination,
    date: tripBody.date,
    time: tripBody.time,
  });
}

//function to add newTrip into Trip collection
async function addNewTrip(tripBody) {
  let NewTrip = new Trip(tripBody);
  let trip = await NewTrip.save();
  return trip._id;
}

//function to request a ride
async function requestRide(tripBody, rid) {
  let tripId = null;

  let trip = await getTrip(tripBody);
  //console.log(trip);
  if (trip) tripId = trip._id;
  else tripId = await addNewTrip(tripBody);
  //console.log("tripid which is to store:"+tripId);
  let requestedTrip = await addTripRequest(rid, tripId);
  //console.log(requestedTrip);
  return requestedTrip;
}

//function to return details of Trip and User who crated that trip
async function getTripDetails(tripId) {
  return await Trip.find({ _id: tripId })
    //.populate('User', '-_id profile fname lname ')
    .populate("User", "-_id profile name")
    .select("source destination distance seatRequest");
}

//function to generate 4 digit trip token for each accepted trip request
function generateTripToken() {
  return Math.floor(Math.random() * 1000000) + 1;
}

// calculate trip amount
async function calculateTripAmount(vehicleId, distance) {
  let vehicleObj = await Vehicle.findOne({ _id: vehicleId });
  //console.log("Vehicle Object:"+vehicleObj);
  let vehicleClass = vehicleObj.vehicleClass;
  let vehicleType = vehicleObj.vehicleType;
  let classFactor = 1;
  let fuelFactor = 1;
  switch (vehicleClass) {
    case "Electric":
      classFactor = 1.5;
      break;
    case "NormalBike":
      classFactor = 2;
      break;
    case "Scooter":
      classFactor = 2.5;
      break;
    case "SportBike":
      classFactor = 3;
      break;
    case "HatchBack":
      classFactor = 3.2;
      break;
    case "Sedan":
      classFactor = 3.7;
      break;
    case "SUV":
      classFactor = 5;
      break;
  }
  if ("Car" == vehicleType) {
    console.log("Car");
    switch (fuel) {
      case "Petrol":
        fuelFactor = 2;
        break;
      case "Diesel":
        fuelFactor = 1.8;
        break;
      case "CNG":
        fuelFactor = 1.6;
        break;
      case "Electric":
        fuelFactor = 1.2;
        break;
    }
  }
  let amount = Math.round(fuelFactor * classFactor * distance);
  return amount;
}

module.exports = {
  requestRide,
  getTripDetails,
  generateTripToken,
  calculateTripAmount,
};
