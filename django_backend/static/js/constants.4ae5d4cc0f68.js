export const contractAddress = "0x00b87EA040F64a4D22A348b9694eA573Ce82867D";
export const abi = [
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "gameResults",
    outputs: [{ internalType: "string", name: "username", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_winner", type: "string" }],
    name: "getGameResultsByWinner",
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
