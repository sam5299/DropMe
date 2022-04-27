
const {Wallet}=require('../models/wallet')


// Create a wallet 
async function createWallet(userId){
    const newWallet=new Wallet({ "creditPoint": 0, "safetyPoint": 0, "User": userId });
    return await newWallet.save()
}

//  Updat balance by +/-number
async function updateWallet(userId,amount){
    let [walletObj] = await Wallet.find({User:userId})
    //console.log(walletObj);
    walletObj.creditPoint=walletObj.creditPoint+parseInt(amount)
    return await walletObj.save()
}

// convert safety points into credit points
async function addSafetyPoints(userId){
    let [walletObj] = await Wallet.find({User:userId})
    //console.log(walletObj);
    walletObj.creditPoint=walletObj.creditPoint+walletObj.safetyPoint;
    walletObj.safetyPoint=0;
    return await walletObj.save()
}


// apply penalty
async function addPenalty(userId,penalty){
    let [walletObj] = await Wallet.find({User:userId})
    //console.log(walletObj);
    // walletObj.creditPoint=walletObj.creditPoint+walletObj.safetyPoint;
    walletObj.safetyPoint-=parseInt(penalty);
    return await walletObj.save()
}




module.exports ={
    createWallet,
    updateWallet,
    addSafetyPoints,
    addPenalty
}