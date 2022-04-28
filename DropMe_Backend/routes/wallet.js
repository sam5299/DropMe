//const config = require("config");
//const jwt = require("jsonwebtoken");
const express = require("express");
//const bodyParser = require("body-parser");
const router = express.Router();
const auth = require("../middleware/auth");
const { Wallet, validateWalletDetails } = require('../models/wallet')
const { createWallet ,
    updateWallet,
    addSafetyPoints,
    addPenalty
 } = require('../services/wallet')
    
router.use(express.json());


// create the wallet object
router.post('/createWallet', auth, async(req, res) => {

    let { error } = validateWalletDetails({ "creditPoint": 0, "safetyPoint": 0, "User": req.body.User });
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let newWallet = await createWallet( req.body.User );
        if (!newWallet)
            return res.status(400).send("Something went wrong try again latter:");
        return res.status(200).send(newWallet)
    } catch (err) {
        return res.send("Error in creating wallet:", err.message)
    }

})


// Update wallet balance with positive or negative number
router.put('/updateBalance/:amount', auth, async(req, res) => {
    let amount = req.params.amount;
    try {
        let updateResult  = await updateWallet(req.body.User,amount)
        // if (updateResult == null)
        //     return res.status(400).send("Error in updating balance please try after time");
        // let res =await addPenalty(req.body.User,100);
        return res.status(200).send(updateResult);
    } catch (ex) {
        return res.status(500).send("Error",ex)
    }
})

// Convert safety points into credit points
router.put('/addSafetyPoints',auth,async (req,res) =>{
    try{
        let updateResult= await addSafetyPoints(req.body.User);
        return res.status(200).send(updateResult);
    } catch (ex) {
        return res.status(500).send("Error",ex)
    }
})

module.exports = router
