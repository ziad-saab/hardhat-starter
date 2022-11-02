import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("VolcanoCoin", function () {
  async function deployVolcanoCoin() {
    const [owner, otherAccount] = await ethers.getSigners();

    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();

    return { volcanoCoin, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should have an initial supply of 10000", async function () {
      const { volcanoCoin } = await loadFixture(deployVolcanoCoin);

      expect(await volcanoCoin.getTotalSupply()).to.equal(10000);
    });

    it("Should assign the initial supply to the owner", async function () {
      const { volcanoCoin, owner } = await loadFixture(deployVolcanoCoin);

      const totalSupply = await volcanoCoin.getTotalSupply();
      expect(await volcanoCoin.balances(owner.address)).to.equal(totalSupply);
    });
  });

  describe("Admin functions", function () {
    describe("Increase Total Supply", function () {
      it("Should allow increasing the supply by 1000 token steps", async function () {
        const { volcanoCoin } = await loadFixture(deployVolcanoCoin);

        const initialTotalSupply = await volcanoCoin.getTotalSupply();
        await volcanoCoin.increaseTotalSupply();
        expect(await volcanoCoin.getTotalSupply()).to.equal(BigNumber.from(initialTotalSupply).add(1000));
      });

      it("Should only allow the owner to increase the total supply", async function () {
        const { volcanoCoin, otherAccount } = await loadFixture(deployVolcanoCoin);

        await expect(
          volcanoCoin.connect(otherAccount).increaseTotalSupply(),
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });
});
