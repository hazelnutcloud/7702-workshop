// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "solady/tokens/ERC20.sol";

contract MintableERC20 is ERC20 {
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function name() public pure override returns (string memory) {
        return "MintableERC20";
    }

    function symbol() public pure override returns (string memory) {
        return "MINT";
    }
}
