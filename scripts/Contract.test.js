const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { expect, assert } = require("chai");

describe("Fund Contract", function () {
  let deployer, fundMe, mockV3Aggregator;
  let sendValue = ethers.utils.parseEther("1");
  beforeEach(async () => {
    await deployments.fixture(["all"]);
    deployer = (await getNamedAccounts()).deployer;
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("Constructor", function () {
    it("priceFeed address should be set as expected", async () => {
      const response = await fundMe.getPriceFeed();
      assert.equal(mockV3Aggregator.address, response);
    });
  });

  describe("Fund function", function () {
    it("Fails if you don't have enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH."
      );
    });

    it("funder has been added to funders array accordingly", async () => {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.getFunder(0);
      assert.equal(funder, deployer);
    });
    it("addresstoAmountFunded mapping has been created accordingly", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.getAddressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });
  });

  describe("Withdraw function", function () {
    beforeEach(async () => {});
    it("Should be able to withdraw from single funder", async () => {
      await fundMe.fund({ value: sendValue });
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const withdrawTransaction = await fundMe.withdraw();
      const withdrawTransactionReceipt = await withdrawTransaction.wait();
      const { gasUsed, effectiveGasPrice } = withdrawTransactionReceipt;
      const gasCost = await gasUsed.mul(effectiveGasPrice);
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);
      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.address
      );

      assert.equal(
        endingDeployerBalance.add(gasCost).toString(),
        startingDeployerBalance.add(startingFundMeBalance).toString()
      );
      assert.equal(endingFundMeBalance.toString(), 0);

      assert.equal(
        (await fundMe.getAddressToAmountFunded(deployer)).toString(),
        0
      );

      await expect(fundMe.getFunder(0)).to.be.reverted;
    });
    it("Should be able to withdraw from multiple funder", async () => {
      const accounts = await ethers.getSigners();
      //   for (const account of accounts) {
      //     const fundMeConnectedContract = await fundMe.connect(account);
      //     await fundMeConnectedContract.fund({ value: sendValue });
      //   }
      for (i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }
      startingDeployerBalance = await ethers.provider.getBalance(deployer);
      startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
      const withdrawTransaction = await fundMe.withdraw();
      const withdrawTransactionReceipt = await withdrawTransaction.wait();
      const { gasUsed, effectiveGasPrice } = withdrawTransactionReceipt;
      const gasCost = await gasUsed.mul(effectiveGasPrice);
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);
      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.address
      );

      assert.equal(
        endingDeployerBalance.add(gasCost).toString(),
        startingDeployerBalance.add(startingFundMeBalance).toString()
      );
      assert.equal(endingFundMeBalance.toString(), 0);
      //   for (const account of accounts) {
      //     assert.equal(
      //       (await fundMe.getAddressToAmountFunded(account.address)).toString(),
      //       0
      //     );
      //   }
      for (i = 0; i < 6; i++) {
        assert.equal(
          (
            await fundMe.getAddressToAmountFunded(accounts[i].address)
          ).toString(),
          0
        );
      }
      await expect(fundMe.getFunder(0)).to.be.reverted;
    });

    it("Only owner can withdraw from FundMe contract", async () => {
      const accounts = await ethers.getSigners();
      const fundMeConnectedContract = await fundMe.connect(accounts[3]);
      await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
        "FundMe__NotOwner"
      );
    });
  });
});
