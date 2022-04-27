const auth = require("../middleware/auth");
const express = require('express');
const router = express.Router;

router.use(express.json());

//create new trip 
router.post("/");