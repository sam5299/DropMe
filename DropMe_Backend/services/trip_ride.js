const { Trip } = require('../models/trip');
const {TripRide} = require('../models/trip_ride');
const { User } = require('../models/user');

async function addAcceptedTrip(body) {
    let tripRide = new TripRide(body);
    return tripRide.save();
} 
 
async function getTripDetailsByRideIdAndStatus(rid, status) {
    return await TripRide.find({rideId:rid, status:status}).populate("tripId","-_id User",Trip);
}

// return all booked rides of the raider
async function getAllBookedRides(raiderId){
    //console.log("@@@@");
    return await TripRide.find({RaiderId:raiderId, status:"Booked"})
    .populate(
        "PassengerId",
        "_id profile name mobileNumber",
        User
      )
    .populate(
        "tripId",
        "source destination pickupPoint date",
        Trip
      )
}
module.exports = {addAcceptedTrip, getTripDetailsByRideIdAndStatus,getAllBookedRides};