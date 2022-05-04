const mongoose = require('mongoose');
const Joi = require('joi');
const rideSchema = new mongoose.Schema({
    source: { type: String, min: 1, max: 255, required: true },
    destination: { type: String, min: 1, max: 255, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    availableSeats: { type: Number, min: 1, max: 8, required: true },
    distance: { type: Number, min: 1, required: true },
    requestedTripList: {type:Array},
    status: {
        type: String,
        enum: ["Created", "Canceled", "Completed"],
        required: true
    },
    rideType: {
        type: String,
        enum: ["Free", "Paid"],
        required: true
    },
    rideFor: {
        type: String,
        enum: ["Male", "Female", "Both"],
        required: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    Vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle',
        required: true
    },
});

const Ride = mongoose.model('ride', rideSchema);

function validateRideDetails(rideData) {
    let joiRideSchema = Joi.object({
        source: Joi.string().min(1).max(255).required(),
        destination: Joi.string().min(1).max(255).required(),
        time: Joi.string().required(),
        date: Joi.string().required(),
        availableSeats: Joi.number().required().min(1).max(8),
        distance: Joi.number().required().min(1),
        requestedTripList: Joi.array(),
        status: Joi.string().valid("Created", "Canceled", "Completed").required(),
        rideFor: Joi.string().valid("Male", "Female", "Both").required(),
        rideType: Joi.string().valid("Free", "Paid").required(),
        vehicleNumber: Joi.string().regex(/^([A-Z|a-z]{2}\s{1}\d{2}\s{1}[A-Z|a-z]{1,2}\s{1}\d{1,4})?([A-Z|a-z]{3}\s{1}\d{1,4})?$/).required().messages({
            "object.regex": "Please enter valid vehicle number"
        }),
        User: Joi.string().required(),
        Vehicle: Joi.string().required()

    });
    return joiRideSchema.validate(rideData);
}



module.exports = { Ride, validateRideDetails }