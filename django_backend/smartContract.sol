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

    function getGameResultsByWinner(
        string memory _winner
    ) public view returns (uint[] memory) {
        uint[] memory tempArray = new uint[](gameResults.length);
        uint count = 0;

        for (uint i = 0; i < gameResults.length; i++) {
            // Extract the winner's name from the stored string
            string memory winnerName = extractWinnerName(
                gameResults[i].username
            );
            if (
                keccak256(abi.encodePacked(winnerName)) ==
                keccak256(abi.encodePacked(_winner))
            ) {
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

    function extractWinnerName(
        string memory _username
    ) internal pure returns (string memory) {
        // Find the position of "winner: " in the string
        bytes memory usernameBytes = bytes(_username);
        bytes memory winnerTag = bytes("winner: ");
        uint winnerStart = 0;

        for (uint i = 0; i < usernameBytes.length - winnerTag.length + 1; i++) {
            bool found = true;
            for (uint j = 0; j < winnerTag.length; j++) {
                if (usernameBytes[i + j] != winnerTag[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                winnerStart = i + winnerTag.length;
                break;
            }
        }

        // Extract the winner's name from the string
        bytes memory winnerName = new bytes(usernameBytes.length - winnerStart);
        for (uint k = winnerStart; k < usernameBytes.length; k++) {
            winnerName[k - winnerStart] = usernameBytes[k];
        }

        return string(winnerName);
    }
}
