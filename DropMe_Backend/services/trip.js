const { Trip } = require("../models/trip");
const { Ride } = require("../models/ride");
const req = require("express/lib/request");
const { addTripRequest } = require("./ride");
const { Vehicle } = require("../models/vehicle");
const { TripRide } = require("../models/trip_ride");
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
  //console.log(tripBody);
  let trip = await getTrip(tripBody);
  //console.log(trip);
  if (trip) tripId = trip._id;
  else tripId = await addNewTrip(tripBody);
  //console.log("tripid which is to store:"+tripId);
  let requestedTrip = await addTripRequest(tripBody.User, rid, tripId);
  //console.log(requestedTrip);
  return requestedTrip;
}

//function to return details of Trip and User who crated that trip
async function getTripDetails(tripId) {
  return await Trip.findOne({ _id: tripId })
    //.populate('User', '-_id profile fname lname ')
    .populate("User", "_id profile name");
  //.select("source destination distance seatRequest ");
}
// get all rides of the user not working
async function getAllRequest(allRideList) {
  //   let requestList = [];
  //   let tmp=[]
  //   await allRideList.map((rideObj) => {
  //     tmp.push(rideObj)
  //     if (rideObj.requestedTripList.length > 0) {
  //       let tripList = rideObj.requestedTripList;
  //       tripList.map(async (tripId) => {
  //         let tripDetails = await getTripDetails(tripId);
  //         // console.log(`Trip Details for ${tripId}`, ...tripDetails);
  //         requestList.push(...tripDetails);
  //         //console.log("@@@", requestList);
  //       });
  //     }
  //     console.log(requestList);
  //     if(tmp.length==allRideList.length){
  //       console.log(tmp.length);
  //       console.log(tmp.length);
  //       console.log(requestList);
  //       return requestList;
  //     }
  //   });
  //   // console.log("@@", requestList);
  //   // return requestList;
  //   // allRideList.map((rideObj) => {
  //   //   if (rideObj.requestedTripList.length > 0) {
  //   //     let tripList = rideObj.requestedTripList;
  //   //     tripList.map((tripId) => {
  //   //       getTripDetails(tripId).then((tripDetails) =>
  //   //         {
  //   //           console.log(tripDetails)
  //   //           requestList.push(...tripDetails)}
  //   //       );
  //   //       // console.log(`Trip Details for ${tripId}`, ...tripDetails);
  //   //       //console.log("@@@", requestList);
  //   //     });
  //   //   }
  //   // });
}

//function to generate 4 digit trip token for each accepted trip request
function generateTripToken() {
  return Math.floor(Math.random() * 1000000) + 1;
}

// calculate trip amount
async function calculateTripAmount(vehicleId, distance) {
  let vehicleObj = await Vehicle.findOne({ _id: vehicleId });
  // console.log("Vehicle Object:" + vehicleObj);
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
    switch (vehicleObj.fuelType) {
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
  getAllRequest,
  
};
