import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";

export async function deployVolcanoCoin() {
  const [owner, otherAccount] = await ethers.getSigners();

  const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
  const volcanoCoin = await VolcanoCoin.deploy();

  return { volcanoCoin, owner, otherAccount };
}

describe("VolcanoCoin", function () {
  describe("Deployment", function () {
    it("Should mint 1000 LAVACOIN to the owner", async function () {
      const { volcanoCoin, owner } = await loadFixture(deployVolcanoCoin);

      expect(await volcanoCoin.balanceOf(owner.address)).to.equal(parseEther("1000"));
    });
  });
});
