const { network } = require("hardhat");
const { initialPrice, decimal } = require("../helper.hardhat.config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { log, deploy } = deployments;
  const chainId = network.config.chainId;
  if (chainId == 31337) {
    console.log("local network detected, deploying mocks...");
    const mockV3Aggregator = await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [decimal, initialPrice],
      log: true,
    });
    log(`MockV3Aggregator deployed at ${mockV3Aggregator.address}`);
  }
};

module.exports.tags = ["all", "mocks"];
