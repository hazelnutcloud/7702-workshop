// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "solady/tokens/ERC20.sol";

contract Vault {
    ERC20 public token;

    mapping(address => uint256) public balances;

    constructor(address token_) {
        token = ERC20(token_);
    }

    function deposit(uint256 amount) external {
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");

        balances[msg.sender] += amount;
    }
}
