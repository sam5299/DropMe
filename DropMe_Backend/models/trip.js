const mongoose = require('mongoose');
const Joi = require('joi');

let tripSchema = new mongoose.Schema({
    source: {type:String, required:true},
    destination: {type:String, required:true},
    date: {type:String, required:true},
    time: {type:String, required:true},
    User: {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}  
});

let Trip = mongoose.model('trip', tripSchema);

// function for creating new trip
function validateTrip(body) {
    let joiTripValidationSchema = Joi.object({
        source: Joi.string().required(),
        destination: Joi.string().required(),
        date: Joi.string().required(),
        time: Joi.string().required(),
        User: Joi.string().required()
    });
    return joiTripValidationSchema.validate(body);
}

module.exports = {Trip, validateTrip};