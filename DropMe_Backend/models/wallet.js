const mongoose = require('mongoose')
const Joi = require('joi');
const { string } = require('joi');


const walletSchema = new mongoose.Schema({
    creditPoint: { type: Number, required: true, },
    safetyPoints: { type: Number, require: true },
    User: { type: String, required: true }
})


const Wallet = new mongoose.model('Wallet', walletSchema);
 
function validateWalletDetails(details){
    const joiWalletSchemas=new Joi.object({
        creditPoint:Joi.number().required(),
        safetyPoint:Joi.number().required(),
        User:Joi.string().required()
    })
}

module.exports = { Wallet, validateWalletDetails }