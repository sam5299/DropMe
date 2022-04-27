const express = require("express");
const { Ride } = require('../models/ride')
const fs = require('fs');

// create ride function
async function createRide(rideDetails) {
    //console.log("Saving");
    const newRide = new Ride(rideDetails)
    return await newRide.save()


}

// get ride by source destination date and  time
async function getRides(Source, Destination, Date, Time) {
    return await Ride.find({
        source: Source,
        destination: Destination,
        date: Date,
        time: Time
    })
}

// Add trip request
async function addTripRequest(rideId,tripId){
    let rideObj =await Ride.find({_id:rideId})
    if(!rideObj)
    return null;
    rideObj.requestedTripList=rideObj.requestedTripList.push(tripId);
    return await rideObj.save()

}


// get ride by user id
async function getUserRides(userId) {
    return await Ride.find({
        User: userId
    })
}

// delete a ride by its id
async function deleteRide(rideId) {
    return await Ride.findOneAndDelete({
        _id: rideId
    })
}





// To save image of vehicle after creating ride 
function savePicture(fileName){

}

module.exports = {
    createRide,
    getRides,
    getUserRides,
    deleteRide,
    savePicture,
    addTripRequest
}