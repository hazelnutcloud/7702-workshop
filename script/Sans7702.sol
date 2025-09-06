// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Vm} from "forge-std/Vm.sol";
import {Vault} from "../src/Vault.sol";
import {MintableERC20} from "../src/MintableErc20.sol";

contract Sans7702 is Script {
    MintableERC20 token = new MintableERC20();
    Vault vault = new Vault(address(token));

    function run() public {
        Vm.Wallet memory eoa = vm.createWallet("normal eoa");
        vm.deal(eoa.addr, 1 ether);

        vm.startBroadcast(eoa.privateKey);

        // three separate transaction
        token.mint(eoa.addr, 100 ether);
        token.approve(address(vault), 100 ether);
        vault.deposit(100 ether);

        vm.stopBroadcast();
    }
}
