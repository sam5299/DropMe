const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {validateTrip} = require('../models/trip');
const {getRides, addTripRequest} = require('../services/ride');
const {requestRide} = require('../services/trip');
router.use(express.json());
 
router.get("/searchForRide",auth,  async(req, res)=>{
    //console.log("called")
    delete req.body.userId;
    let {error} = validateTrip(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let rides = await getRides(req.body.source, req.body.destination, req.body.date, req.body.time);
    return res.status(200).send("/searchForRide called and result:"+rides);
});

router.post("/requestRide/:rid", auth, async(req, res)=> {
    delete req.body.userId;

    //check if passenger has sufficent balance for booking ride.

    let {error} = validateTrip(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let requestedRide = await requestRide(req.body, req.params.rid);
    if(!requestRide) return res.status(400).send("something failed cannot request ride");

    return res.status(200).send("request sent:"+requestedRide);
});

module.exports = router;