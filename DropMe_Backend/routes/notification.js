const express=require('express')
const router=express.Router() 
const auth = require("../middleware/auth");
router.use(express.json());


router.post('/sendNotification/:userId/:message',auth,(req,res) =>{
    let toUserId=req.params.userId;
    let message=req.params.message;
    let fromUserId=req.body.User;
    const { Notification , validateNotification}=require('../models/notification')
    try{
        let newNotification= await createNotification(fromUserId,toUserId,message);
        let result=await newNotification.save();
        if(!result) 
        res.status(400).send(`Error in creating notification object`)
        res.status(200).send(`Notification created ${newNotification}`)

    }catch (ex) 
    {
        res.status(400).send("Error to send request");
    }

})


module.exports =router;