const express = require("express");
const { Ride } = require('../models/ride')
const fs = require('fs');
const req = require("express/lib/request");

// create ride function
async function createRide(rideDetails) {
    //console.log("Saving");
    const newRide = new Ride(rideDetails)
    return await newRide.save()
}

// get ride by source destination date and  time
async function getRides(Source, Destination, Date, Time, seats, gender) {
    console.log("here");
    return await Ride.find({
        source: Source,
        destination: Destination,
        date: Date,
        time: Time,
        availableSeats:{$gte:seats}
      //  rideFor:{$or:{gender,"Both"}}
        
    
    }).find({ $or:[{"rideFor":gender},{"rideFor":"Both"}]})
}

// Add trip request
async function addTripRequest(rideId,tripId){
    
    let [rideObj] =await Ride.find({_id:rideId});
    if(!rideObj) return null;
    rideObj.requestedTripList.push(tripId);
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

// to get list ride of all trips who has reuqested for perticular ride
async function getTripRequestList(rid) {
    return await Ride.findOne({_id: rid}, {_id:0, requestedTripList:1});
}

async function removeTripId(rideId, tripId) {
    let rideObj = await Ride.findOne({_id:rideId});
    console.log(rideObj.requestedTripList);
    let index = rideObj.requestedTripList.indexOf(tripId);
    rideObj.requestedTripList.splice(index, 1);
    return rideObj.save();
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
    addTripRequest,
    getTripRequestList,
    removeTripId
}