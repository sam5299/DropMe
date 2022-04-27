const express = require("express");
const Wallet=require('../models/wallet')


// Create a wallet 
async function createWallet(userId){
    const newWallet=new Wallet(0,0,userId);
    return await newWallet.save()
}



module.exports ={
    createWallet
}