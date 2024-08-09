export const contractAddress = "0x9659E388f46CF770f2c22E717eC8806F4aCDe2A1";
export const abi = [
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "gameResults",
    outputs: [{ internalType: "string", name: "username", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_username", type: "string" }],
    name: "getGameResultsByUsername",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_username", type: "string" }],
    name: "recordWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
