export const contractAddress = "0x8c0de9c7d0e2029811b766982745523f41e3c93a";
export const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "gameResults",
    outputs: [
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getGameResult",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "username",
            type: "string",
          },
        ],
        internalType: "struct GameRecords.GameResult",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_username",
        type: "string",
      },
    ],
    name: "recordWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
