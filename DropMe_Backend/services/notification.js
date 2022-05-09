const { Notification } = require('../models/notification')

async function createNotification(details) {
    console.log(details);
    let newNotification = new Notification(details);
    return await newNotification.save()
}

async function getNotification(userId) {
    let notificationList =await Notification.find({ toUser: userId, isRead:false})
    // if(notificationList.length==0)
    // return ["No any notifications"];
    return notificationList;
}

module.exports = { createNotification , getNotification }