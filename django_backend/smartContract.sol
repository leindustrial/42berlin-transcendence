/**
 *Submitted for verification at Etherscan.io on 2024-08-07
*/

// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract GameRecords {
    struct GameResult {
        string username;
    }

    GameResult[] public gameResults;

    function recordWinner(string memory _username) public {
        gameResults.push(GameResult(_username));
    }

    function getGameResultsByUsername(string memory _username) public view returns (uint[] memory) {
        uint[] memory tempArray = new uint[](gameResults.length);
        uint count = 0;

        for (uint i = 0; i < gameResults.length; i++) {
            if (keccak256(abi.encodePacked(gameResults[i].username)) == keccak256(abi.encodePacked(_username))) {
                tempArray[count] = i;
                count++;
            }
        }

        uint[] memory result = new uint[](count);
        for (uint j = 0; j < count; j++) {
            result[j] = tempArray[j];
        }

        return result;
    }
}