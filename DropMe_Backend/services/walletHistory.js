const {
  WalletHistory,
  validateWalletHistoryDetails,
} = require("../models/wallet_history");

//method to add new entry in wallet history collection
async function addNewHistory(body) {
  return new WalletHistory(body);
}

//method to get history of user
async function getUserWalletHistory(userId) {
  return WalletHistory.find({ User: userId });
}

module.exports = { addNewHistory, getUserWalletHistory };
