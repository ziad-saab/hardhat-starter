// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VolcanoCoin is ERC20 {
    constructor() ERC20("Volcano Coin", "LAVACOIN") {
        _mint(msg.sender, 1000 ether);
    }
}