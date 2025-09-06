// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Vm} from "forge-std/Vm.sol";
import {Vault} from "../src/Vault.sol";
import {MintableERC20} from "../src/MintableErc20.sol";
import {Batcher} from "../src/Batcher.sol";
import {ERC20} from "solady/tokens/ERC20.sol";

contract Sans7702 is Script {
    MintableERC20 token = new MintableERC20();
    Vault vault = new Vault(address(token));
    Batcher batcher = new Batcher();

    function run() public {
        Vm.Wallet memory eoa = vm.createWallet("eoa with 7702");
        vm.deal(eoa.addr, 1 ether);

        Batcher.Call[] memory calls = new Batcher.Call[](3);

        calls[0] = Batcher.Call({
            to: address(token),
            value: 0,
            data: abi.encodeCall(MintableERC20.mint, (eoa.addr, 100 ether))
        });
        calls[1] = Batcher.Call({
            to: address(token),
            value: 0,
            data: abi.encodeCall(ERC20.approve, (address(vault), 100 ether))
        });
        calls[2] = Batcher.Call({
            to: address(vault),
            value: 0,
            data: abi.encodeCall(Vault.deposit, (100 ether))
        });

        vm.startBroadcast(eoa.privateKey);

        // one transaction
        vm.signAndAttachDelegation(address(batcher), eoa.privateKey);
        Batcher(eoa.addr).execute(calls);

        vm.stopBroadcast();
    }
}
