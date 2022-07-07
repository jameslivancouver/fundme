const {
  networkConfig,
  developmentChains,
  initialPrice,
  decimal,
} = require("../helper.hardhat.config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    // console.log("local network detected, deploying mocks...");
    // const ethUsdAggregator = await deploy("MockV3Aggregator", {
    //   contract: "MockV3Aggregator",
    //   from: deployer,
    //   args: [decimal, initialPrice],
    //   log: true,
    // });
    // log(`MockV3Aggregator deployed at ${ethUsdAggregator.address}`);
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
    console.log(ethUsdPriceFeedAddress);
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  }

  //  const ethUsdPriceFeedAddress =
  //    networkConfig[chainId]["ethUsdPriceFeedAddress"];
  const args = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    contract: "FundMe",
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`FundMe contract deployed at ${fundMe.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
};

module.exports.tags = ["all", "fundme"];
