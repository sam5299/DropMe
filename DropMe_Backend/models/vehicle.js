const mongoose = require('mongoose');
const joi = require('joi');
const Joi = require('joi');

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {type:String, required:true},
    vehicleName: {type: String, required:true},
    vehicleType: {type:String, required: true},
    fuelType: {type:String,required:true},
    seatingCapacity: {type:Number, max:6, required:true},
    vehicleClass : {type:String, required:true},
    rcBookImagePath: {type: String},
    vehicleImagePath: {type:String, required:true},
    pucImagePath: {type:String, required: true},
    userId: {type: Number, required:true}
});
 
const Vehicle = mongoose.model('vehicle',vehicleSchema);

function validateVehicleDetails(vehicleData) {
    let joiVehicleSchema = Joi.object({
        vehicleNumber: Joi.string().regex(/^([A-Z|a-z]{2}\s{1}\d{2}\s{1}[A-Z|a-z]{1,2}\s{1}\d{1,4})?([A-Z|a-z]{3}\s{1}\d{1,4})?$/).required().messages({
            "object.regex":"Please enter valid vehicle number"
        }),
        vehicleName: Joi.string().min(1).max(255).required(),
        vehicleType: Joi.string().required(),
        fuelType: Joi.string().required(),
        seatingCapacity: Joi.number().required().min(1).max(6),
        vehicleClass: Joi.string().required(),
        rcBookImagePath: Joi.string().required(),
        vehicleImagePath: Joi.string().required(),
        pucImagePath: Joi.string().required(),
        userId: Joi.number().required()
      });
      return joiVehicleSchema.validate(vehicleData);
}

module.exports = {Vehicle, validateVehicleDetails}