import { ethers } from "hardhat";

async function main() {
  console.log("deploying...");
  const VolcanoNFT = await ethers.getContractFactory("VolcanoNFT");
  const volcanoNFT = await VolcanoNFT.deploy();

  await volcanoNFT.deployed();

  console.log(`Deployed: ${volcanoNFT.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
