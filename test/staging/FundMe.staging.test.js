const { ethers, network, getNamedAccounts } = require("hardhat");
const { assert } = require("chai");
const { developmentChains } = require("../../helper.hardhat.config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging Tests", function () {
      let fundMe, deployer, sendValue;
      beforeEach(async function () {
        deployer = await getNamedAccounts().deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
        sendValue = ethers.utils.parseEther("0.1");
      });
      it("Allows people to fund and withdraw", async function () {
        console.log("starting fund");
        const fundMeTransaction = await fundMe.fund({ value: sendValue });
        await fundMeTransaction.wait(1);
        console.log("starting withdraw");
        const withdrawTransaction = await fundMe.withdraw();
        await withdrawTransaction.wait();
        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        );
        console.log(
          endingFundMeBalance.toString() +
            " should equal 0, running assert equal..."
        );
        assert.equal(endingFundMeBalance.toString(), 0);
      });
    });
