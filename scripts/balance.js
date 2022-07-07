require("dotenv").config();
const { web3 } = require("hardhat");
yargs = require("yargs");

const command = yargs.argv._[0]; // In this case , command is not necessarily useful,  because there is only one function - getBalance ;
// However, if there are multiple functions, we can use command to switch to different function
const account = yargs.argv.account;
const network = yargs.argv.network;

if (command === "balance") {
  (async function getBalance() {
    if (account) {
      if (network === "rinkeby") {
        web3.setProvider(process.env.RINKEBY_URL);
      }
      try {
        const address = web3.utils.toChecksumAddress(account);
        const balance = await web3.eth.getBalance(address);
        console.log(web3.utils.fromWei(balance, "ether"), "ETH");
      } catch (e) {
        console.log("Please make sure you have entered the correct address");
      }
    } else {
      console.log("Please make sure you set account's address");
    }
  })()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
} else {
  console.log("Please explicitly indicate if you want to check balance ");
}

//  .then(() => {
//       process.exit(0);
//     })
//     .catch((e) => {
//       console.error(e);
//       process.exit(1);
//     });
// console.log(yargs.argv);
// console.log(network);

// const Web3 = require("web3");
// const web3 = new Web3(process.env.RINKEBY_URL);
// const web3 = new Web3(process.env.LOCAL_HOST_URL);

// var Web3 = require("web3");
// var web3 = new Web3("http://localhost:8545");

// const { web3 } = require("hardhat");
