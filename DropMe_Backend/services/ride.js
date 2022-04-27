const express = require("express");
const { Ride } = require('../models/ride')

// create ride function
async function createRide(rideDetails) {
    console.log("Saving");
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

// get ride by user id
async function getUserRides(userId) {
    return await Ride.find({
        User: userId
    })
}


module.exports = {
    createRide,
    getRides,
    getUserRides
}