const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {validateTrip} = require('../models/trip');
const {getRides, addTripRequest} = require('../services/ride');
const {requestRide} = require('../services/trip');
router.use(express.json());

router.post("/searchForRide",auth,  async(req, res)=>{
    //console.log("called")
    delete req.body.userId;
    let {error} = validateTrip(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let rides = await getRides(req.body.source, req.body.destination, req.body.date, req.body.time);

    let requestedRide = await requestRide(req.body, "6269a4b7d159c946c595f5f5");
    //console.log("requestedRide:"+requestedRide);

    return res.status(200).send("/searchForRide called and result:"+rides);
});

module.exports = router;