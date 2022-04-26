const {Vehicle} = require('../models/vehicle');

//function to check if vehicle number already exists 
async function checkVehicleAlreadyExitst(vno) {
    return await Vehicle.findOne({vehicleNumber:vno});
}

//function to add vehicle
async function addVehicle(body) {
    const vehicle = new Vehicle(body);
    return await vehicle.save();
}

//function to get list of vehicle and vehicle class of perticular user
async function getVehicleList(userId) {
    return await Vehicle.find({userId:userId});
}

module.exports = {checkVehicleAlreadyExitst, addVehicle, getVehicleList};