import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("VolcanoNFT", function () {
  async function deployVolcanoNFT() {
    const [owner, otherAccount] = await ethers.getSigners();

    const VolcanoNFT = await ethers.getContractFactory("VolcanoNFT");
    const volcanoNFT = await VolcanoNFT.deploy();

    return { volcanoNFT, owner, otherAccount };
  }

  describe("Minting", function () {
    it("Should allow owner to mint the next token", async function () {
      const { volcanoNFT, otherAccount } = await loadFixture(deployVolcanoNFT);

      const tokenId = await volcanoNFT.callStatic.erupt(otherAccount.address);
      expect(tokenId).to.equal(1);
    });
    
    it("Should revert if not called by owner", async function () {
      const { volcanoNFT, owner, otherAccount } = await loadFixture(deployVolcanoNFT);

      await expect(
        volcanoNFT.connect(otherAccount.address).callStatic.erupt(owner.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transfering", function() {
    it("Should allow token transfer between two accounts", async function() {
      const { volcanoNFT, owner, otherAccount } = await loadFixture(deployVolcanoNFT);

      const tokenId = await volcanoNFT.callStatic.erupt(owner.address);

      await volcanoNFT.erupt(owner.address);
      expect(await volcanoNFT.ownerOf(tokenId)).to.equal(owner.address);

      await volcanoNFT["safeTransferFrom(address,address,uint256)"](owner.address, otherAccount.address, tokenId);
      expect(await volcanoNFT.ownerOf(tokenId)).to.equal(otherAccount.address);
    });
  });
});
