const { Wallet } = require('../models/wallet')


// Create a wallet 
async function createWallet(userId) {
    const newWallet = new Wallet({ "creditPoint": 500, "usedCreditPoint":0, "safetyPoint": 0, "User": userId });
    return await newWallet.save()
}

// get wallet 
async function getWallet(userId) {
    //const newWallet=new Wallet({ "creditPoint": 0, "safetyPoint": 0, "User": userId });
    return await Wallet.findOne({ User: userId })
}


//  Update balance by +/-number
async function updateWallet(userId, amount) {
    let [walletObj] = await Wallet.find({ User: userId })
        //console.log(walletObj);
    walletObj.creditPoint = walletObj.creditPoint + parseInt(amount)
    return await walletObj.save()
}


//  Update updateUsedCreditPoints by +/-number
async function updateUsedCredit(userId, amount) {
    //console.log("Amount in wallet:"+amount);
    let walletObj = await Wallet.findOne({ User: userId });
    //console.log("@@@"+walletObj);
    //walletObj.usedCreditPoint = walletObj.usedCreditPoint + amount;
    walletObj.usedCreditPoint+= amount;
    return await walletObj.save();
}


// convert safety points into credit points
async function addSafetyPoints(userId) {
    let [walletObj] = await Wallet.find({ User: userId })
        //console.log(walletObj);
    walletObj.creditPoint = walletObj.creditPoint + walletObj.safetyPoint;
    walletObj.safetyPoint = 0;
    return await walletObj.save()
}


// apply penalty
async function addPenalty(userId, penalty) {
    let [walletObj] = await Wallet.find({ User: userId })
        //console.log(walletObj);
        // walletObj.creditPoint=walletObj.creditPoint+walletObj.safetyPoint;
    walletObj.safetyPoint -= parseInt(penalty);
    return await walletObj.save()
}




module.exports = {
    createWallet,
    updateWallet,
    updateUsedCredit,
    addSafetyPoints,
    addPenalty,
    getWallet
}