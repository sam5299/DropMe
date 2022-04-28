const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const auth = require("../middleware/auth");
const { Wallet ,validateWalletDetails } = require('../models/wallet')
const { createWallet }= require('../services/wallet')
 // const {

// } = require('../services/ride');
router.use(express.json());

router.post('/', auth, async(req, res) => {
    let userId = req.body.userId;
    let { error } = validateWalletDetails(0, 0, userId);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        return await createWallet(0, 0, userId);
    } catch (err) { 
        res.status(500).send("Error in creating wallet:",err) 
    }

})


module.exports = router;