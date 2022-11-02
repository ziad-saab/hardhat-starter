// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./EllipticCurve.sol";

contract VolcanoNFT is ERC721, Ownable {
  
  Counters.Counter tokenIdCounter;
  using Counters for Counters.Counter;

  struct Point {
    uint256 x;
    uint256 y;
  }

  uint256 constant NUM_POLYS = 20;
  uint256 constant NUM_POINTS_PER_POLY = 3;
  uint256 constant MINT_PRICE = 0.001 ether;

  constructor() ERC721("Volcano NFT", "LAVA") {}

  function mint() public payable returns (uint256) {
    require(msg.value >= MINT_PRICE, "Mint price is 0.001 ETH");
    tokenIdCounter.increment();
    uint256 tokenId = tokenIdCounter.current();
    _safeMint(msg.sender, tokenId);

    return tokenId;
  }

  function withdraw() public onlyOwner returns (bool success) {
    (success,) = payable(msg.sender).call{value: address(this).balance}("");
    require(success, "Withdraw failed");
  }

  function multiply(uint256 x, uint256 y, uint256 k) private pure returns (uint256, uint256) {
    return EllipticCurve.ecMul(
      k,
      x,
      y,
      777,
      997
    );
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    _requireMinted(tokenId);

    Point[] memory points = new Point[](NUM_POLYS * NUM_POINTS_PER_POLY);

    (uint256 randX, uint256 randY) = multiply(tokenId, 888, 777);

    for (uint256 i = 1; i <= NUM_POLYS * 3; i++) {
      (uint256 pX, uint256 pY) = multiply(randX, randY, i);
      points[i - 1] = Point({ x: pX, y: pY });
    }

    string memory allPolys = "";
    for (uint256 i = 0; i < NUM_POLYS; i++) {
      string memory coordinates = "";
      for (uint256 j = 0; j < NUM_POINTS_PER_POLY; j++) {
        coordinates = string(abi.encodePacked(coordinates, Strings.toString(points[i * NUM_POINTS_PER_POLY + j].x), ',', Strings.toString(points[i * NUM_POINTS_PER_POLY + j].y), ','));
      }
      allPolys = string(abi.encodePacked(allPolys, "<polygon points='", coordinates, "' fill='hsla(", Strings.toString(points[i * NUM_POINTS_PER_POLY].x % 59), ",100%,", Strings.toString((points[i * NUM_POINTS_PER_POLY].x % 20) + 50), "%,0.5)' stroke='none' />"));
    }

    string memory svgImage = string(
      abi.encodePacked(
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="350px" height="350px" viewBox="0 0 997 997" style="background-color:#fff">',
          allPolys,
        '</svg>'
      )
    );

    string memory base64Image = Base64.encode(bytes(svgImage));

    // https://github.com/karooolis/placeholder-nft/blob/main/contracts/contracts/PlaceholderNFTERC721.sol
    string memory metadata = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            string(
                abi.encodePacked(
                    "Volcano NFT #",
                    Strings.toString(tokenId)
                )
            ),
            '", "attributes": [], "description": "Volcano NFTs are randomly generated images of an erupting volcano!", "image": "data:image/svg+xml;base64,', base64Image, '"}'
          )
        )
      )
    );

    return string(abi.encodePacked("data:application/json;base64,", metadata));
  }
}