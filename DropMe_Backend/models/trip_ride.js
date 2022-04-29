const mongoose = require('mongoose');
const Joi = require('joi');


let tripRideSchema = new mongoose.Schema({
    status: {type:String, required:true, default:"Booked"},
    token: {type:Number, default:0},
    routeMatch: {type:Number, default:100},
    tripRating: {type:Number, default:null},
    tripId: {type:mongoose.Schema.Types.ObjectId,ref:"Trip", required:true},
    rideId: {type:mongoose.Schema.Types.ObjectId,ref:"Ride", required:true},
    amount: {type:Number, required:true}
});

let TripRide = mongoose.model("tripRide",tripRideSchema);

function validateTripRide(body) {
    const joiTripRideValidateSchema = Joi.object({
        status: Joi.string().valid("Booked","Initiated","Success","Cancelled", "Rejected"),
        tripId: Joi.string().required(),
        rideId: Joi.string().required(),
        amount: Joi.number(),
        token: Joi.number().required()
    });
    return joiTripRideValidateSchema.validate(body);
}

module.exports = {TripRide, validateTripRide}