// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VolcanoNFT is ERC721, Ownable {
  
  Counters.Counter tokenIdCounter;

  using Counters for Counters.Counter;

  constructor() ERC721("Volcano NFT", "LAVA") {}

  function erupt(address to) public onlyOwner returns (uint256) {
    tokenIdCounter.increment();
    uint256 tokenId = tokenIdCounter.current();
    _safeMint(to, tokenId);

    return tokenId;
  }
}