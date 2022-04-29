const mongoose = require('mongoose')
const Joi = require('joi')

const notificationSchema = new mongoose.Schema({
    formUser: {
        type: String,
        required: true
    },
    toUser: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});


const Notification = mongoose.model('Notification', notificationSchema);

function validateNotification(details) {
    const notificationSchema = new Joi.object({
        fromUser: Joi.string().required(),
        toUser: Joi.string().required(),
        message: Joi.string().required()
    })
    return notificationSchema.validate(details);
}

module.exports ={Notification , validateNotification}