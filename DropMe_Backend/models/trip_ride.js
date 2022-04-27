const mongoose = require('mongoose');
const Joi = require('joi');

let tripRideSchema = new mongoose.Schema({
    status: {type:String, required:true, default:"Requested"},
    token: {type:Number, default:0},
    routeMatch: {type:Number, default:100},
    tripRating: {type:Number, default:null},
    tripId: {type:Object, required:true},
    rideId: {type:Object, required:true},
    amount: {type:Number, required:true}
});

let TripRide = mongoose.model("tripRide",tripRideSchema);

function validateTripRide(body) {
    const joiTripRideValidateSchema = Joi.object({
        status: Joi.string().valid('Requested',"Accepted","Initiated","Success","Cancelled", "Rejected"),
        tripId: Joi.object().required(),
        rideId: Joi.object().require()
    });
    return joiTripRideValidateSchema.validate(body);
}

module.exports = {TripRide, validateTripRide}