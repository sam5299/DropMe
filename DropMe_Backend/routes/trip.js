const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {validateTrip} = require('../models/trip');
const {getRides} = require('../services/ride');

router.use(express.json());

router.post("/searchForRide",auth,  async(req, res)=>{
    delete req.body.userId;
    let {error} = validateTrip(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let rides = await getRides(req.body.source, req.body.destination, req.body.date, req.body.time);

    sendRideRequest("6268fab263310c1dcd56ecbd");

    return res.status(200).send("/searchForRide called and result:"+rides);
});

module.exports = router;