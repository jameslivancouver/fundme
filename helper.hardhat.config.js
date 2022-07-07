const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
};

const developmentChains = ["hardhat", "localhost"];

const initialPrice = 200000000000;
const decimal = 8;

module.exports = {
  networkConfig,
  developmentChains,
  initialPrice,
  decimal,
};
