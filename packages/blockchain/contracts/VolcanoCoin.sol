// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is Ownable {
    uint256 totalSupply = 10000;
    mapping(address => uint256) public balances;
    mapping(address => Payment[]) public payments;

    error InsufficientFunds(uint256 requestedAmount, uint256 availableAmount);

    struct Payment {
        address recipient;
        uint256 amount;
    }

    event SupplyChange(address indexed changer, uint256 newSupply);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    
    constructor() {
        balances[owner()] = totalSupply;
    }

    function recordPayment(address sender, address receiver, uint256 amount) private {
        payments[sender].push(Payment({
            recipient: receiver,
            amount: amount
        }));
    }

    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    function increaseTotalSupply() public onlyOwner {
        totalSupply += 1000;
        emit SupplyChange(msg.sender, totalSupply);
    }

    function transfer(uint256 amount, address receiver) public {
        uint256 senderBalance = balances[msg.sender];
        if (senderBalance < amount) {
            revert InsufficientFunds({
                requestedAmount: amount,
                availableAmount: senderBalance
            });
        } else {
            balances[msg.sender] -= amount;
            balances[receiver] += amount;

            recordPayment({
                sender: msg.sender,
                receiver: receiver,
                amount: amount
            });

            emit Transfer({
                from: msg.sender,
                to: receiver,
                amount: amount
            });
        }
    }

    function paymentsByAddress(address addr) public view returns (Payment[] memory) {
        return payments[addr];
    }
}