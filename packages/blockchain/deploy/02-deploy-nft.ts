import { DeployFunction } from "hardhat-deploy/types";

const deployNft: DeployFunction = async (hre) => {
  const { deployments, ethers } = hre;
  const { deploy } = deployments;
  const [owner] = await ethers.getSigners();

  const volcanoCoin = await deployments.get("VolcanoCoin");

  await deploy("VolcanoNFT", {
    from: owner.address,
    log: true,
    args: [volcanoCoin.address],
  });
};
deployNft.tags = ["all", "nft"];
deployNft.dependencies = ["coin"];

export default deployNft;