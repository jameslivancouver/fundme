const { EtherscanProvider } = require("@ethersproject/providers");
const { ethers, getNamedAccounts } = require("hardhat");

(async () => {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log(`Got contract FundMe at ${fundMe.address}`);
  console.log("Withdrawing from contract...");
  const withdrawTransaction = await fundMe.withdraw();
  await withdrawTransaction.wait(1);
  console.log("Got it back!");
  console.log(
    "Money has been successfully withdrawed from FundMe contract, the balance now is ",
    (await fundMe.provider.getBalance(fundMe.address)).toString(),
    " ETH"
  );
})();
