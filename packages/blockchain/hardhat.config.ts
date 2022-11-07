import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimize: true,
    },
  },
  typechain: {
    outDir: "../contract-types/src",
  },
  networks: process.env.GOERLI_KEY ? {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.GOERLI_KEY || ""],
    },
  } : {},
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};

export default config;
