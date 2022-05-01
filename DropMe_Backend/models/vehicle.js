const mongoose = require('mongoose');
const Joi = require('joi');

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true },
    vehicleName: { type: String, required: true },
    seatingCapacity: { type: Number, max: 6, required: true },
    rcBookImage: { type: String },
    vehicleImage: { type: String, required: true },
    pucImage: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    vehicleClass: {
        type: String,
        enum: ["SUV", "HatchBack", "Sedan", "NormalBike", "SportBike", "Scooter"],
        required: true
    },
    vehicleType: {
        type: String,
        enum: ["Car", "Bike"],
        required: true
    },
    fuelType: {
        type: String,
        enum: ["Petrol", "Diesel", "CNG", "Electric"],
        required: true
    },
    userId: { type: Number, required: true }
});

const Vehicle = mongoose.model('vehicle', vehicleSchema);

function validateVehicleDetails(vehicleData) {
    let joiVehicleSchema = Joi.object({
        vehicleNumber: Joi.string().regex(/^([A-Z|a-z]{2}\s{1}\d{2}\s{1}[A-Z|a-z]{1,2}\s{1}\d{1,4})?([A-Z|a-z]{3}\s{1}\d{1,4})?$/).required().messages({
            "object.regex": "Please enter valid vehicle number"
        }),
        vehicleName: Joi.string().min(1).max(255).required(),
        vehicleType: Joi.string().valid("Car", "Bike").required(),
        fuelType: Joi.string().valid("Petrol", "Diesel", "CNG", "Electric").required(),
        vehicleClass: Joi.string().valid("SUV","HatchBack","Sedan","NormalBike","SportBike","Scooter").required(),
        seatingCapacity: Joi.number().required().min(1).max(8),
        rcBookImage: Joi.string().required(),
        vehicleImage: Joi.string().required(),
        pucImage: Joi.string().required(),
        userId: Joi.number().required()
    });
    return joiVehicleSchema.validate(vehicleData);
}

module.exports = { Vehicle, validateVehicleDetails }