import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { base64, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

const MINT_PRICE = parseEther("0.005");
const overrides = {value: MINT_PRICE};

describe("VolcanoNFT", function () {
  async function deployVolcanoNFT() {
    const [owner, otherAccount] = await ethers.getSigners();

    const VolcanoNFT = await ethers.getContractFactory("VolcanoNFT");
    const volcanoNFT = await VolcanoNFT.deploy();

    return { volcanoNFT, owner, otherAccount };
  }

  describe("Minting", function () {
    it("Should allow to mint the next token if paying at least MINT_PRICE ETH", async function () {
      const { volcanoNFT } = await loadFixture(deployVolcanoNFT);

      const tokenId = await volcanoNFT.callStatic.mint(overrides);
      expect(tokenId).to.equal(1);
    });
  });

  describe("Transfering", function() {
    it("Should allow token transfer between two accounts", async function() {
      const { volcanoNFT, owner, otherAccount } = await loadFixture(deployVolcanoNFT);

      const tokenId = await volcanoNFT.callStatic.mint(overrides);
      await volcanoNFT.mint(overrides);
      expect(await volcanoNFT.ownerOf(tokenId)).to.equal(owner.address);

      await volcanoNFT["safeTransferFrom(address,address,uint256)"](owner.address, otherAccount.address, tokenId);
      expect(await volcanoNFT.ownerOf(tokenId)).to.equal(otherAccount.address);
    });
  });

  describe("Metadata", function() {
    it("Should output JSON metadata with SVG image", async function() {
      const { volcanoNFT } = await loadFixture(deployVolcanoNFT);
      await volcanoNFT.mint(overrides);
      const [, maybeBase64Json] = (await volcanoNFT.tokenURI(1)).split(",", 2);
      const maybeJson = Buffer.from(base64.decode(maybeBase64Json)).toString("utf-8");

      const metadata = JSON.parse(maybeJson);
      const [, maybeBase64SvgImage] = metadata.image.split(",", 2);
      const maybeSvgImage = Buffer.from(base64.decode(maybeBase64SvgImage)).toString("utf-8");
      expect(maybeSvgImage).to.match(/<svg/);
    });
  });

  describe("Funding", function() {
    it("Should allow the owner to withdraw the funds", async function() {
      const { volcanoNFT, owner } = await loadFixture(deployVolcanoNFT);

      expect(
        await volcanoNFT.mint(overrides)
      ).to.changeEtherBalances(
        [volcanoNFT, owner],
        [MINT_PRICE, -MINT_PRICE]
      );
      
      expect(
        await volcanoNFT.withdraw()
      ).to.changeEtherBalances(
        [volcanoNFT, owner],
        [-MINT_PRICE, MINT_PRICE]
      );
    });
  });
});
