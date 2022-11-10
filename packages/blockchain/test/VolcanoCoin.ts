import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { parseEther } from "ethers/lib/utils";

async function deployVolcanoCoin() {
  const [owner, otherAccount] = await ethers.getSigners();

  await deployments.fixture(["coin"]);
  const volcanoCoin = await ethers.getContract("VolcanoCoin");
  return { volcanoCoin, owner, otherAccount };
}

describe("VolcanoCoin", function () {
  describe("Deployment", function () {
    it("Should mint 1000 LAVACOIN to the owner", async function () {
      const { volcanoCoin, owner } = await deployVolcanoCoin();

      expect(await volcanoCoin.balanceOf(owner.address)).to.equal(parseEther("1000"));
    });
  });
});
