const { ethers, getNamedAccounts } = require("hardhat");
// const { assert } = require("chai");

// describe("fund the contract", function () {
//   beforeEach(async () => {});
//   it("try fund", async () => {

//   });
// });
console.log(network.name);

async function fundContract() {
  const deployer = (await getNamedAccounts()).deployer;
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log(`Got contract FundMe at ${fundMe.address}`);
  console.log("Funding contract...");
  const fundTransaction = await fundMe.fund({
    value: ethers.utils.parseEther("0.1"),
  });
  await fundTransaction.wait(1);
  //   assert(
  //     await fundMe.provider.getBalance(fundMe.address),
  //     ethers.utils.parseEther("0.1")
  //   );
  console.log("Funded!");
  console.log(
    "Successfully fund the FundMe contract with ",
    (await fundMe.provider.getBalance(fundMe.address)).toString(),
    " by " + (await getNamedAccounts()).deployer
  );
}
fundContract()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
