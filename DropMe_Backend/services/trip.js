const Trip = require('../models/trip');
const Ride = require("../models/ride");
const req = require('express/lib/request');

//function to get available trip with id
async function getTrip(tripBody) {
    return await Trip.findOne({User: tripBody.User, source: tripBody.source, destination: tripBody.destination, date: tripBody.date, time: tripBody.time });
}

//function to add newTrip into Trip collection
async function addTrip(tripBody) {
    let NewTrip = new Trip(tripBody);
    let trip = await NewTrip.save();
    return trip._id;
}

//function to request a ride
async function requestRide(tripBody, rid) {
    let tripId = null;
    
    let trip = await getTrip(tripBody);
    console.log(trip);
    if(trip) tripId = trip._id;
    else tripId = await addNewTrip(tripBody);

}
 