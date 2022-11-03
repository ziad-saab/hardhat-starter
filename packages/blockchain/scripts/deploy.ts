import { ethers } from "hardhat";

async function main() {
  console.log("Deploying VolcanoCoin...");
  const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
  const volcanoCoin = await VolcanoCoin.deploy();

  await volcanoCoin.deployed();
  console.log(`Deployed VolcanoCoin: ${volcanoCoin.address}`);
  
  console.log("Deploying VolcanoNFT...");
  const VolcanoNFT = await ethers.getContractFactory("VolcanoNFT");
  const volcanoNFT = await VolcanoNFT.deploy(volcanoCoin.address);

  await volcanoNFT.deployed();
  console.log(`Deployed VolcanoNFT: ${volcanoNFT.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
