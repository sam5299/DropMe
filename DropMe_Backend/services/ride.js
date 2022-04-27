const express = require("express");
const {Ride} = require('../models/ride')

// create ride function
async function createRide(rideDetails) {
    console.log("Saving");
    const newRide =  new Ride(rideDetails)
    return await newRide.save()
    // async function addVehicle(body) {
    //     const vehicle = new Vehicle(body);
    //     return await vehicle.save();
    // }

}
async function getRides(Source,Destination){
    return await Ride.find({ 
        source:Source,
        destination:Destination
    })
}

module.exports = {
    createRide
}