const { Trip } = require('../models/trip');
const {TripRide} = require('../models/trip_ride');

async function addAcceptedTrip(body) {
    let tripRide = new TripRide(body);
    return tripRide.save();
} 
 
async function getTripDetailsByRideIdAndStatus(rid, status) {
    return await TripRide.find({rideId:rid, status:status}).populate("tripId","-_id User",Trip);
}


module.exports = {addAcceptedTrip, getTripDetailsByRideIdAndStatus};