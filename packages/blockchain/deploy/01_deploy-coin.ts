import { DeployFunction } from "hardhat-deploy/types";

const deployCoin: DeployFunction = async (hre) => {
  const { deployments, ethers } = hre;
  const { deploy } = deployments;
  const [owner] = await ethers.getSigners();

  await deploy("VolcanoCoin", {
    from: owner.address,
    log: true,
  });
};
deployCoin.tags = ["all", "coin"];

export default deployCoin;