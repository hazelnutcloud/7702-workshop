export const vault = {
  address: "0x17dC2891929d674500D63077b5EA0e258fa5911E",
  abi: [
    {
      type: "constructor",
      inputs: [{ name: "token_", type: "address", internalType: "address" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "balances",
      inputs: [{ name: "", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "deposit",
      inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "token",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "contract ERC20" }],
      stateMutability: "view",
    },
  ],
} as const;
