// require("@nomiclabs/hardhat-web3");
// const { task } = require("hardhat/config");

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const address = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(address);
    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });

module.exports = {};
