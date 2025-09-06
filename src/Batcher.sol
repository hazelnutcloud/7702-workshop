// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Batcher {
    struct Call {
        bytes data;
        address to;
        uint256 value;
    }

    function execute(Call[] memory calls) external payable {
        for (uint256 i = 0; i < calls.length; i++) {
            Call memory call = calls[i];
            (bool success, bytes memory result) = call.to.call{
                value: call.value
            }(call.data);
            require(success, string(result));
        }
    }
}
