const {TripRide} = require('../models/trip_ride');

async function addAcceptedTrip(body) {
    let tripRide = new TripRide(body);
    return tripRide.save();
} 



module.exports = {addAcceptedTrip}